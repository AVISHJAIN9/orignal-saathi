export interface SupportedLanguage {
  code: string;
  nativeName: string;
  englishName: string;
  greeting: string;
  script: string;
  dir?: "ltr" | "rtl";
}

// Two consumers: the landing page's cultural greeting ticker (AudienceSection),
// which cycles through all 22 Eighth Schedule languages + English as a
// cultural touch, and the language picker (LanguageToggle /
// LandingLanguageToggle), which uses this dataset only to look up the native
// script + RTL direction for whatever codes are actually registered in
// src/i18n/index.ts's LANGUAGES. Listing a language here is NOT a claim of
// functional support by itself — that's gated entirely by LANGUAGES, which
// today is English/Hindi only. Content ported from the reference
// implementation.
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: "en",
    nativeName: "English",
    englishName: "English",
    greeting: "Welcome",
    script: "Latin",
  },
  {
    code: "hi",
    nativeName: "हिन्दी",
    englishName: "Hindi",
    greeting: "नमस्ते",
    script: "Devanagari",
  },
  {
    code: "bn",
    nativeName: "বাংলা",
    englishName: "Bengali",
    greeting: "স্বাগতম",
    script: "Bengali",
  },
  {
    code: "ta",
    nativeName: "தமிழ்",
    englishName: "Tamil",
    greeting: "வணக்கம்",
    script: "Tamil",
  },
  {
    code: "te",
    nativeName: "తెలుగు",
    englishName: "Telugu",
    greeting: "నమస్కారం",
    script: "Telugu",
  },
  {
    code: "mr",
    nativeName: "मराठी",
    englishName: "Marathi",
    greeting: "नमस्कार",
    script: "Devanagari",
  },
  {
    code: "gu",
    nativeName: "ગુજરાતી",
    englishName: "Gujarati",
    greeting: "નમસ્તે",
    script: "Gujarati",
  },
  {
    code: "kn",
    nativeName: "ಕನ್ನಡ",
    englishName: "Kannada",
    greeting: "ನಮಸ್ಕಾರ",
    script: "Kannada",
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
    code: "or",
    nativeName: "ଓଡ଼ିଆ",
    englishName: "Odia",
    greeting: "ନମସ୍କାର",
    script: "Odia",
  },
  {
    code: "as",
    nativeName: "অসমীয়া",
    englishName: "Assamese",
    greeting: "নমস্কাৰ",
    script: "Bengali-Assamese",
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
    code: "sa",
    nativeName: "संस्कृतम्",
    englishName: "Sanskrit",
    greeting: "नमस्ते",
    script: "Devanagari",
  },
  {
    code: "ks",
    nativeName: "कश्मीरी",
    englishName: "Kashmiri",
    greeting: "آداب",
    script: "Perso-Arabic",
    dir: "rtl",
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
    nativeName: "मणिपुरी",
    englishName: "Manipuri",
    greeting: "খুরুমজরী",
    script: "Meitei",
  },
  {
    code: "ne",
    nativeName: "नेपाली",
    englishName: "Nepali",
    greeting: "नमस्ते",
    script: "Devanagari",
  },
  {
    code: "brx",
    nativeName: "बोडो",
    englishName: "Bodo",
    greeting: "खुल्लुमबाय",
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
];

// Single source of truth for "is this language RTL" — used to sync
// html[dir] (src/i18n/index.ts) and to flip components with a hardcoded
// physical side, like the mobile drawer (src/components/mobile-sidebar.tsx).
export function isRtlLanguage(code: string): boolean {
  return (
    SUPPORTED_LANGUAGES.find((language) => language.code === code)?.dir ===
    "rtl"
  );
}
