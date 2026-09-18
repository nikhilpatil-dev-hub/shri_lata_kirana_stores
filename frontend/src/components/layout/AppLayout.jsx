import { Outlet } from 'react-router-dom'
import Sidebar from '../navigation/Sidebar'
import Header from '../navigation/Header'
import BottomNavigation from '../navigation/BottomNavigation'

export default function AppLayout() {
  return <div className="app-shell"><Sidebar /><div className="app-frame"><Header /><main className="app-content"><Outlet /></main></div><BottomNavigation /></div>
}
