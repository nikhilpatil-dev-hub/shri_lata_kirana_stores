import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import CheckEmailPage from './pages/auth/CheckEmailPage'
import DashboardPage from './pages/DashboardPage'
import CustomersPage from './pages/CustomersPage'
import TransactionsPage from './pages/TransactionsPage'
import PaymentsPage from './pages/PaymentsPage'
import ShopSetupPage from './pages/ShopSetupPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import ShopGate from './components/layout/ShopGate'
import AuthLayout from './components/layout/AuthLayout'

export default function App() {
  return <ThemeProvider><LanguageProvider><AuthProvider><Routes>
    <Route element={<AuthLayout />}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/check-email" element={<CheckEmailPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Route>
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/shop-setup" element={<ShopSetupPage />} />
      <Route element={<ShopGate />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes><Toaster position="top-center" /></AuthProvider></LanguageProvider></ThemeProvider>
}
