import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSuggestions } from '../context/SuggestionContext';
import {
  HelpCircle,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  Send,
  CheckCircle,
  Building,
} from 'lucide-react';

export const HelpView: React.FC = () => {
  const { t, language } = useLanguage();
  const { setCurrentView } = useSuggestions();

  const faqs = [
    {
      q: t('help.q1'),
      a: t('help.a1'),
    },
    {
      q: t('help.q2'),
      a: t('help.a2'),
    },
    {
      q: t('help.q3'),
      a: t('help.a3'),
    },
    {
      q: t('help.q4'),
      a: t('help.a4'),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-3">
        <div className="w-12 h-12 bg-blue-50 text-blue-700 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div className="text-xs font-bold text-blue-700 uppercase tracking-widest">
          {language === 'ne' ? 'सहायता तथा बारम्बार सोधिने प्रश्नहरू' : 'Support & FAQs'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('help.title')}
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">{t('help.subtitle')}</p>
      </div>

      {/* FAQ Accordion/Cards */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2.5 hover:border-blue-300 transition-colors"
          >
            <h3 className="text-base font-bold text-slate-900 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-blue-200">
                ?
              </span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Citizen Rights & Privacy Declaration Box */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          <h2 className="text-base font-bold text-white">
            {language === 'ne'
              ? 'नागरिक गोपनीयता तथा तथ्याङ्क सुरक्षा प्रतिवद्धता'
              : 'Citizen Privacy & Data Protection Commitment'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {language === 'ne'
            ? 'जनसेवा पोर्टलमा प्रविष्ट गरिएका सम्पूर्ण विवरणहरू नेपालको वैयक्तिक गोपनीयता ऐन तथा सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन बमोजिम स्थानीय तह तथा सम्बन्धित निकायको आधिकारिक प्रयोजनका लागि मात्र प्रयोग गरिन्छ। नागरिकको व्यक्तिगत फोन नम्बर तथा निजी पहिचान सार्वजनिक मञ्चमा सुरक्षित राखिन्छ।'
            : 'All data submitted on the Janaseva Civic Portal is handled under standard privacy standards and local governance frameworks. Citizen contact details are strictly restricted to verified administrative officials handling issue resolution.'}
        </p>
      </div>

      {/* Direct Ward Assistance Card */}
      <div className="bg-blue-50/70 rounded-3xl p-6 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-blue-950">
            {language === 'ne'
              ? 'के तपाईंलाई नयाँ सुझाव दर्ता गर्न सहयोग आवश्यक छ?'
              : 'Need assistance submitting a community issue?'}
          </h4>
          <p className="text-xs text-slate-600">
            {language === 'ne'
              ? 'हाम्रो डिजिटल फारम भर्नुहोस् र आफ्नो वडाको समस्या तुरुन्त दर्ता गर्नुहोस्।'
              : 'Use our simple bilingual submission form to register your civic report today.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentView('submit');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <Send className="w-4 h-4" />
          <span>{t('form.submit_btn')}</span>
        </button>
      </div>
    </div>
  );
};
