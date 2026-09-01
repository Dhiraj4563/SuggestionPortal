import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSuggestions } from '../context/SuggestionContext';
import { NEPAL_PROVINCES } from '../data/locations';
import { CATEGORIES, STATUSES } from '../data/categories';
import {
  Search,
  Filter,
  MapPin,
  ThumbsUp,
  ArrowRight,
  Send,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const PublicCommunityView: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    suggestions,
    setActiveTrackId,
    setCurrentView,
    upvoteSuggestion,
  } = useSuggestions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'upvotes'>('latest');

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((s) => {
      // Province filter
      if (selectedProvince !== 'all' && !s.province.includes(selectedProvince)) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && s.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && s.status !== selectedStatus) {
        return false;
      }
      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          s.id.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.village.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }, [suggestions, selectedProvince, selectedCategory, selectedStatus, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {language === 'ne'
                ? 'खुला नागरिक मञ्च'
                : 'Open Citizen Forum'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('community.title')}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{t('community.subtitle')}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentView('submit');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <Send className="w-4 h-4" />
          <span>{t('form.submit_btn')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-center">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('community.search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
            />
          </div>

          {/* Province Filter */}
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full lg:w-48 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
          >
            <option value="all">{t('community.filter_all')} {t('form.province')}</option>
            {NEPAL_PROVINCES.map((p) => (
              <option key={p.id} value={p.nameEn}>
                {language === 'ne' ? p.nameNe : p.nameEn}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full lg:w-48 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
          >
            <option value="all">{t('community.filter_all')} {t('form.category')}</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'ne' ? c.nameNe : c.nameEn}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full lg:w-40 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
          >
            <option value="all">{t('community.filter_all')} {t('admin.table_status')}</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {language === 'ne' ? s.nameNe : s.nameEn}
              </option>
            ))}
          </select>

          {/* Sort By Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs shrink-0 w-full lg:w-auto justify-center">
            <button
              type="button"
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                sortBy === 'latest' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('community.sort_latest')}
            </button>
            <button
              type="button"
              onClick={() => setSortBy('upvotes')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                sortBy === 'upvotes' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('community.sort_most_supported')}
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {t('community.showing_results', { count: filteredSuggestions.length })}
        </div>
      </div>

      {/* Grid of Suggestions */}
      {filteredSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSuggestions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Top ID & Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {s.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      s.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : s.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : s.status === 'under_review'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t(`statuses.${s.status}`)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {s.title}
                </h3>

                {/* Description Snippet */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {s.description}
                </p>

                {/* Location & Category Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-700" />
                    {s.district}
                  </span>
                  <span className="text-[11px] font-medium bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-lg border border-blue-100">
                    {t(`categories.${s.category}`)}
                  </span>
                </div>
              </div>

              {/* Card Footer: Upvote & Detail Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => upvoteSuggestion(s.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    s.hasUpvoted
                      ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold'
                      : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp
                    className={`w-3.5 h-3.5 ${
                      s.hasUpvoted ? 'text-blue-700 fill-blue-700' : ''
                    }`}
                  />
                  <span>{s.upvotes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTrackId(s.id);
                    setCurrentView('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-all cursor-pointer"
                >
                  <span>{t('community.view_details')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">{t('community.empty_title')}</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {t('community.empty_desc')}
          </p>
        </div>
      )}
    </div>
  );
};
