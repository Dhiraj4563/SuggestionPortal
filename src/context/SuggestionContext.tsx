import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Suggestion, CivicFormState, SuggestionStatus, Language } from '../types';
import { INITIAL_SUGGESTIONS } from '../data/seedSuggestions';

export type AppView = 'submit' | 'track' | 'community' | 'admin' | 'help';

interface SuggestionContextType {
  suggestions: Suggestion[];
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  formState: CivicFormState;
  setFormState: React.Dispatch<React.SetStateAction<CivicFormState>>;
  updateFormField: <K extends keyof CivicFormState>(field: K, value: CivicFormState[K]) => void;
  resetForm: () => void;
  addSuggestion: (submissionLanguage: Language) => Suggestion;
  getSuggestionById: (id: string) => Suggestion | undefined;
  findSuggestionsBySearch: (query: string) => Suggestion[];
  updateSuggestionStatus: (
    id: string,
    newStatus: SuggestionStatus,
    adminNote: string,
    actorName?: string
  ) => boolean;
  upvoteSuggestion: (id: string) => void;
  activeTrackId: string;
  setActiveTrackId: (id: string) => void;
  adminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;
  adminLanguage: Language;
  setAdminLanguage: (lang: Language) => void;
  adminWhatsAppNumber: string;
  setAdminWhatsAppNumber: (phone: string) => void;
}

const initialFormValues: CivicFormState = {
  fullName: '',
  mobileNumber: '',
  email: '',
  country: 'Nepal (नेपाल)',
  province: 'Bagmati Province (बागमती प्रदेश)',
  district: 'Kathmandu (काठमाडौं)',
  municipality: '',
  wardNumber: '',
  village: '',
  fullAddress: '',
  category: '',
  priority: 'medium',
  title: '',
  description: '',
  attachments: [],
  agreedToTerms: false,
};

const SUGGESTIONS_STORAGE_KEY = 'janaseva_suggestions_data_v1';
const FORM_STORAGE_KEY = 'janaseva_form_draft_v1';
const ADMIN_WHATSAPP_STORAGE_KEY = 'janaseva_admin_whatsapp_v1';

const DEFAULT_ADMIN_WHATSAPP = '+9779714136549';

const SuggestionContext = createContext<SuggestionContextType | undefined>(undefined);

