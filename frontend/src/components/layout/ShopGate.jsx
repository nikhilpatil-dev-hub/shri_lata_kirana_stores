import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { businessService } from '../../services/business.service'

export default function ShopGate() {
  const [state, setState] = useState('loading')
  useEffect(() => { let active = true; const timer = window.setTimeout(() => { businessService.shop().then(() => active && setState('ready')).catch(error => { if (active) setState(error.response?.status === 404 ? 'missing' : 'error') }) }, 0); return () => { active = false; window.clearTimeout(timer) } }, [])
  if (state === 'loading') return <div className="shop-gate-loader"><span /></div>
  if (state === 'missing') return <Navigate to="/shop-setup" replace />
  if (state === 'error') return <div className="shop-gate-error">Unable to load your shop. Please refresh and try again.</div>
  return <Outlet />
}
