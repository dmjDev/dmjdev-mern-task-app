import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa";

import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
    const { signup, isAuthenticated, errors: RegisterErrors, loading } = useAuth()
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate('/')
    }, [isAuthenticated])

    const password = watch("password");
    const onSubmit = handleSubmit(async (values) => {
        signup(values)
    })

    // Función para alternar el estado
    const togglePassword = (e) => {
        e.preventDefault()
        setMostrarPassword(!mostrarPassword);
    };

    const jsxml =
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md" style={{ boxShadow: '0 0 20px 5px rgba(0, 150, 255, 0.4)' }}>
                {
                    RegisterErrors.map((error, i) => (
                        <div className='bg-red-500 text-white px-4 py-2 rounded-md my-2 whitespace-pre-line' key={i}>
                            {error}
                        </div>
                    ))
                }

                <h1 className="text-2xl font-bold">Register</h1>
                <form onSubmit={onSubmit}>
                    <input
                        type='text'
                        {...register("username", { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Username'
                    />
                    {errors.username && (<p className='text-[12px] text-red-500'>Username is required</p>)}
                    <input
                        type='email'
                        {...register("email", { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Email'
                    />
                    {errors.email && (<p className='text-[12px] text-red-500'>Email is required</p>)}
                    <div className='flex'>
                        <input
                            type={mostrarPassword ? "text" : "password"}
                            {...register("password", { required: true })}
                            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                            placeholder='Password'
                        />
                        <button
                            onClick={togglePassword}
                            className="h-10 p-1 mt-2 ml-1 cursor-pointer rounded-md bg-zinc-700 hover:bg-zinc-500 outline-none">{mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password && <p className='text-[12px] text-red-500'>Password is required</p>}
                    <input
                        type="password"
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Repeat password'
                        {...register("confirmPassword", {
                            required: "La confirmación es obligatoria",
                            validate: (value) => value === password || "Las contraseñas no coinciden"
                        })}
                    />
                    {errors.confirmPassword && <p className='text-[12px] text-red-500'>{errors.confirmPassword.message}</p>}
                    <p className='text-[12px] text-gray-400'>Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number</p>
                    <button type='submit' className='my-button-form'>Save</button>
                </form>
                <p className="flex gap-x-2 justify-between  text-gray-400 font-bold align-bottom">
                    Go into your account <Link to='/login' className="text-xl font-bold relative group text-cyan-700 transition-colors duration-300 cursor-pointer">
                        Sing in
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-700 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </p>
            </div>
        </div>

    const jsxmlLoading =
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </div>
        </div>

    if (loading) {
        return jsxmlLoading
    }
    if (!isAuthenticated && !loading) {
        return jsxml
    }
}

export default RegisterPage