import { NavLink } from 'react-router-dom'
import { navigationItems } from './navigation'
import { useLanguage } from '../../context/useLanguage'

export default function BottomNavigation() { const { t } = useLanguage(); return <nav className="bottom-navigation" aria-label="Main navigation">{navigationItems.slice(0, 5).map(({ key, to, icon: Icon }) => <NavLink key={key} to={to} className="bottom-nav-link"><Icon size={21} /><span>{t(`nav.${key}`)}</span></NavLink>)}</nav> }
