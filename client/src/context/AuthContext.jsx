import { createContext, useContext } from "react"

export const AuthContext = createContext()
// useContext nos facilita el acceso a los datos del Provider, en este caso solo con importar useAuth ya disponemos de {signup, user y setUser}
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
