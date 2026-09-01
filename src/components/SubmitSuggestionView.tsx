import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSuggestions } from '../context/SuggestionContext';
import { COUNTRIES, NEPAL_PROVINCES } from '../data/locations';
import { CATEGORIES, PRIORITIES } from '../data/categories';
import { CategoryId, PriorityLevel, AttachedFile, Suggestion } from '../types';
import { formatWhatsAppMessage, getWhatsAppShareUrl } from '../utils/whatsappFormatter';
import {
  Send,
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Share2,
  ArrowRight,
  Sparkles,
  MapPin,
  MessageSquare,
  User,
  Paperclip,
  Check,
  Printer,
  Search,
  Car,
  GraduationCap,
  HeartPulse,
  Droplets,
  Zap,
  Wheat,
  Briefcase,
  Building2,
  Trees,
  Hammer,
  Users,
  HelpCircle,
} from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Car: <Car className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Wheat: <Wheat className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Trees: <Trees className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
};

export const SubmitSuggestionView: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    formState,
    updateFormField,
    resetForm,
    addSuggestion,
    setCurrentView,
    setActiveTrackId,
    adminWhatsAppNumber,
  } = useSuggestions();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuggestion, setCreatedSuggestion] = useState<Suggestion | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchTrackInput, setSearchTrackInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackInput.trim()) return;
    const query = searchTrackInput.trim();
    setActiveTrackId(query);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selected Province data for dynamic district list
  const selectedProvinceData = NEPAL_PROVINCES.find(
    (p) => p.displayLabel === formState.province || p.nameEn === formState.province
  ) || NEPAL_PROVINCES[2]; // Bagmati default

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.country) newErrors.country = t('validation.country_required');
    if (!formState.province) newErrors.province = t('validation.province_required');
    if (!formState.district) newErrors.district = t('validation.district_required');
    if (!formState.village.trim()) newErrors.village = t('validation.village_required');
    if (!formState.fullAddress.trim()) newErrors.fullAddress = t('validation.address_required');
    if (!formState.category) newErrors.category = t('validation.category_required');
    if (!formState.title.trim()) newErrors.title = t('validation.title_required');
    if (!formState.description.trim() || formState.description.trim().length < 15) {
      newErrors.description = t('validation.description_required');
    }
    if (!formState.fullName.trim()) newErrors.fullName = t('validation.name_required');
    if (!formState.mobileNumber.trim() || formState.mobileNumber.trim().length < 7) {
      newErrors.mobileNumber = t('validation.mobile_required');
    }
    if (!formState.agreedToTerms) newErrors.agreedToTerms = t('validation.consent_required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newSub = addSuggestion(language);
      setCreatedSuggestion(newSub);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newAttachments: AttachedFile[] = [];
    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const item: AttachedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      };
      newAttachments.push(item);
    });

    updateFormField('attachments', [...formState.attachments, ...newAttachments]);
  };

  const handleRemoveFile = (id: string) => {
    updateFormField(
      'attachments',
      formState.attachments.filter((f) => f.id !== id)
    );
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleCopyWhatsAppText = (msg: string) => {
    navigator.clipboard.writeText(msg);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  /* SUCCESS CONFIRMATION SCREEN */
  if (createdSuggestion) {
    const waBilingualMessage = formatWhatsAppMessage(createdSuggestion, 'bilingual');
    const waCitizenMessage = formatWhatsAppMessage(createdSuggestion, 'citizen');
    
    // Dispatch links: direct to admin WhatsApp number if configured or general share
    const adminTargetPhone = adminWhatsAppNumber.trim() || undefined;
    const waAdminDirectUrl = getWhatsAppShareUrl(waBilingualMessage, adminTargetPhone);
    const waCitizenDirectUrl = getWhatsAppShareUrl(waCitizenMessage, createdSuggestion.mobileNumber);
    const waShareUrl = getWhatsAppShareUrl(waBilingualMessage);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          id="submission-success-card"
          className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        >
          {/* Success Banner */}
          <div className="bg-linear-to-br from-blue-700 to-blue-900 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('success.title')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
              {t('success.recorded_message')}
            </p>

            {/* Prominent Suggestion ID Pill */}
            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-slate-950/40 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20">
              <div className="text-xs sm:text-sm text-slate-200 font-medium">
                {t('success.id_label')}:
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-blue-300 tracking-wider">
                {createdSuggestion.id}
              </div>
              <button
                type="button"
                onClick={() => handleCopyId(createdSuggestion.id)}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-blue-300" />
                    <span>{language === 'ne' ? 'कपी भयो!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('success.btn_copy_id')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Body Summary & WhatsApp Share */}
          <div className="p-6 sm:p-8 space-y-8">
            <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 text-slate-800 text-sm leading-relaxed">
              <p className="font-semibold text-blue-950 mb-1">
                {t('success.appreciation')}
              </p>
              <p className="text-slate-600">{t('success.instruction')}</p>
            </div>

            {/* Direct Admin WhatsApp Dispatch Highlight */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {language === 'ne'
                      ? 'ह्वाट्सएपमा सिधै सुझाव पठाउनुहोस्'
                      : 'Send Full Suggestion Directly to Admin WhatsApp'}
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    {language === 'ne'
                      ? `दर्ता नं. ${createdSuggestion.id} सहितको सम्पूर्ण विवरण ${adminWhatsAppNumber || '+9779714136549'} मा पठाउनुहोस्`
                      : `Dispatches tracking ID & all details directly to ${adminWhatsAppNumber || '+9779714136549'}`}
                  </p>
                </div>
              </div>

              <a
                href={waAdminDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>
                  {language === 'ne' ? 'ह्वाट्सएप खोल्नुहोस्' : 'Open WhatsApp Message'}
                </span>
              </a>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-medium block">
                  {t('form.category')}
                </span>
                <span className="text-slate-900 font-bold text-sm mt-0.5 block">
                  {t(`categories.${createdSuggestion.category}`)}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-medium block">
                  {t('form.priority')}
                </span>
                <span className="text-slate-900 font-bold text-sm mt-0.5 block">
                  {t(`priorities.${createdSuggestion.priority}`)}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-medium block">
                  {t('form.district')}
                </span>
                <span className="text-slate-900 font-bold text-sm mt-0.5 block">
                  {createdSuggestion.district}
                </span>
              </div>
            </div>

            {/* Official WhatsApp Notification & Direct Dispatch Box */}
            <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>
                        {language === 'ne'
                          ? 'ह्वाट्सएप (WhatsApp) तत्काल सूचना प्रेषण'
                          : 'Instant WhatsApp Dispatch & Notification'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      {adminWhatsAppNumber
                        ? language === 'ne'
                          ? `प्रशासक/वडा प्रतिनिधि नम्बर: ${adminWhatsAppNumber} मा सिधै पठाउन सकिन्छ`
                          : `Direct 1-click dispatch to designated Admin WhatsApp: ${adminWhatsAppNumber}`
                        : language === 'ne'
                        ? 'सुझाव दर्ता भएको विवरण सिधै ह्वाट्सएपमा पठाउनुहोस्'
                        : 'Send complete submission report directly to WhatsApp'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyWhatsAppText(waBilingualMessage)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedWhatsApp ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {copiedWhatsApp
                        ? language === 'ne'
                          ? 'कपी भयो'
                          : 'Copied'
                        : language === 'ne'
                        ? 'सन्देश कपी'
                        : 'Copy Text'}
                    </span>
                  </button>

                  {/* Direct Admin WhatsApp Dispatch Button */}
                  <a
                    href={waAdminDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {adminWhatsAppNumber
                        ? language === 'ne'
                          ? 'प्रशासकलाई पठाउनुहोस् (Send to Admin)'
                          : 'Send to Admin WhatsApp'
                        : language === 'ne'
                        ? 'ह्वाट्सएपमा पठाउनुहोस्'
                        : 'Open WhatsApp'}
                    </span>
                  </a>
                </div>
              </div>

              {/* Pre-formatted Message Viewer */}
              <pre className="font-mono text-xs text-emerald-300 bg-slate-950 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap border border-slate-800/80 max-h-56 leading-relaxed">
                {waBilingualMessage}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setCreatedSuggestion(null);
                  resetForm();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
              >
                {t('success.btn_submit_another')}
              </button>

              <div className="w-full sm:w-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('success.btn_print')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTrackId(createdSuggestion.id);
                    setCurrentView('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('success.btn_track')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Track & Search Suggestion Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-8">
        <form onSubmit={handleSearchTrack} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTrackInput}
              onChange={(e) => setSearchTrackInput(e.target.value)}
              placeholder={
                language === 'ne'
                  ? 'सुझाव दर्ता नं वा खोज्नुहोस् (जस्तै: JS-2026-000001)...'
                  : 'Track & search suggestion ID or keyword (e.g. JS-2026-000001)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'ne' ? 'खोज / ट्र्याक' : 'Track & Search'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Location Selection */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('form.section_location')}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ne'
                  ? 'सही स्थान चयनले सुझाव सम्बन्धित वडा कार्यालयमा पुग्छ'
                  : 'Accurate location ensures routing to the right local ward office'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Country */}
            <div>
              <label
                htmlFor="country-select"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.country')} <span className="text-rose-500">*</span>
              </label>
              <select
                id="country-select"
                value={formState.country}
                onChange={(e) => updateFormField('country', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.displayLabel}>
                    {c.displayLabel}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.country}</p>
              )}
            </div>

            {/* Province */}
            <div>
              <label
                htmlFor="province-select"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.province')} <span className="text-rose-500">*</span>
              </label>
              <select
                id="province-select"
                value={formState.province}
                onChange={(e) => {
                  const newProv = e.target.value;
                  updateFormField('province', newProv);
                  const foundProv = NEPAL_PROVINCES.find(
                    (p) => p.displayLabel === newProv || p.nameEn === newProv
                  );
                  if (foundProv && foundProv.districts.length > 0) {
                    updateFormField('district', foundProv.districts[0].displayLabel);
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
              >
                {NEPAL_PROVINCES.map((p) => (
                  <option key={p.id} value={p.displayLabel}>
                    {p.displayLabel}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.province}</p>
              )}
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="district-select"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.district')} <span className="text-rose-500">*</span>
              </label>
              <select
                id="district-select"
                value={formState.district}
                onChange={(e) => updateFormField('district', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
              >
                {selectedProvinceData.districts.map((d) => (
                  <option key={d.id} value={d.displayLabel}>
                    {d.displayLabel}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.district}</p>
              )}
            </div>

            {/* Village / Town / Locality */}
            <div>
              <label
                htmlFor="village-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.village')} <span className="text-rose-500">*</span>
              </label>
              <input
                id="village-input"
                type="text"
                value={formState.village}
                onChange={(e) => updateFormField('village', e.target.value)}
                placeholder={
                  language === 'ne'
                    ? 'गाउँ, टोल वा नगर (जस्तै: बालुवाटार, बिरौटा)'
                    : 'Village, Locality, or Town (e.g., Baluwatar, Birauta)'
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
              />
              {errors.village && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.village}</p>
              )}
            </div>

            {/* Municipality & Ward (Optional/Recommended) */}
            <div>
              <label
                htmlFor="municipality-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.municipality')} ({t('form.optional_field')})
              </label>
              <input
                id="municipality-input"
                type="text"
                value={formState.municipality}
                onChange={(e) => updateFormField('municipality', e.target.value)}
                placeholder={
                  language === 'ne'
                    ? 'पालिकाको नाम (जस्तै: काठमाडौं महानगरपालिका)'
                    : 'Municipality name (e.g. Kathmandu Metropolitan City)'
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="ward-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.ward')} ({t('form.optional_field')})
              </label>
              <input
                id="ward-input"
                type="text"
                value={formState.wardNumber}
                onChange={(e) => updateFormField('wardNumber', e.target.value)}
                placeholder={language === 'ne' ? 'वडा नं (जस्तै: ४)' : 'Ward No (e.g. 4)'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
              />
            </div>

            {/* Full Street Address */}
            <div className="md:col-span-2">
              <label
                htmlFor="address-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.address')} <span className="text-rose-500">*</span>
              </label>
              <input
                id="address-input"
                type="text"
                value={formState.fullAddress}
                onChange={(e) => updateFormField('fullAddress', e.target.value)}
                placeholder={
                  language === 'ne'
                    ? 'घर नम्बर, मार्ग वा चोक सहितको पूरा ठेगाना'
                    : 'Street name, landmark, or complete address'
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
              />
              {errors.fullAddress && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">
                  {errors.fullAddress}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Category, Priority, and Suggestion Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('form.section_suggestion')}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ne'
                  ? 'विषय र प्राथमिकता छानी समस्या वा सुझाव स्पष्ट खुलाउनुहोस्'
                  : 'Select category, priority, and describe the proposal in detail'}
              </p>
            </div>
          </div>

          {/* Category Visual Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              {t('form.category')} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = formState.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateFormField('category', cat.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 border'
                      }`}
                    >
                      {CATEGORY_ICON_MAP[cat.iconName] || <HelpCircle className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-xs font-bold leading-tight block ${
                        isSelected ? 'text-blue-950' : 'text-slate-800'
                      }`}
                    >
                      {language === 'ne' ? cat.nameNe : cat.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                      {language === 'ne' ? cat.nameEn : cat.nameNe}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-rose-600 text-xs mt-2 font-medium">{errors.category}</p>
            )}
          </div>

          {/* Priority Options */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              {t('form.priority')} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRIORITIES.map((pri) => {
                const isSelected = formState.priority === pri.id;
                return (
                  <button
                    key={pri.id}
                    type="button"
                    onClick={() => updateFormField('priority', pri.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? `${pri.badgeClass} ring-2 ring-blue-600/30 font-bold shadow-xs`
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold block">
                      {language === 'ne' ? pri.nameNe : pri.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                      {language === 'ne' ? pri.nameEn : pri.nameNe}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Title */}
          <div>
            <label
              htmlFor="title-input"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              {t('form.title_label')} <span className="text-rose-500">*</span>
            </label>
            <input
              id="title-input"
              type="text"
              value={formState.title}
              onChange={(e) => updateFormField('title', e.target.value)}
              placeholder={t('form.title_placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all font-medium"
            />
            {errors.title && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Detailed Suggestion / Report */}
          <div>
            <label
              htmlFor="description-textarea"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              {t('form.description')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description-textarea"
              rows={4}
              value={formState.description}
              onChange={(e) => updateFormField('description', e.target.value)}
              placeholder={t('form.description_placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all leading-relaxed"
            />
            {errors.description && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.description}</p>
            )}
          </div>
        </div>

        {/* SECTION 3: Citizen Contact Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('form.section_citizen')}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ne'
                  ? 'अधिकारीद्वारा प्रमाणीकरण र प्रगति सन्देश पठाउनका लागि'
                  : 'Used by administrative officers for official progress notifications'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.full_name')} <span className="text-rose-500">*</span>
              </label>
              <input
                id="name-input"
                type="text"
                value={formState.fullName}
                onChange={(e) => updateFormField('fullName', e.target.value)}
                placeholder={t('form.full_name_placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
              />
              {errors.fullName && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobile-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.mobile')} <span className="text-rose-500">*</span>
              </label>
              <input
                id="mobile-input"
                type="tel"
                value={formState.mobileNumber}
                onChange={(e) => updateFormField('mobileNumber', e.target.value)}
                placeholder={t('form.mobile_placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all font-mono"
              />
              {errors.mobileNumber && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.mobileNumber}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                {t('form.email')}
              </label>
              <input
                id="email-input"
                type="email"
                value={formState.email}
                onChange={(e) => updateFormField('email', e.target.value)}
                placeholder={t('form.email_placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Upload Photo / Document */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <Paperclip className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('form.section_attachment')}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ne'
                  ? 'फोटो वा प्रमाण कागजातले समस्या छिटो पहिचान गर्न मद्दत गर्दछ'
                  : 'Photo or document evidence accelerates verification by engineers'}
              </p>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFileChange(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                : 'border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-600">
              <UploadCloud className="w-6 h-6 text-blue-700" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {t('form.upload_label')}
            </p>
            <p className="text-xs text-slate-500 mt-1">{t('form.upload_hint')}</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
            >
              {t('form.upload_btn')}
            </button>
          </div>

          {/* Attachment Preview Cards */}
          {formState.attachments.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('form.uploaded_files')} ({formState.attachments.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formState.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {file.previewUrl ? (
                        <img
                          src={file.previewUrl}
                          alt="preview"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                        <p className="text-slate-400 text-[10px]">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t('form.remove_file')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Declaration & Consent Box */}
        <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-200/80">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={formState.agreedToTerms}
              onChange={(e) => updateFormField('agreedToTerms', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-600 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {t('form.consent_title')}
              </span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {t('form.consent_text')}
              </p>
            </div>
          </label>
          {errors.agreedToTerms && (
            <p className="text-rose-600 text-xs mt-2 font-medium ml-7">
              {errors.agreedToTerms}
            </p>
          )}
        </div>

        {/* Form Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm transition-colors cursor-pointer"
          >
            {t('form.clear_btn')}
          </button>

          <button
            id="form-submit-button"
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold text-sm shadow-md shadow-blue-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? t('form.submitting_btn') : t('form.submit_btn')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
