export type Language = 'en' | 'ne';

export type CategoryId =
  | 'road_transport'
  | 'education'
  | 'health'
  | 'water_sanitation'
  | 'electricity'
  | 'agriculture'
  | 'employment'
  | 'gov_services'
  | 'environment'
  | 'local_dev'
  | 'social_issues'
  | 'other';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type SuggestionStatus = 'received' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';

export interface LocationOption {
  id: string;
  nameEn: string;
  nameNe: string;
  displayLabel: string; // e.g. "Koshi Province (कोशी प्रदेश)"
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  dataUrl?: string;
}

export interface StatusTimelineEvent {
  status: SuggestionStatus;
  timestamp: string;
  remarksEn?: string;
  remarksNe?: string;
  actor: string; // e.g. "Ward 4 Officer", "Municipal Administration"
}

export interface Suggestion {
  id: string; // e.g. JS-2026-000001
  fullName: string;
  mobileNumber: string;
  email?: string;
  country: string; // "Nepal" or "India" or "Other"
  province: string; // "Bagmati Province" etc.
  district: string; // "Kathmandu" etc.
  municipality?: string;
  wardNumber?: string;
  village: string; // "Baluwatar / बालुवाटार"
  fullAddress: string;
  category: CategoryId;
  priority: PriorityLevel;
  title: string;
  description: string;
  attachments: AttachedFile[];
  status: SuggestionStatus;
  submittedAt: string; // ISO string
  updatedAt: string; // ISO string
  submittedLanguage: Language;
  assignedDepartment: string;
  timeline: StatusTimelineEvent[];
  adminNotes?: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface CivicFormState {
  fullName: string;
  mobileNumber: string;
  email: string;
  country: string;
  province: string;
  district: string;
  municipality: string;
  wardNumber: string;
  village: string;
  fullAddress: string;
  category: CategoryId | '';
  priority: PriorityLevel;
  title: string;
  description: string;
  attachments: AttachedFile[];
  agreedToTerms: boolean;
}
