import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSuggestions, AppView } from '../context/SuggestionContext';
import { Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { setCurrentView } = useSuggestions();

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-800">{t('app.name')}</span>
          <span>•</span>
          <span>{language === 'ne' ? 'नागरिक सेवा' : 'Civic Portal'}</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => handleNav('submit')}
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            {t('nav.submit')}
          </button>
          <button
            type="button"
            onClick={() => handleNav('track')}
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            {t('nav.track')}
          </button>
          <button
            type="button"
            onClick={() => handleNav('community')}
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            {t('nav.community')}
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            {t('nav.admin')}
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Janaseva Nepal
        </div>
      </div>
    </footer>
  );
};

