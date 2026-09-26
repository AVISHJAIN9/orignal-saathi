export interface SupportedLanguage {
  code: string;
  nativeName: string;
  englishName: string;
  greeting: string;
  script: string;
  dir?: "ltr" | "rtl";
}

// Eighth Schedule's 22 Scheduled Languages + English, ordered strictly by maximum native speakers in India
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: "hi",
    nativeName: "हिन्दी",
    englishName: "Hindi",
    greeting: "नमस्ते",
    script: "Devanagari",
  },
  {
    code: "en",
    nativeName: "English",
    englishName: "English",
    greeting: "Welcome",
    script: "Latin",
  },
  {
    code: "bn",
    nativeName: "বাংলা",
    englishName: "Bengali",
    greeting: "স্বাগতম",
    script: "Bengali",
  },
  {
    code: "mr",
    nativeName: "मराठी",
    englishName: "Marathi",
    greeting: "नमस्कार",
    script: "Devanagari",
  },
  {
    code: "te",
    nativeName: "తెలుగు",
    englishName: "Telugu",
    greeting: "నమస్కారం",
    script: "Telugu",
  },
  {
    code: "ta",
    nativeName: "தமிழ்",
    englishName: "Tamil",
    greeting: "வணக்கம்",
    script: "Tamil",
  },
  {
    code: "gu",
    nativeName: "ગુજરાતી",
    englishName: "Gujarati",
    greeting: "નમસ્તે",
    script: "Gujarati",
  },
  {
    code: "ur",
    nativeName: "اردو",
    englishName: "Urdu",
    greeting: "خوش آمدید",
    script: "Perso-Arabic",
    dir: "rtl",
  },
  {
    code: "kn",
    nativeName: "ಕನ್ನಡ",
    englishName: "Kannada",
    greeting: "ನಮಸ್ಕಾರ",
    script: "Kannada",
  },
  {
    code: "or",
    nativeName: "ଓଡ଼ିଆ",
    englishName: "Odia",
    greeting: "ନମସ୍କାର",
    script: "Odia",
  },
  {
    code: "ml",
    nativeName: "മലയാളം",
    englishName: "Malayalam",
    greeting: "നമസ്കാരം",
    script: "Malayalam",
  },
  {
    code: "pa",
    nativeName: "ਪੰਜਾਬੀ",
    englishName: "Punjabi",
    greeting: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ",
    script: "Gurmukhi",
  },
  {
    code: "as",
    nativeName: "অসমীয়া",
    englishName: "Assamese",
    greeting: "নমস্কাৰ",
    script: "Bengali-Assamese",
  },
  {
    code: "mai",
    nativeName: "मैथिली",
    englishName: "Maithili",
    greeting: "प्रणाम",
    script: "Devanagari",
  },
  {
    code: "sat",
    nativeName: "संताली",
    englishName: "Santali",
    greeting: "ᱡᱚᱦᱟᱨ",
    script: "Ol Chiki",
  },
  {
    code: "ks",
    nativeName: "کٲشُر",
    englishName: "Kashmiri",
    greeting: "آداب",
    script: "Perso-Arabic",
    dir: "rtl",
  },
  {
    code: "ne",
    nativeName: "नेपाली",
    englishName: "Nepali",
    greeting: "नमस्ते",
    script: "Devanagari",
  },
  {
    code: "doi",
    nativeName: "डोगरी",
    englishName: "Dogri",
    greeting: "नमस्ते",
    script: "Devanagari",
  },
  {
    code: "kok",
    nativeName: "कोंकणी",
    englishName: "Konkani",
    greeting: "नमस्कार",
    script: "Devanagari",
  },
  {
    code: "mni",
    nativeName: "ꯃꯩꯇꯩ ꯂꯣꯟ",
    englishName: "Manipuri",
    greeting: "ꯈꯨꯔꯨꯝꯖꯔꯤ",
    script: "Meitei",
  },
  {
    code: "brx",
    nativeName: "बोडो",
    englishName: "Bodo",
    greeting: "खुल्लुमबाय",
    script: "Devanagari",
  },
  {
    code: "sa",
    nativeName: "संस्कृतम्",
    englishName: "Sanskrit",
    greeting: "नमस्ते",
    script: "Devanagari",
  },
];
