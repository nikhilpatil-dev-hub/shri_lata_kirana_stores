import { Check } from 'lucide-react'
const rules=[['At least 8 characters',v=>v.length>=8],['One uppercase letter',v=>/[A-Z]/.test(v)],['One number',v=>/\d/.test(v)],['One special symbol',v=>/[^A-Za-z0-9]/.test(v)]]
export default function PasswordStrength({ value }) { return <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs">{rules.map(([text,test])=>{const pass=test(value);return <span key={text} className={`flex items-center gap-1.5 ${pass?'text-emerald-300':'text-slate-500'}`}><Check className="size-3" strokeWidth={pass?3:2}/>{text}</span>})}</div> }
