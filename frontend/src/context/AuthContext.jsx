import { useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'
import { AuthContext } from './contextStore'
export function AuthProvider({ children }) { const [user,setUser]=useState(null); const [isLoading,setIsLoading]=useState(true); useEffect(()=>{ authService.restoreSession().then(setUser).catch(()=>authService.clearSession()).finally(()=>setIsLoading(false)) },[]); const value=useMemo(()=>({ user,isLoading,login:async(c)=>{const data=await authService.login(c);setUser(data.user);return data},logout:async()=>{await authService.logout();setUser(null)} }),[user,isLoading]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider> }
