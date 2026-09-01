import { CategoryId, PriorityLevel, SuggestionStatus } from '../types';

export interface CategoryMetadata {
  id: CategoryId;
  nameEn: string;
  nameNe: string;
  displayLabel: string;
  iconName: string;
  colorClass: string;
  department: string;
}

export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'road_transport',
    nameEn: 'Road & Transportation',
    nameNe: 'सडक तथा यातायात',
    displayLabel: 'Road & Transportation / सडक तथा यातायात',
    iconName: 'Car',
    colorClass: 'bg-amber-100 text-amber-800 border-amber-300',
    department: 'Department of Roads & Infrastructure / सडक तथा पूर्वाधार शाखा',
  },
  {
    id: 'education',
    nameEn: 'Education',
    nameNe: 'शिक्षा',
    displayLabel: 'Education / शिक्षा',
    iconName: 'GraduationCap',
    colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    department: 'Education & Youth Development Section / शिक्षा तथा युवा विकास शाखा',
  },
  {
    id: 'health',
    nameEn: 'Health',
    nameNe: 'स्वास्थ्य',
    displayLabel: 'Health / स्वास्थ्य',
    iconName: 'HeartPulse',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300',
    department: 'Public Health & Sanitation Branch / जनस्वास्थ्य तथा सरसफाइ शाखा',
  },
  {
    id: 'water_sanitation',
    nameEn: 'Water & Sanitation',
    nameNe: 'खानेपानी तथा सरसफाइ',
    displayLabel: 'Water & Sanitation / खानेपानी तथा सरसफाइ',
    iconName: 'Droplets',
    colorClass: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    department: 'Drinking Water & Drainage Section / खानेपानी तथा ढल निकास शाखा',
  },
  {
    id: 'electricity',
    nameEn: 'Electricity',
    nameNe: 'विद्युत',
    displayLabel: 'Electricity / विद्युत',
    iconName: 'Zap',
    colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    department: 'Energy & Street Light Section / विद्युत तथा सडक बत्ती शाखा',
  },
  {
    id: 'agriculture',
    nameEn: 'Agriculture',
    nameNe: 'कृषि',
    displayLabel: 'Agriculture / कृषि',
    iconName: 'Wheat',
    colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    department: 'Agriculture & Livestock Services / कृषि तथा पशुसेवा विकास शाखा',
  },
  {
    id: 'employment',
    nameEn: 'Employment',
    nameNe: 'रोजगारी',
    displayLabel: 'Employment / रोजगारी',
    iconName: 'Briefcase',
    colorClass: 'bg-blue-100 text-blue-800 border-blue-300',
    department: 'Prime Minister Employment Program & Skill Wing / रोजगार सेवा केन्द्र',
  },
  {
    id: 'gov_services',
    nameEn: 'Government Services',
    nameNe: 'सरकारी सेवा',
    displayLabel: 'Government Services / सरकारी सेवा',
    iconName: 'Building2',
    colorClass: 'bg-purple-100 text-purple-800 border-purple-300',
    department: 'General Administration & Ward Service Cell / सामान्य प्रशासन तथा वडा सेवा केन्द्र',
  },
  {
    id: 'environment',
    nameEn: 'Environment',
    nameNe: 'वातावरण',
    displayLabel: 'Environment / वातावरण',
    iconName: 'Trees',
    colorClass: 'bg-teal-100 text-teal-800 border-teal-300',
    department: 'Forest, Environment & Waste Management / वन, वातावरण तथा फोहोर व्यवस्थापन शाखा',
  },
  {
    id: 'local_dev',
    nameEn: 'Local Development',
    nameNe: 'स्थानीय विकास',
    displayLabel: 'Local Development / स्थानीय विकास',
    iconName: 'Hammer',
    colorClass: 'bg-orange-100 text-orange-800 border-orange-300',
    department: 'Planning & Community Development Branch / योजना तथा सामुदायिक विकास शाखा',
  },
  {
    id: 'social_issues',
    nameEn: 'Social Issues',
    nameNe: 'सामाजिक समस्या',
    displayLabel: 'Social Issues / सामाजिक समस्या',
    iconName: 'Users',
    colorClass: 'bg-pink-100 text-pink-800 border-pink-300',
    department: 'Social Welfare & Community Harmony Cell / सामाजिक विकास शाखा',
  },
  {
    id: 'other',
    nameEn: 'Other',
    nameNe: 'अन्य',
    displayLabel: 'Other / अन्य',
    iconName: 'HelpCircle',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
    department: 'Public Grievance Redressal Desk / नागरिक गुनासो सुनुवाइ कक्ष',
  },
];

export const PRIORITIES: {
  id: PriorityLevel;
  nameEn: string;
  nameNe: string;
  badgeClass: string;
  borderClass: string;
}[] = [
  {
    id: 'low',
    nameEn: 'Low',
    nameNe: 'कम',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    borderClass: 'border-slate-300 hover:border-slate-400',
  },
  {
    id: 'medium',
    nameEn: 'Medium',
    nameNe: 'मध्यम',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    borderClass: 'border-blue-300 hover:border-blue-500',
  },
  {
    id: 'high',
    nameEn: 'High',
    nameNe: 'उच्च',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    borderClass: 'border-amber-300 hover:border-amber-500',
  },
  {
    id: 'urgent',
    nameEn: 'Urgent',
    nameNe: 'अत्यावश्यक',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
    borderClass: 'border-rose-400 hover:border-rose-600',
  },
];

export const STATUSES: {
  id: SuggestionStatus;
  nameEn: string;
  nameNe: string;
  badgeClass: string;
  iconName: string;
}[] = [
  {
    id: 'received',
    nameEn: 'Received',
    nameNe: 'प्राप्त भयो',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    iconName: 'Inbox',
  },
  {
    id: 'under_review',
    nameEn: 'Under Review',
    nameNe: 'समीक्षा हुँदैछ',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    iconName: 'Clock',
  },
  {
    id: 'in_progress',
    nameEn: 'In Progress',
    nameNe: 'कार्यान्वयन हुँदैछ',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    iconName: 'Activity',
  },
  {
    id: 'resolved',
    nameEn: 'Resolved',
    nameNe: 'समाधान भयो',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconName: 'CheckCircle2',
  },
  {
    id: 'rejected',
    nameEn: 'Rejected',
    nameNe: 'अस्वीकृत',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    iconName: 'XCircle',
  },
];
