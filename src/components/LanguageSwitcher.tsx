import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  variant?: 'header' | 'compact' | 'admin';
  customLanguage?: Language;
  onCustomChange?: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  customLanguage,
  onCustomChange,
}) => {
  const { language: globalLang, setLanguage: setGlobalLang } = useLanguage();

  const currentLang = customLanguage !== undefined ? customLanguage : globalLang;
  const handleChange = (lang: Language) => {
    if (onCustomChange) {
      onCustomChange(lang);
    } else {
      setGlobalLang(lang);
    }
  };

  if (variant === 'admin') {
    return (
      <div className="inline-flex items-center bg-slate-800/90 p-1 rounded-full border border-slate-700 text-xs">
        <Globe className="w-3.5 h-3.5 text-blue-400 ml-2 mr-1" />
        <button
          type="button"
          onClick={() => handleChange('en')}
          className={`px-3 py-1 rounded-full font-bold transition-all ${
            currentLang === 'en'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => handleChange('ne')}
          className={`px-3 py-1 rounded-full font-bold transition-all ${
            currentLang === 'ne'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          नेपाली
        </button>
      </div>
    );
  }

  return (
    <div
      id="main-language-switcher"
      className="inline-flex items-center bg-slate-100 rounded-full p-1 border border-slate-200 shadow-2xs transition-all hover:border-blue-400"
      aria-label="Language selection / भाषा चयन"
    >
      <div className="flex items-center pl-2 pr-1 text-slate-400">
        <Globe className="w-3.5 h-3.5 text-blue-700" />
      </div>

      <button
        id="btn-lang-en"
        type="button"
        onClick={() => handleChange('en')}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
          currentLang === 'en'
            ? 'bg-white text-blue-700 shadow-xs'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        English
      </button>

      <button
        id="btn-lang-ne"
        type="button"
        onClick={() => handleChange('ne')}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
          currentLang === 'ne'
            ? 'bg-white text-blue-700 shadow-xs'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        नेपाली
      </button>
    </div>
  );
};
