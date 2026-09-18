import { Bell, ChevronDown, LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useTheme } from '../../context/useTheme'
import { useLanguage } from '../../context/useLanguage'

export default function Header() {
  const { user, logout } = useAuth(); const { theme, toggleTheme } = useTheme(); const { language, setLanguage, t } = useLanguage(); const navigate = useNavigate()
  const signOut = async () => { await logout(); navigate('/login', { replace: true }) }
  return <header className="app-header"><div><p className="header-kicker">{t('dashboard.welcome')}</p><h1>{user?.firstName || t('dashboard.shopFallback')}</h1></div><div className="header-actions"><button className="icon-button" onClick={toggleTheme} aria-label={t('actions.theme')}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button><label className="language-picker"><span className="sr-only">{t('actions.language')}</span><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('actions.language')}><option value="en">EN</option><option value="hi">हिं</option></select><ChevronDown size={15} /></label><button className="icon-button notification-button" aria-label={t('nav.notifications')}><Bell size={20} /><i /></button><button className="profile-button" onClick={signOut} title={t('actions.logout')}><span>{user?.firstName?.[0] || 'S'}</span><LogOut size={17} /></button></div></header>
}
