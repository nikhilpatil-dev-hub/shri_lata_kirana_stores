import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './languageStore'
import en from '../locales/en/common'
import hi from '../locales/hi/common'

const translations = { en, hi }
const STORAGE_KEY = 'slks-language'
const lookup = (dictionary, key) => key.split('.').reduce((value, segment) => value?.[segment], dictionary) || key

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en')
  useEffect(() => { localStorage.setItem(STORAGE_KEY, language); document.documentElement.lang = language }, [language])
  const value = useMemo(() => ({ language, setLanguage, t: (key) => lookup(translations[language], key) }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
