import { CreditCard, LayoutDashboard, UsersRound, WalletCards } from 'lucide-react'

export const navigationItems = [
  { key: 'dashboard', to: '/dashboard', icon: LayoutDashboard },
  { key: 'customers', to: '/customers', icon: UsersRound },
  { key: 'transactions', to: '/transactions', icon: WalletCards },
  { key: 'payments', to: '/payments', icon: CreditCard },
]
