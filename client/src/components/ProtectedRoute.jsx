import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = () => {
    const { loading, isAuthenticated } = useAuth()
    // console.log(loading, isAuthenticated)

    if (loading) {
        const jsxmlLoad =
            <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </div>
            </div>
        return jsxmlLoad
    }

    if (isAuthenticated && !loading){
        return <Outlet />
    } else {
        return <Navigate to='/login' replace />
    }
}

export default ProtectedRoute
