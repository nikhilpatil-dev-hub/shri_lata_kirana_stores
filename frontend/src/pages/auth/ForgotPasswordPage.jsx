import { ArrowLeft, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import AuthShell, { Brand } from '../../components/auth/AuthShell'
import { Field, SubmitButton } from '../../components/auth/FormControls'
import { authService } from '../../services/auth.service'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const submit = async (event) => {
    event.preventDefault()
    if (!email) return toast.error('Enter your email address.')
    setLoading(true)
    try { await authService.forgotPassword(email); navigate(`/check-email?type=reset&email=${encodeURIComponent(email)}`) } catch (error) { toast.error(authService.getErrorMessage(error)) } finally { setLoading(false) }
  }
  return <AuthShell compact><div className="p-6 sm:p-8"><Link to="/login" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-emerald-300"><ArrowLeft className="size-4" />Back to login</Link><Brand small /><h1 className="text-center text-2xl font-extrabold text-white">Reset your password</h1><p className="mt-2 text-center text-sm leading-6 text-slate-400">We’ll send a secure reset link to your registered email address.</p><form onSubmit={submit} className="mt-7 space-y-5"><Field label="Email address" icon={Mail} type="email" placeholder="you@shop.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /><SubmitButton loading={loading}>SEND RESET LINK</SubmitButton></form></div></AuthShell>
}
