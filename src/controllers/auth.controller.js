import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import User from '../models/user.model.js'
import { createAccessToken } from '../libs/jwt.js'

// para acceder a los datos se requiere iniciar node con el script "nodemon --env-file=.env src/index.js" en package.json
const eUser = process.env.EMAIL_USER
const ePass = process.env.EMAIL_PASS
const TOKEN_SECRET = process.env.TOKEN_SECRET

export const register = async (req, res) => {
    const { email, password, username } = req.body

    try {
        const userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json(["Looks like you already have an account! \n Sign in to start."])

        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            failLogin: 0
        })
        const userSaved = await newUser.save()
        const token = await createAccessToken({ id: userSaved._id })
        res.cookie('token', token)
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
            failLogin: userSaved.failLogin
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password, failCode } = req.body
    let failCodeGet = failCode

    try {
        const userFound = await User.findOne({ email })
        if (!userFound) return res.status(400).json(["User not found - (dev)serverEmail"])

        if (failCodeGet != null && userFound.failLogin == failCodeGet) {
            await User.updateOne(
                { _id: userFound._id },
                { $set: { failLogin: 0 } }
            )
            userFound.failLogin = 0
            failCodeGet = null
        }
        

        if (userFound.failLogin <= 5) {
            const isMatch = await bcrypt.compare(password, userFound.password)
            if (!isMatch) {
                if (userFound.failLogin == 5) {
                    const rand = Math.floor(Math.random() * (999999999 - 999 + 1)) + 999
                    // await enviarEmail(userFound.email, userFound._id, userFound.username, rand)  // Descomentar en producción
                    await User.updateOne(
                        { _id: userFound._id },
                        { $set: { failLogin: rand } }
                    )
                } else {
                    await User.updateOne(
                        { _id: userFound._id },
                        { $inc: { failLogin: 1 } } // Suma 1 al valor que ya exista en la base de datos
                    )
                }

                return res.status(400).json(["User not found - (dev)serverPass"])
            }

            if (userFound.failLogin > 0) {
                await User.updateOne(
                    { _id: userFound._id },
                    { $set: { failLogin: 0 } }
                )
                userFound.failLogin = 0
            }

            const token = await createAccessToken({ id: userFound._id })
            res.cookie('token', token)
            res.json({
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt,
                failLogin: userFound.failLogin
            })
        } else {
            return res.status(503).json({ message: 'Service Unavailable', failLogin: userFound.failLogin })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


const enviarEmail = async (emailDestino, id, username, codigoVerificacion) => {
    // console.log(eUser, ePass)
    // console.log(emailDestino, id, username, codigoVerificacion)
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // Usamos 465
        secure: true, // true para 465
        auth: {
            user: eUser,
            pass: ePass,
        },
    })

    const info = await transporter.sendMail({
        from: '"dmjDev MERN Login" <dmj.develop@gmail.com>',
        to: emailDestino,
        subject: "Account Locked",
        html: `<h1>Hi ${username}</h1><p>Someone has tried to access your <b>dmjDev MERN Login</b> account unsuccessfully</p><p>To login and unlock your account</p><a href="http://127.0.0.1:5173/login/${codigoVerificacion}">Click here</a>`,
    })

    console.log("Correo enviado con ID: ", info.messageId)
}

// export const profile = async (req, res) => {                                         // TODO
//     const userFound = await User.findById(req.user.id)
//     if (!userFound) return res.status(400).json({ message: "User not found" })
//     return res.json({
//         id: userFound._id,
//         username: userFound.username,
//         email: userFound.email,
//         createdAt: userFound.createdAt,
//         updatedAt: userFound.updatedAt
//     })
// }


// VERIFICA EL TOKEN PARA ASEGURARSE QUE SE ESTÁ LOGUEADO CORRECTAMENTE, SUCEDE DURANTE LOS INTENTOS DE ACCEDER A LAS PARTES DE LA APP
export const verifyToken = async (req, res) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: "Unauthorized" })
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Unauthorized" })
        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json({ message: "Unauthorized" })

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        })
    })
}