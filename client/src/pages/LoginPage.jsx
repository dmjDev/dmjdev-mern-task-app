import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signin, isAuthenticated, errors: signinErrors } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate('/tasks')
    }, [isAuthenticated])

    const onSubmit = handleSubmit(data => {
        signin(data)                                //// TODO FAILLOGIN COUNTER
    })

    // Función para alternar el estado
    const togglePassword = (e) => {
        e.preventDefault()
        setMostrarPassword(!mostrarPassword);
    };

    const jsxml = //box-shadow: 0 0 20px 5px rgba(0, 150, 255, 0.7);
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md" style={{ boxShadow: '0 0 20px 5px rgba(0, 150, 255, 0.4)' }}>
                {
                    Object.keys(signinErrors).length > 0 &&
                    <div className='bg-red-500 text-white px-4 py-2 rounded-md my-2 whitespace-pre-line'>
                        {signinErrors[0]}
                    </div>
                }
                <h1 className="text-2xl font-bold">Login</h1>
                <form onSubmit={onSubmit}>
                    <input
                        type='email'
                        {...register("email", { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Email'
                    />
                    {errors.email && (<p className='text-[12px] text-red-500'>Email is required</p>)}
                    <div className="flex">
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
                    <button type='submit' className='my-button-form'>Go</button>
                </form>
                <p className="flex gap-x-2 justify-between  text-gray-400 font-bold align-bottom">
                    Create an account! <Link to='/register' className="text-xl font-bold relative group text-cyan-700 transition-colors duration-300 cursor-pointer">
                        Register
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-700 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </p>
            </div>
        </div>

    if (!isAuthenticated) {
        return jsxml
    }
    return
}

export default LoginPage