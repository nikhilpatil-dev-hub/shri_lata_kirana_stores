import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './themeStore'
const STORAGE_KEY = 'slks-theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])
  const value = useMemo(() => ({ theme, setTheme, toggleTheme: () => setTheme((value) => value === 'light' ? 'dark' : 'light') }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
