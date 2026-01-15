import { useEffect } from "react"
import { Link } from "react-router-dom"

import { useAuth } from '../context/AuthContext'
import { useTasks } from "../context/TasksContext"

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const { setTasks } = useTasks()

    useEffect(() => {
        // Cierra sesión al cerrar la pestaña del navegador pero no al refrescarla
        const navigationEntries = performance.getEntriesByType("navigation")[0];
        if (navigationEntries && navigationEntries.type !== "reload") closeSession()
    }, [])

    const titleUser = () => {
        const username = user && isAuthenticated ? `- ${user.username}` : ''
        return username
    }

    const closeSession = () => {
        setTasks([])
        logout()
    }

    const jsxml =
        <nav className="sticky top-0 z-1000 bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
            <h1><Link to="/">Task Manager <span className="font-bold overflow-hidden whitespace-nowrap">{titleUser()}</span></Link></h1>
            <ul className="flex gap-x-2">
                {
                    isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/tasks" className="my-button">Tasks</Link>
                            </li>
                            <li>
                                <Link to="/tasks/new" className="my-button">New task</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={closeSession} className="my-button">Logout</Link>
                            </li>
                        </>
                    )
                        :
                        (
                            <>
                                <li>
                                    <Link to="/login" className="my-button">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="my-button">Register</Link>
                                </li>
                            </>
                        )
                }
            </ul>
        </nav>

    return jsxml
}
