import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSuggestions } from '../context/SuggestionContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { STATUSES, PRIORITIES, CATEGORIES } from '../data/categories';
import { Suggestion, SuggestionStatus, Language } from '../types';
import { formatWhatsAppMessage, getWhatsAppShareUrl } from '../utils/whatsappFormatter';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Activity,
  XCircle,
  Inbox,
  AlertTriangle,
  FileText,
  Share2,
  Copy,
  Check,
  Send,
  Eye,
  Edit,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import enTranslations from '../locales/en.json';
import neTranslations from '../locales/ne.json';

export const AdminPortalView: React.FC = () => {
  const {
    suggestions,
    adminAuthenticated,
    setAdminAuthenticated,
    adminLanguage,
    setAdminLanguage,
    updateSuggestionStatus,
    adminWhatsAppNumber,
    setAdminWhatsAppNumber,
  } = useSuggestions();

  const [authMethod, setAuthMethod] = useState<'credentials' | 'pin'>('credentials');
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState(adminWhatsAppNumber);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Search & Filters inside Admin
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Selected Suggestion for Inspection/Modal
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [newStatus, setNewStatus] = useState<SuggestionStatus>('under_review');
  const [adminNote, setAdminNote] = useState('');
  const [officerName, setOfficerName] = useState('Officer In-Charge');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Helper for admin-specific translation
  const adminT = (key: string, params?: Record<string, string | number>): string => {
    const dict: any = adminLanguage === 'ne' ? neTranslations : enTranslations;
    const keys = key.split('.');
    let res = dict;
    for (const k of keys) {
      if (res && typeof res === 'object' && k in res) {
        res = res[k];
      } else {
        res = undefined;
        break;
      }
    }
    if (typeof res !== 'string') return key;
    if (params) {
      Object.entries(params).forEach(([pk, pv]) => {
        res = res.replace(new RegExp(`{{${pk}}}`, 'g'), String(pv));
      });
    }
    return res;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authMethod === 'credentials') {
      const id = adminIdentifier.trim();
      const pwd = adminPassword.trim();
      if (!id) {
        setAuthError(adminLanguage === 'ne' ? 'कृपया इमेल वा फोन नम्बर राख्नुहोस्।' : 'Please enter your email, phone, or username.');
        return;
      }
      if (!pwd) {
        setAuthError(adminLanguage === 'ne' ? 'कृपया पासवर्ड राख्नुहोस्।' : 'Please enter your password.');
        return;
      }
      // Successfully authenticated
      if (id.includes('@')) {
        const namePart = id.split('@')[0].replace(/[._]/g, ' ');
        setOfficerName(`${namePart.charAt(0).toUpperCase() + namePart.slice(1)} (Admin)`);
      } else {
        setOfficerName(`${id} (Admin)`);
      }
      setAdminAuthenticated(true);
    } else {
      // PIN method
      if (pinInput.trim().length >= 4) {
        setAdminAuthenticated(true);
      } else {
        setAuthError(adminLanguage === 'ne' ? 'कृपया मान्य ४-अंकको सुरक्षा पिन राख्नुहोस्।' : 'Please enter a valid 4-digit security PIN.');
      }
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAdminIdentifier('');
    setAdminPassword('');
    setPinInput('');
    setAuthError(null);
  };

  const openDetailModal = (s: Suggestion) => {
    setSelectedSuggestion(s);
    setNewStatus(s.status);
    setAdminNote('');
  };

  const handleSaveStatusUpdate = () => {
    if (!selectedSuggestion) return;
    const success = updateSuggestionStatus(
      selectedSuggestion.id,
      newStatus,
      adminNote,
      officerName
    );
    if (success) {
      setToastMessage(adminT('admin.update_success'));
      // Update local modal state
      const updated = suggestions.find((s) => s.id === selectedSuggestion.id);
      if (updated) {
        setSelectedSuggestion({
          ...updated,
          status: newStatus,
          adminNotes: adminNote || updated.adminNotes,
        });
      }
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Suggestion ID',
      'Full Name',
      'Mobile',
      'Country',
      'Province',
      'District',
      'Village/Locality',
      'Address',
      'Category',
      'Priority',
      'Title',
      'Description',
      'Status',
      'Submitted Date',
      'Admin Notes',
    ];

    const rows = suggestions.map((s) => [
      `"${s.id}"`,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.mobileNumber}"`,
      `"${s.country}"`,
      `"${s.province}"`,
      `"${s.district}"`,
      `"${s.village.replace(/"/g, '""')}"`,
      `"${s.fullAddress.replace(/"/g, '""')}"`,
      `"${s.category}"`,
      `"${s.priority}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.description.replace(/"/g, '""')}"`,
      `"${s.status}"`,
      `"${s.submittedAt}"`,
      `"${(s.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Janaseva_Suggestions_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(adminT('admin.export_success'));
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredList = useMemo(() => {
    return suggestions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.id.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.fullName.toLowerCase().includes(q) ||
          s.mobileNumber.includes(q) ||
          s.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [suggestions, statusFilter, categoryFilter, searchQuery]);

  // Metrics
  const totalCount = suggestions.length;
  const pendingCount = suggestions.filter((s) => s.status === 'received').length;
  const inProgressCount = suggestions.filter(
    (s) => s.status === 'under_review' || s.status === 'in_progress'
  ).length;
  const resolvedCount = suggestions.filter((s) => s.status === 'resolved').length;
  const urgentCount = suggestions.filter((s) => s.priority === 'urgent').length;

  /* 1. LOGIN SCREEN IF NOT AUTHENTICATED */
  if (!adminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-slate-900 text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-slate-800">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {adminT('admin.login_title')}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {adminLanguage === 'ne'
                ? 'आफ्नो आधिकारिक इमेल, फोन वा पिन प्रयोग गरी प्रवेश गर्नुहोस्'
                : 'Sign in using your administrator email, phone, or access PIN'}
            </p>
          </div>

          {/* Admin Independent Language Switcher */}
          <div className="flex items-center justify-center gap-2 pt-1 pb-1">
            <LanguageSwitcher
              variant="admin"
              customLanguage={adminLanguage}
              onCustomChange={setAdminLanguage}
            />
          </div>

          {/* Authentication Mode Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('credentials');
                setAuthError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMethod === 'credentials'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {adminLanguage === 'ne' ? 'इमेल / परिचयपत्र' : 'Email / Mobile'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('pin');
                setAuthError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMethod === 'pin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {adminLanguage === 'ne' ? 'द्रुत पिन (PIN)' : 'Quick Access PIN'}
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authMethod === 'credentials' ? (
              <>
                <div>
                  <label
                    htmlFor="admin-email-input"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    {adminLanguage === 'ne' ? 'इमेल वा मोबाइल नम्बर' : 'Email or Mobile Number'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="admin-email-input"
                      type="text"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="e.g. dhirajbabu456@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-password-input"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    {adminLanguage === 'ne' ? 'पासवर्ड / टोकन' : 'Password / Security Key'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="admin-password-input"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder={adminLanguage === 'ne' ? 'आफ्नो पासवर्ड राख्नुहोस्' : 'Enter your password'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label
                  htmlFor="admin-pin-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  {adminLanguage === 'ne' ? 'प्रवेश पिन (PIN)' : 'Access PIN'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-pin-input"
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder={adminT('admin.pin_placeholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-center tracking-widest text-lg font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>
            )}

            {authError && (
              <p className="text-rose-600 text-xs mt-2 font-medium text-center bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {authError}
              </p>
            )}

            <button
              id="btn-admin-signin"
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-[0.98]"
            >
              {adminT('admin.login_btn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* 2. AUTHENTICATED DASHBOARD */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Dashboard Top Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {adminLanguage === 'ne'
                ? 'अधिकृत प्रशासकीय नियन्त्रण कक्ष'
                : 'Authorized Municipal Control Center'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {adminT('admin.title')}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs text-slate-400 font-medium">
              {adminLanguage === 'ne' ? 'प्रवेश प्राप्त अधिकारी:' : 'Logged in as:'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-800 text-blue-300 text-xs font-bold border border-slate-700">
              <User className="w-3 h-3 text-blue-400" />
              <span>{officerName}</span>
            </span>
            {adminWhatsAppNumber && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-950/60 text-emerald-300 text-xs font-bold border border-emerald-800">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{adminWhatsAppNumber}</span>
              </span>
            )}
          </div>
        </div>

        {/* Top Actions: Independent Language Switcher + Export + Logout */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Independent Language Switcher for Admin */}
          <LanguageSwitcher
            variant="admin"
            customLanguage={adminLanguage}
            onCustomChange={setAdminLanguage}
          />

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>{adminT('admin.action_export')}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{adminT('admin.logout_btn')}</span>
          </button>
        </div>
      </div>

      {/* Admin WhatsApp Direct Alert Configuration Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {adminLanguage === 'ne'
                  ? 'प्रशासक ह्वाट्सएप (WhatsApp) प्रत्यक्ष सूचना नम्बर'
                  : 'Official Admin WhatsApp Alert Number'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {adminWhatsAppNumber ? (adminLanguage === 'ne' ? 'सक्रिय' : 'Active') : (adminLanguage === 'ne' ? 'सेट गरिएको छैन' : 'Not Set')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {adminLanguage === 'ne'
                ? 'नयाँ नागरिक सुझावहरू सिधै यो ह्वाट्सएप नम्बरमा पठाउन सकिन्छ।'
                : 'New citizen submissions and status alerts can be dispatched directly to this WhatsApp number.'}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          {isEditingPhone ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 98XXXXXXXX"
                className="px-3.5 py-2 text-xs sm:text-sm font-mono font-bold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden w-full sm:w-48"
              />
              <button
                type="button"
                onClick={() => {
                  setAdminWhatsAppNumber(phoneInput.trim());
                  setIsEditingPhone(false);
                  setToastMessage(
                    adminLanguage === 'ne'
                      ? 'ह्वाट्सएप नम्बर सफलतापूर्वक अपडेट भयो!'
                      : 'Admin WhatsApp number saved successfully!'
                  );
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {adminLanguage === 'ne' ? 'सुरक्षित गर्नुहोस्' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoneInput(adminWhatsAppNumber);
                  setIsEditingPhone(false);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer shrink-0"
              >
                {adminLanguage === 'ne' ? 'रद्द' : 'Cancel'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
                {adminWhatsAppNumber || (adminLanguage === 'ne' ? 'कुनै नम्बर छैन' : 'No number set')}
              </div>
              <button
                type="button"
                onClick={() => {
                  setPhoneInput(adminWhatsAppNumber);
                  setIsEditingPhone(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{adminLanguage === 'ne' ? 'नम्बर परिवर्तन' : 'Configure'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>{adminT('admin.total_submissions')}</span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">
            {totalCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>{adminT('admin.pending_review')}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono mt-2">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>{adminT('admin.in_progress_count')}</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono mt-2">
            {inProgressCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>{adminT('admin.resolved_count')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono mt-2">
            {resolvedCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>{adminT('admin.urgent_count')}</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-2">
            {urgentCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Controller */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                adminLanguage === 'ne'
                  ? 'सुझाव नम्बर, नागरिकको नाम, फोन वा स्थान खोज्नुहोस्...'
                  : 'Search by ID, citizen name, phone, or location...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
          >
            <option value="all">{adminT('admin.filter_status_all')}</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {adminLanguage === 'ne' ? s.nameNe : s.nameEn}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
          >
            <option value="all">
              {adminLanguage === 'ne' ? 'सबै विषयहरू' : 'All Categories'}
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {adminLanguage === 'ne' ? c.nameNe : c.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-4">{adminT('admin.table_id')}</th>
                <th className="py-4 px-4">{adminT('admin.table_citizen')}</th>
                <th className="py-4 px-4">{adminT('admin.table_category')}</th>
                <th className="py-4 px-4">{adminT('admin.table_location')}</th>
                <th className="py-4 px-4">{adminT('admin.table_priority')}</th>
                <th className="py-4 px-4">{adminT('admin.table_status')}</th>
                <th className="py-4 px-4">{adminT('admin.table_date')}</th>
                <th className="py-4 px-4 text-right">{adminT('admin.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => openDetailModal(s)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {s.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 line-clamp-1">{s.fullName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{s.mobileNumber}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-700 line-clamp-1">
                      {adminT(`categories.${s.category}`)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <p className="line-clamp-1 font-medium">{s.district}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{s.village}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        s.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : s.priority === 'high'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {adminT(`priorities.${s.priority}`)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${
                        s.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : s.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : s.status === 'under_review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {adminT(`statuses.${s.status}`)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">
                    {new Date(s.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(s);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {adminLanguage === 'ne' ? 'व्यवस्थापन' : 'Manage'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & ACTION MODAL */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-slate-900">
                    {selectedSuggestion.id}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {adminT(`categories.${selectedSuggestion.category}`)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSuggestion.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSuggestion(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Citizen & Location Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-medium block">
                  {adminT('form.full_name')}:
                </span>
                <span className="font-bold text-slate-900 block text-sm">
                  {selectedSuggestion.fullName}
                </span>
                <span className="text-slate-600 block flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-blue-700" />
                  {selectedSuggestion.mobileNumber}
                </span>
                {selectedSuggestion.email && (
                  <span className="text-slate-600 block flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-700" />
                    {selectedSuggestion.email}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium block">
                  {adminT('form.section_location')}:
                </span>
                <span className="font-bold text-slate-900 block">
                  {selectedSuggestion.district}, {selectedSuggestion.province}
                </span>
                <span className="text-slate-600 block">{selectedSuggestion.village}</span>
                <span className="text-slate-600 block">{selectedSuggestion.fullAddress}</span>
              </div>
            </div>

            {/* Full Report Description */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {adminT('form.description')}
              </span>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedSuggestion.description}
              </div>
            </div>

            {/* Administrative Action Section */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 space-y-4">
              <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-700" />
                <span>{adminT('admin.action_update_status')}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {adminT('admin.select_status')}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as SuggestionStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    {STATUSES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {adminLanguage === 'ne' ? st.nameNe : st.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {adminLanguage === 'ne' ? 'जिम्मेवार अधिकारी / शाखा' : 'Acting Officer / Branch'}
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {adminT('admin.action_add_note')}
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={adminT('admin.note_placeholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Pre-filled Quick Remarks Suggestions */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-slate-500 font-medium self-center">
                  {adminLanguage === 'ne' ? 'द्रुत टिप्पणी:' : 'Quick template:'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setAdminNote(
                      adminLanguage === 'ne'
                        ? 'स्थलगत निरीक्षण सम्पन्न। आवश्यक बजेट तथा प्राविधिक टोली परिचालन गरिएको छ।'
                        : 'Field inspection completed. Budget allocated and maintenance team deployed.'
                    )
                  }
                  className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {adminLanguage === 'ne' ? 'निरीक्षण सम्पन्न' : 'Inspected'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAdminNote(
                      adminLanguage === 'ne'
                        ? 'सम्बन्धित निकायद्वारा समस्या समाधान भई काम सम्पन्न भएको प्रमाणित गरियो।'
                        : 'Issue successfully addressed and work verified on site.'
                    )
                  }
                  className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {adminLanguage === 'ne' ? 'समाधान प्रमाणित' : 'Resolved'}
                </button>
              </div>
            </div>

            {/* WhatsApp Notification Formatter preview */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  {adminT('admin.whatsapp_preview_title')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        formatWhatsAppMessage(selectedSuggestion, 'bilingual')
                      );
                      setCopiedWhatsApp(true);
                      setTimeout(() => setCopiedWhatsApp(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
                  >
                    {copiedWhatsApp ? (
                      <Check className="w-3 h-3 text-blue-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{adminT('admin.copy_whatsapp')}</span>
                  </button>

                  <a
                    href={getWhatsAppShareUrl(
                      formatWhatsAppMessage(selectedSuggestion, 'bilingual'),
                      selectedSuggestion.mobileNumber
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>{adminT('admin.open_whatsapp')}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSuggestion(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {adminT('admin.close_btn')}
              </button>
              <button
                type="button"
                onClick={handleSaveStatusUpdate}
                className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                <span>{adminT('admin.save_changes')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