export const SuggestionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('submit');
  const [activeTrackId, setActiveTrackId] = useState<string>('JS-2026-000001');
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(false);
  const [adminLanguage, setAdminLanguage] = useState<Language>('en');
  const [adminWhatsAppNumber, setAdminWhatsAppNumberState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_WHATSAPP_STORAGE_KEY);
      if (saved && saved.trim().length > 0) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_WHATSAPP;
  });

  const setAdminWhatsAppNumber = useCallback((num: string) => {
    setAdminWhatsAppNumberState(num);
    try {
      if (num) {
        localStorage.setItem(ADMIN_WHATSAPP_STORAGE_KEY, num);
      } else {
        localStorage.removeItem(ADMIN_WHATSAPP_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    try {
      const saved = localStorage.getItem(SUGGESTIONS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_SUGGESTIONS;
  });

  const [formState, setFormState] = useState<CivicFormState>(() => {
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        return { ...initialFormValues, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return initialFormValues;
  });

  // Persist suggestions
  useEffect(() => {
    try {
      localStorage.setItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify(suggestions));
    } catch {
      // ignore
    }
  }, [suggestions]);

  // Persist draft form state
  useEffect(() => {
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formState));
    } catch {
      // ignore
    }
  }, [formState]);

  const updateFormField = useCallback(<K extends keyof CivicFormState>(field: K, value: CivicFormState[K]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(initialFormValues);
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const generateNextId = useCallback((): string => {
    const year = new Date().getFullYear();
    const count = suggestions.length + 1;
    const padded = String(count).padStart(6, '0');
    return `JS-${year}-${padded}`;
  }, [suggestions.length]);

  const addSuggestion = useCallback(
    (submissionLanguage: Language): Suggestion => {
      const id = generateNextId();
      const now = new Date().toISOString();

      const newSuggestion: Suggestion = {
        id,
        fullName: formState.fullName.trim(),
        mobileNumber: formState.mobileNumber.trim(),
        email: formState.email.trim() || undefined,
        country: formState.country,
        province: formState.province,
        district: formState.district,
        municipality: formState.municipality.trim() || undefined,
        wardNumber: formState.wardNumber.trim() || undefined,
        village: formState.village.trim(),
        fullAddress: formState.fullAddress.trim(),
        category: formState.category as any,
        priority: formState.priority,
        title: formState.title.trim(),
        description: formState.description.trim(),
        attachments: formState.attachments,
        status: 'received',
        submittedAt: now,
        updatedAt: now,
        submittedLanguage: submissionLanguage,
        assignedDepartment: 'Public Grievance Redressal Desk / नागरिक गुनासो सुनुवाइ कक्ष',
        timeline: [
          {
            status: 'received',
            timestamp: now,
            remarksEn: `Suggestion registered in civic portal with ID ${id}. Verification initiated.`,
            remarksNe: `सुझाव नागरिक पोर्टलमा दर्ता भई सुझाव नम्बर ${id} कायम गरियो। प्रमाणीकरण प्रक्रिया सुरु।`,
            actor: 'Civic Portal System',
          },
        ],
        upvotes: 1,
      };

      setSuggestions((prev) => [newSuggestion, ...prev]);
      resetForm();
      setActiveTrackId(id);
      return newSuggestion;
    },
    [formState, generateNextId, resetForm]
  );

  const getSuggestionById = useCallback(
    (id: string): Suggestion | undefined => {
      const cleanId = id.trim().toUpperCase();
      return suggestions.find(
        (s) => s.id.toUpperCase() === cleanId || s.mobileNumber.trim() === id.trim()
      );
    },
    [suggestions]
  );

  const findSuggestionsBySearch = useCallback(
    (query: string): Suggestion[] => {
      if (!query.trim()) return suggestions;
      const q = query.toLowerCase().trim();
      return suggestions.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.province.toLowerCase().includes(q) ||
          s.village.toLowerCase().includes(q) ||
          s.fullName.toLowerCase().includes(q) ||
          s.mobileNumber.includes(q)
      );
    },
    [suggestions]
  );

  const updateSuggestionStatus = useCallback(
    (
      id: string,
      newStatus: SuggestionStatus,
      adminNote: string,
      actorName: string = 'Ward Administration'
    ): boolean => {
      const now = new Date().toISOString();
      let updated = false;

      setSuggestions((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            updated = true;
            const newTimelineEvent = {
              status: newStatus,
              timestamp: now,
              remarksEn: adminNote.trim() || `Status updated to ${newStatus}.`,
              remarksNe: adminNote.trim() || `अवस्था ${newStatus} मा परिवर्तन गरियो।`,
              actor: actorName,
            };

            return {
              ...s,
              status: newStatus,
              updatedAt: now,
              adminNotes: adminNote.trim() || s.adminNotes,
              timeline: [newTimelineEvent, ...s.timeline],
            };
          }
          return s;
        })
      );

      return updated;
    },
    []
  );

  const upvoteSuggestion = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const hasUpvoted = !!s.hasUpvoted;
          return {
            ...s,
            upvotes: hasUpvoted ? s.upvotes - 1 : s.upvotes + 1,
            hasUpvoted: !hasUpvoted,
          };
        }
        return s;
      })
    );
  }, []);

  return (
    <SuggestionContext.Provider
      value={{
        suggestions,
        currentView,
        setCurrentView,
        formState,
        setFormState,
        updateFormField,
        resetForm,
        addSuggestion,
        getSuggestionById,
        findSuggestionsBySearch,
        updateSuggestionStatus,
        upvoteSuggestion,
        activeTrackId,
        setActiveTrackId,
        adminAuthenticated,
        setAdminAuthenticated,
        adminLanguage,
        setAdminLanguage,
        adminWhatsAppNumber,
        setAdminWhatsAppNumber,
      }}
    >
      {children}
    </SuggestionContext.Provider>
  );
};

export const useSuggestions = (): SuggestionContextType => {
  const context = useContext(SuggestionContext);
  if (!context) {
    throw new Error('useSuggestions must be used within a SuggestionProvider');
  }
  return context;
};
