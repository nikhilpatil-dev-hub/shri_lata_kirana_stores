import { CheckCircle2, CircleAlert } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AuthShell, { Brand } from '../../components/auth/AuthShell'
import { authService } from '../../services/auth.service'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState(token ? 'loading' : 'error')
  const [message, setMessage] = useState(token ? 'Activating your account securely…' : 'This verification link is missing or invalid.')
  useEffect(() => {
    if (!token) return undefined
    const activate = async () => {
      try { await authService.verifyEmail(token); setStatus('success'); setMessage('Your email is verified and your Digital Khata is ready.'); toast.success('Email verified successfully!') }
      catch (error) { setStatus('error'); setMessage(authService.getErrorMessage(error)) }
    }
    activate()
  }, [token])
  const success = status === 'success'
  return <AuthShell compact><div className="p-6 py-10 text-center sm:p-8 sm:py-12"><Brand small /><div className={`mx-auto grid size-16 place-items-center rounded-2xl border ${success ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-amber-400/30 bg-amber-400/10'}`}>{success ? <CheckCircle2 className="size-9 text-emerald-300" /> : <CircleAlert className="size-9 text-amber-300" />}</div><h1 className="mt-5 text-2xl font-extrabold text-white">{status === 'loading' ? 'Verifying email' : success ? 'Email Verified Successfully' : 'Verification unavailable'}</h1><p className="mt-3 text-sm leading-6 text-slate-400">{message}</p>{status !== 'loading' && <Link to="/login" className="shine-button mt-7 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3.5 text-sm font-extrabold tracking-wide text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-teal-300">LOGIN TO YOUR DIGITAL KHATA</Link>}</div></AuthShell>
}
