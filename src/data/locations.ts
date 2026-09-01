export interface ProvinceData {
  id: string;
  nameEn: string;
  nameNe: string;
  displayLabel: string;
  districts: {
    id: string;
    nameEn: string;
    nameNe: string;
    displayLabel: string;
  }[];
}

export const COUNTRIES = [
  { id: 'nepal', nameEn: 'Nepal', nameNe: 'नेपाल', displayLabel: 'Nepal (नेपाल)' },
  { id: 'india', nameEn: 'India', nameNe: 'भारत', displayLabel: 'India (भारत)' },
  { id: 'other', nameEn: 'Other', nameNe: 'अन्य', displayLabel: 'Other (अन्य)' },
];

export const NEPAL_PROVINCES: ProvinceData[] = [
  {
    id: 'koshi',
    nameEn: 'Koshi Province',
    nameNe: 'कोशी प्रदेश',
    displayLabel: 'Koshi Province (कोशी प्रदेश)',
    districts: [
      { id: 'jhapa', nameEn: 'Jhapa', nameNe: 'झापा', displayLabel: 'Jhapa (झापा)' },
      { id: 'morang', nameEn: 'Morang', nameNe: 'मोरङ', displayLabel: 'Morang (मोरङ)' },
      { id: 'sunsari', nameEn: 'Sunsari', nameNe: 'सुनसरी', displayLabel: 'Sunsari (सुनसरी)' },
      { id: 'ilam', nameEn: 'Ilam', nameNe: 'इलाम', displayLabel: 'Ilam (इलाम)' },
      { id: 'dhankuta', nameEn: 'Dhankuta', nameNe: 'धनकुटा', displayLabel: 'Dhankuta (धनकुटा)' },
      { id: 'udayapur', nameEn: 'Udayapur', nameNe: 'उदयपुर', displayLabel: 'Udayapur (उदयपुर)' },
      { id: 'bhojpur', nameEn: 'Bhojpur', nameNe: 'भोजपुर', displayLabel: 'Bhojpur (भोजपुर)' },
      { id: 'solukhumbu', nameEn: 'Solukhumbu', nameNe: 'सोलुखुम्बु', displayLabel: 'Solukhumbu (सोलुखुम्बु)' },
    ],
  },
  {
    id: 'madhesh',
    nameEn: 'Madhesh Province',
    nameNe: 'मधेश प्रदेश',
    displayLabel: 'Madhesh Province (मधेश प्रदेश)',
    districts: [
      { id: 'dhanusha', nameEn: 'Dhanusha', nameNe: 'धनुषा', displayLabel: 'Dhanusha (धनुषा)' },
      { id: 'parsa', nameEn: 'Parsa', nameNe: 'पर्सा', displayLabel: 'Parsa (पर्सा)' },
      { id: 'bara', nameEn: 'Bara', nameNe: 'बारा', displayLabel: 'Bara (बारा)' },
      { id: 'rautahat', nameEn: 'Rautahat', nameNe: 'रौतहट', displayLabel: 'Rautahat (रौतहट)' },
      { id: 'sarlahi', nameEn: 'Sarlahi', nameNe: 'सर्लाही', displayLabel: 'Sarlahi (सर्लाही)' },
      { id: 'mahottari', nameEn: 'Mahottari', nameNe: 'महोत्तरी', displayLabel: 'Mahottari (महोत्तरी)' },
      { id: 'siraha', nameEn: 'Siraha', nameNe: 'सिराहा', displayLabel: 'Siraha (सिराहा)' },
      { id: 'saptari', nameEn: 'Saptari', nameNe: 'सप्तरी', displayLabel: 'Saptari (सप्तरी)' },
    ],
  },
  {
    id: 'bagmati',
    nameEn: 'Bagmati Province',
    nameNe: 'बागमती प्रदेश',
    displayLabel: 'Bagmati Province (बागमती प्रदेश)',
    districts: [
      { id: 'kathmandu', nameEn: 'Kathmandu', nameNe: 'काठमाडौं', displayLabel: 'Kathmandu (काठमाडौं)' },
      { id: 'lalitpur', nameEn: 'Lalitpur', nameNe: 'ललितपुर', displayLabel: 'Lalitpur (ललितपुर)' },
      { id: 'bhaktapur', nameEn: 'Bhaktapur', nameNe: 'भक्तपुर', displayLabel: 'Bhaktapur (भक्तपुर)' },
      { id: 'chitwan', nameEn: 'Chitwan', nameNe: 'चितवन', displayLabel: 'Chitwan (चितवन)' },
      { id: 'kavrepalanchok', nameEn: 'Kavrepalanchok', nameNe: 'काभ्रेपलाञ्चोक', displayLabel: 'Kavrepalanchok (काभ्रेपलाञ्चोक)' },
      { id: 'makwanpur', nameEn: 'Makwanpur', nameNe: 'मकवानपुर', displayLabel: 'Makwanpur (मकवानपुर)' },
      { id: 'dhading', nameEn: 'Dhading', nameNe: 'धादिङ', displayLabel: 'Dhading (धादिङ)' },
      { id: 'nuwakot', nameEn: 'Nuwakot', nameNe: 'नुवाकोट', displayLabel: 'Nuwakot (नुवाकोट)' },
      { id: 'sindhupalchok', nameEn: 'Sindhupalchok', nameNe: 'सिन्धुपाल्चोक', displayLabel: 'Sindhupalchok (सिन्धुपाल्चोक)' },
      { id: 'dolakha', nameEn: 'Dolakha', nameNe: 'दोलखा', displayLabel: 'Dolakha (दोलखा)' },
    ],
  },
  {
    id: 'gandaki',
    nameEn: 'Gandaki Province',
    nameNe: 'गण्डकी प्रदेश',
    displayLabel: 'Gandaki Province (गण्डकी प्रदेश)',
    districts: [
      { id: 'kaski', nameEn: 'Kaski', nameNe: 'कास्की', displayLabel: 'Kaski (कास्की)' },
      { id: 'tanahun', nameEn: 'Tanahun', nameNe: 'तनहुँ', displayLabel: 'Tanahun (तनहुँ)' },
      { id: 'syangja', nameEn: 'Syangja', nameNe: 'स्याङ्जा', displayLabel: 'Syangja (स्याङ्जा)' },
      { id: 'gorkha', nameEn: 'Gorkha', nameNe: 'गोरखा', displayLabel: 'Gorkha (गोरखा)' },
      { id: 'nawalpur', nameEn: 'Nawalpur', nameNe: 'नवलपुर', displayLabel: 'Nawalpur (नवलपुर)' },
      { id: 'baglung', nameEn: 'Baglung', nameNe: 'बागलुङ', displayLabel: 'Baglung (बागलुङ)' },
      { id: 'parbat', nameEn: 'Parbat', nameNe: 'पर्वत', displayLabel: 'Parbat (पर्वत)' },
      { id: 'myagdi', nameEn: 'Myagdi', nameNe: 'म्याग्दी', displayLabel: 'Myagdi (म्याग्दी)' },
      { id: 'mustang', nameEn: 'Mustang', nameNe: 'मुस्ताङ', displayLabel: 'Mustang (मुस्ताङ)' },
    ],
  },
  {
    id: 'lumbini',
    nameEn: 'Lumbini Province',
    nameNe: 'लुम्बिनी प्रदेश',
    displayLabel: 'Lumbini Province (लुम्बिनी प्रदेश)',
    districts: [
      { id: 'rupandehi', nameEn: 'Rupandehi', nameNe: 'रुपन्देही', displayLabel: 'Rupandehi (रुपन्देही)' },
      { id: 'banke', nameEn: 'Banke', nameNe: 'बाँके', displayLabel: 'Banke (बाँके)' },
      { id: 'dang', nameEn: 'Dang', nameNe: 'दाङ', displayLabel: 'Dang (दाङ)' },
      { id: 'kapilvastu', nameEn: 'Kapilvastu', nameNe: 'कपिलवस्तु', displayLabel: 'Kapilvastu (कपिलवस्तु)' },
      { id: 'bardiya', nameEn: 'Bardiya', nameNe: 'बर्दिया', displayLabel: 'Bardiya (बर्दिया)' },
      { id: 'palpa', nameEn: 'Palpa', nameNe: 'पाल्पा', displayLabel: 'Palpa (पाल्पा)' },
      { id: 'parasi', nameEn: 'Parasi', nameNe: 'परासी', displayLabel: 'Parasi (परासी)' },
      { id: 'pyuthan', nameEn: 'Pyuthan', nameNe: 'प्युठान', displayLabel: 'Pyuthan (प्युठान)' },
      { id: 'gulmi', nameEn: 'Gulmi', nameNe: 'गुल्मी', displayLabel: 'Gulmi (गुल्मी)' },
    ],
  },
  {
    id: 'karnali',
    nameEn: 'Karnali Province',
    nameNe: 'कर्णाली प्रदेश',
    displayLabel: 'Karnali Province (कर्णाली प्रदेश)',
    districts: [
      { id: 'surkhet', nameEn: 'Surkhet', nameNe: 'सुर्खेत', displayLabel: 'Surkhet (सुर्खेत)' },
      { id: 'jumla', nameEn: 'Jumla', nameNe: 'जुम्ला', displayLabel: 'Jumla (जुम्ला)' },
      { id: 'dailekh', nameEn: 'Dailekh', nameNe: 'दैलेख', displayLabel: 'Dailekh (दैलेख)' },
      { id: 'salyan', nameEn: 'Salyan', nameNe: 'सल्यान', displayLabel: 'Salyan (सल्यान)' },
      { id: 'kalikot', nameEn: 'Kalikot', nameNe: 'कालिकोट', displayLabel: 'Kalikot (कालिकोट)' },
      { id: 'jajarkot', nameEn: 'Jajarkot', nameNe: 'जाजरकोट', displayLabel: 'Jajarkot (जाजरकोट)' },
      { id: 'mugu', nameEn: 'Mugu', nameNe: 'मुगु', displayLabel: 'Mugu (मुगु)' },
      { id: 'humla', nameEn: 'Humla', nameNe: 'हुम्ला', displayLabel: 'Humla (हुम्ला)' },
    ],
  },
  {
    id: 'sudurpashchim',
    nameEn: 'Sudurpashchim Province',
    nameNe: 'सुदूरपश्चिम प्रदेश',
    displayLabel: 'Sudurpashchim Province (सुदूरपश्चिम प्रदेश)',
    districts: [
      { id: 'kailali', nameEn: 'Kailali', nameNe: 'कैलाली', displayLabel: 'Kailali (कैलाली)' },
      { id: 'kanchanpur', nameEn: 'Kanchanpur', nameNe: 'कञ्चनपुर', displayLabel: 'Kanchanpur (कञ्चनपुर)' },
      { id: 'doti', nameEn: 'Doti', nameNe: 'डोटी', displayLabel: 'Doti (डोटी)' },
      { id: 'achham', nameEn: 'Achham', nameNe: 'अछाम', displayLabel: 'Achham (अछाम)' },
      { id: 'dadeldhura', nameEn: 'Dadeldhura', nameNe: 'डडेलधुरा', displayLabel: 'Dadeldhura (डडेलधुरा)' },
      { id: 'baitadi', nameEn: 'Baitadi', nameNe: 'बैतडी', displayLabel: 'Baitadi (बैतडी)' },
      { id: 'darchula', nameEn: 'Darchula', nameNe: 'दार्चुला', displayLabel: 'Darchula (दार्चुला)' },
      { id: 'bajhang', nameEn: 'Bajhang', nameNe: 'बझाङ', displayLabel: 'Bajhang (बझाङ)' },
      { id: 'bajura', nameEn: 'Bajura', nameNe: 'बाजुरा', displayLabel: 'Bajura (बाजुरा)' },
    ],
  },
];
