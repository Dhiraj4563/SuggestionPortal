import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSuggestions } from '../context/SuggestionContext';
import { STATUSES, PRIORITIES, CATEGORIES } from '../data/categories';
import { SuggestionStatus } from '../types';
import { formatWhatsAppMessage, getWhatsAppShareUrl } from '../utils/whatsappFormatter';
import {
  Search,
  CheckCircle2,
  Clock,
  Activity,
  XCircle,
  Inbox,
  Share2,
  ThumbsUp,
  MapPin,
  Calendar,
  Building,
  User,
  Paperclip,
  Check,
  Copy,
  Send,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const TrackStatusView: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    suggestions,
    activeTrackId,
    setActiveTrackId,
    getSuggestionById,
    upvoteSuggestion,
    setCurrentView,
  } = useSuggestions();

  const [searchInput, setSearchInput] = useState<string>(activeTrackId || 'JS-2026-000001');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const currentSuggestion = getSuggestionById(searchInput) || getSuggestionById(activeTrackId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTrackId(searchInput.trim());
    }
  };

  const handleSelectSample = (id: string) => {
    setSearchInput(id);
    setActiveTrackId(id);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyWhatsApp = (msg: string) => {
    navigator.clipboard.writeText(msg);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  // Status index mapping for stepper
  const statusSteps: SuggestionStatus[] = ['received', 'under_review', 'in_progress', 'resolved'];

  const getStepState = (
    step: SuggestionStatus,
    currentStatus: SuggestionStatus
  ): 'completed' | 'current' | 'upcoming' | 'rejected' => {
    if (currentStatus === 'rejected') {
      if (step === 'received') return 'completed';
      return 'rejected';
    }
    const stepIdx = statusSteps.indexOf(step);
    const currIdx = statusSteps.indexOf(currentStatus);

    if (currIdx > stepIdx) return 'completed';
    if (currIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Search Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
            {language === 'ne' ? 'स्थिति ट्र्याकिङ' : 'Status Tracking'}
          </div>
          <h1
            id="track-page-title"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            {t('tracking.title')}
          </h1>
          <p className="mt-2 text-sm text-slate-600 font-normal">
            {t('tracking.subtitle')}
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                id="tracking-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('tracking.input_placeholder')}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium transition-all"
              />
            </div>
            <button
              id="tracking-search-btn"
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
            >
              {t('tracking.search_btn')}
            </button>
          </div>

          {/* Quick Clickable Sample IDs */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">{t('tracking.quick_samples')}</span>
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSample(s.id)}
                className={`px-2.5 py-1 rounded-xl border font-mono font-medium transition-colors cursor-pointer ${
                  searchInput.toUpperCase() === s.id
                    ? 'bg-blue-50 text-blue-900 border-blue-300 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Suggestion Result Content */}
      {currentSuggestion ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Status Banner Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-lg sm:text-xl font-extrabold text-slate-900">
                    {currentSuggestion.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(currentSuggestion.id)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title={t('success.btn_copy_id')}
                  >
                    {copiedId ? (
                      <Check className="w-4 h-4 text-blue-700" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {currentSuggestion.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(currentSuggestion.submittedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    {currentSuggestion.district}, {currentSuggestion.province}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                <span
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border inline-flex items-center gap-2 ${
                    currentSuggestion.status === 'resolved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : currentSuggestion.status === 'in_progress'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : currentSuggestion.status === 'under_review'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : currentSuggestion.status === 'rejected'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {currentSuggestion.status === 'resolved' && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {currentSuggestion.status === 'in_progress' && (
                    <Activity className="w-4 h-4 animate-spin" />
                  )}
                  {currentSuggestion.status === 'under_review' && <Clock className="w-4 h-4" />}
                  {currentSuggestion.status === 'received' && <Inbox className="w-4 h-4" />}
                  {currentSuggestion.status === 'rejected' && <XCircle className="w-4 h-4" />}
                  <span>{t(`statuses.${currentSuggestion.status}`)}</span>
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statusSteps.map((stepKey, idx) => {
                  const state = getStepState(stepKey, currentSuggestion.status);
                  const isCompleted = state === 'completed';
                  const isCurrent = state === 'current';

                  return (
                    <div
                      key={stepKey}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : isCompleted
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        {isCompleted ? (
                          <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 border-2 border-blue-700 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 border flex items-center justify-center text-xs font-semibold">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-xs font-bold block ${
                          isCurrent
                            ? 'text-blue-950'
                            : isCompleted
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {t(`statuses.${stepKey}`)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggestion Description & Location Summary */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('tracking.details_heading')}
              </div>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                {currentSuggestion.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-500 block">{t('form.category')}</span>
                  <span className="font-bold text-slate-800">
                    {t(`categories.${currentSuggestion.category}`)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('form.priority')}</span>
                  <span className="font-bold text-slate-800">
                    {t(`priorities.${currentSuggestion.priority}`)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('form.address')}</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {currentSuggestion.fullAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Attached Photos / Evidence */}
            {currentSuggestion.attachments && currentSuggestion.attachments.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {t('tracking.attachments_heading')} ({currentSuggestion.attachments.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentSuggestion.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3"
                    >
                      {att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt="evidence"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <FileText className="w-8 h-8" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">{att.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {(att.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Administrative Timeline Log */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  {t('tracking.timeline_heading')}
                </h3>
                <span className="text-xs text-slate-500">
                  {currentSuggestion.timeline.length}{' '}
                  {language === 'ne' ? 'अपडेट रेकर्ड' : 'Updates Logged'}
                </span>
              </div>

              <div className="space-y-4">
                {currentSuggestion.timeline.map((event, idx) => (
                  <div
                    key={idx}
                    className="relative pl-6 pb-2 border-l-2 border-blue-500/40 last:border-l-transparent last:pb-0"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow-2xs" />
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-slate-900">
                          {t(`statuses.${event.status}`)}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {language === 'ne'
                          ? event.remarksNe || event.remarksEn
                          : event.remarksEn || event.remarksNe}
                      </p>
                      <div className="pt-1 text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>{event.actor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Alert & Community Endorsement Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Community Upvote Button */}
              <button
                type="button"
                onClick={() => upvoteSuggestion(currentSuggestion.id)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  currentSuggestion.hasUpvoted
                    ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp
                  className={`w-4 h-4 ${
                    currentSuggestion.hasUpvoted ? 'text-blue-700 fill-blue-700' : ''
                  }`}
                />
                <span>
                  {t('tracking.upvote_btn')} ({currentSuggestion.upvotes})
                </span>
              </button>

              {/* WhatsApp Notification Share */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyWhatsApp(formatWhatsAppMessage(currentSuggestion, 'bilingual'))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedWhatsApp ? (
                    <Check className="w-3.5 h-3.5 text-blue-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {copiedWhatsApp
                      ? language === 'ne'
                        ? 'कपी भयो'
                        : 'Copied'
                      : language === 'ne'
                      ? 'ह्वाट्सएप कपी'
                      : 'Copy WhatsApp'}
                  </span>
                </button>

                <a
                  href={getWhatsAppShareUrl(formatWhatsAppMessage(currentSuggestion, 'bilingual'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Not Found Empty State */
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{t('tracking.not_found_title')}</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{t('tracking.not_found_desc')}</p>
          <button
            type="button"
            onClick={() => handleSelectSample('JS-2026-000001')}
            className="mt-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            {language === 'ne' ? 'नमुना हेर्नुहोस् (JS-2026-000001)' : 'Load Sample JS-2026-000001'}
          </button>
        </div>
      )}
    </div>
  );
};
