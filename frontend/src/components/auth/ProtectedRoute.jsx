import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
export default function ProtectedRoute({ children }) { const { user, isLoading } = useAuth(); if (isLoading) return <main className="auth-canvas grid min-h-svh place-items-center"><div className="size-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" /></main>; return user ? children : <Navigate to="/login" replace /> }
