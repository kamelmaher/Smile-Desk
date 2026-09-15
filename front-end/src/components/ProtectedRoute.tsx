import { Navigate, Outlet } from "react-router-dom"
import Spinner from "./Spinner"
import { useAuthStore } from "../store/auth.store"
import type { User } from "../types/User"

type ProtectedRouteProps = {
    role?: User["role"]
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
    const { authChecked, isAuthenticated, user, loading } = useAuthStore()

    if (!authChecked || loading) return <Spinner />
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (role && user?.role !== role) return <Navigate to="/dashboard" replace />

    return <Outlet />
}
