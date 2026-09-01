import { Suggestion, Language } from '../types';
import { CATEGORIES, PRIORITIES } from '../data/categories';

export function formatWhatsAppMessage(
  suggestion: Suggestion,
  mode: 'bilingual' | 'citizen' = 'bilingual'
): string {
  const categoryMeta = CATEGORIES.find((c) => c.id === suggestion.category);
  const priorityMeta = PRIORITIES.find((p) => p.id === suggestion.priority);

  const categoryName = categoryMeta
    ? `${categoryMeta.nameEn} / ${categoryMeta.nameNe}`
    : suggestion.category;

  const priorityName = priorityMeta
    ? `${priorityMeta.nameEn} / ${priorityMeta.nameNe}`
    : suggestion.priority;

  const dateFormatted = new Date(suggestion.submittedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (mode === 'citizen' && suggestion.submittedLanguage === 'ne') {
    return `━━━━━━━━━━━━━━━━━━
📢 नयाँ सार्वजनिक सुझाव
━━━━━━━━━━━━━━━━━━

🆔 सुझाव नम्बर:
${suggestion.id}

👤 नाम:
${suggestion.fullName}

📱 मोबाइल नम्बर:
${suggestion.mobileNumber}

🌍 देश:
${suggestion.country}

📍 प्रदेश:
${suggestion.province}

🏙️ जिल्ला:
${suggestion.district}

🏘️ गाउँ/टोल:
${suggestion.village}

📌 ठेगाना:
${suggestion.fullAddress}

📂 विषय:
${categoryMeta?.nameNe || suggestion.category}

🚨 प्राथमिकता:
${priorityMeta?.nameNe || suggestion.priority}

📝 सुझाव / समस्या:
${suggestion.title}
${suggestion.description}

📅 दर्ता मिति:
${dateFormatted}

━━━━━━━━━━━━━━━━━━
जनसेवा डिजिटल नागरिक पोर्टल
https://janaseva.gov.np`;
  }

  if (mode === 'citizen' && suggestion.submittedLanguage === 'en') {
    return `━━━━━━━━━━━━━━━━━━
📢 NEW PUBLIC SUGGESTION
━━━━━━━━━━━━━━━━━━

🆔 Suggestion ID:
${suggestion.id}

👤 Name:
${suggestion.fullName}

📱 Mobile Number:
${suggestion.mobileNumber}

🌍 Country:
${suggestion.country}

📍 Region / Province:
${suggestion.province}

🏙️ District:
${suggestion.district}

🏘️ Village / Locality:
${suggestion.village}

📌 Address:
${suggestion.fullAddress}

📂 Category:
${categoryMeta?.nameEn || suggestion.category}

🚨 Priority:
${priorityMeta?.nameEn || suggestion.priority}

📝 Suggestion / Report:
${suggestion.title}
${suggestion.description}

📅 Submitted:
${dateFormatted}

━━━━━━━━━━━━━━━━━━
Janaseva Civic Portal
https://janaseva.gov.np`;
  }

  // Bilingual mode (Default & recommended)
  return `━━━━━━━━━━━━━━━━━━
📢 NEW PUBLIC SUGGESTION
📢 नयाँ सार्वजनिक सुझाव
━━━━━━━━━━━━━━━━━━

🆔 Suggestion ID / सुझाव नम्बर:
${suggestion.id}

👤 Name / नाम:
${suggestion.fullName}

📱 Mobile / मोबाइल:
${suggestion.mobileNumber}

🌍 Country / देश:
${suggestion.country}

📍 Region / प्रदेश:
${suggestion.province}

🏙️ District / जिल्ला:
${suggestion.district}

🏘️ Village / गाउँ:
${suggestion.village}

📌 Address / ठेगाना:
${suggestion.fullAddress}

📂 Category / विषय:
${categoryName}

🚨 Priority / प्राथमिकता:
${priorityName}

📝 Suggestion / सुझाव:
${suggestion.title}
${suggestion.description}

📅 Submitted / दर्ता मिति:
${dateFormatted}

━━━━━━━━━━━━━━━━━━
Janaseva Civic Portal | जनसेवा डिजिटल नागरिक पोर्टल`;
}

export function getWhatsAppShareUrl(message: string, phoneNumber?: string): string {
  const encodedText = encodeURIComponent(message);
  if (phoneNumber) {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}
