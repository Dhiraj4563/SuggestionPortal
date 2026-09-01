import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import enTranslations from '../locales/en.json';
import neTranslations from '../locales/ne.json';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'janaseva_app_language_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved === 'ne' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en'; // English as default
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  }, [language, setLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ne') {
      document.body.classList.add('lang-ne');
    } else {
      document.body.classList.remove('lang-ne');
    }
  }, [language]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = language === 'ne' ? neTranslations : enTranslations;
      const fallbackDict = enTranslations;

      const keys = key.split('.');
      let result: any = dict;
      let fallbackResult: any = fallbackDict;

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          result = undefined;
          break;
        }
      }

      // If not found in selected language, check fallback
      if (result === undefined || typeof result !== 'string') {
        for (const k of keys) {
          if (fallbackResult && typeof fallbackResult === 'object' && k in fallbackResult) {
            fallbackResult = fallbackResult[k];
          } else {
            fallbackResult = undefined;
            break;
          }
        }
        result = fallbackResult;
      }

      if (typeof result !== 'string') {
        return key;
      }

      if (params) {
        let interpolated = result;
        Object.entries(params).forEach(([paramKey, val]) => {
          interpolated = interpolated.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(val));
        });
        return interpolated;
      }

      return result;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
