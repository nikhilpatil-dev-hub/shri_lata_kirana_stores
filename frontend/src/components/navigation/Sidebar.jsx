import { NavLink } from 'react-router-dom'
import { Store } from 'lucide-react'
import { navigationItems } from './navigation'
import { useLanguage } from '../../context/useLanguage'

export default function Sidebar() {
  const { t } = useLanguage()
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><Store size={21} /></span><span><strong>{t('app.name')}</strong><small>{t('app.subtitle')}</small></span></div><nav aria-label="Main navigation">{navigationItems.map(({ key, to, icon: Icon }) => <NavLink key={key} to={to} className="nav-link"><Icon size={20} /><span>{t(`nav.${key}`)}</span></NavLink>)}</nav></aside>
}
