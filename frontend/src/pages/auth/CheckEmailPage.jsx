import { ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthShell, { Brand } from '../../components/auth/AuthShell'

export default function CheckEmailPage() {
  const [params] = useSearchParams()
  const type = params.get('type') === 'reset' ? 'reset' : 'verify'
  const email = params.get('email')
  const isReset = type === 'reset'
  return <AuthShell compact><div className="p-6 text-center sm:p-8"><Brand small /><div className="mx-auto grid size-16 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10"><MailCheck className="size-8 text-emerald-300" /></div><h1 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Check your email</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">{isReset ? 'We have sent a secure password reset link' : 'We have sent an email verification link'}{email && <> to <span className="font-semibold text-slate-200">{email}</span></>}.</p><div className="mt-6 rounded-2xl border border-slate-700/70 bg-slate-800/40 p-4 text-left"><div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-cyan-300"/><p className="text-sm leading-6 text-slate-300">Open the link in your email to continue. For your security, the link expires after a short time.</p></div></div><Link to="/login" className="shine-button mt-7 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-4 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-cyan-400">BACK TO LOGIN</Link><Link to={isReset ? '/forgot-password' : '/register'} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-emerald-300"><ArrowLeft className="size-4" />Use a different email</Link></div></AuthShell>
}
