import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguageState] = useState(
    () => localStorage.getItem('healora_language') || i18n.language || 'en'
  );

  useEffect(() => {
    const stored = localStorage.getItem('healora_language');
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored);
      setCurrentLanguageState(stored);
    }
  }, [i18n]);

  const setLanguage = useCallback(async (lang) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem('healora_language', lang);
    setCurrentLanguageState(lang);

    const token = localStorage.getItem('healora_token');
    if (token) {
      try {
        await api.put('/api/users/language', { language: lang });
      } catch {
        // Language preference update to server failed silently;
        // local preference is still saved.
      }
    }
  }, [i18n]);

  const value = {
    currentLanguage,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
