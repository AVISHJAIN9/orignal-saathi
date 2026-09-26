const fs = require('fs');
const path = require('path');

const indexTsPath = path.join(__dirname, 'src', 'i18n', 'index.ts');
const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');

const namespaces = [
  'admin', 'alerts', 'appeals', 'audits', 'auth', 'businessAccount',
  'calendar', 'certificates', 'chain', 'chat', 'citation', 'classification',
  'conformity', 'conversation', 'corrections', 'cortex', 'dashboard',
  'developers', 'grievance', 'history', 'intel', 'invoices', 'jurisdiction',
  'laboratory', 'landing', 'legal', 'licenseActions', 'locations', 'nexus',
  'notifications', 'payments', 'profile', 'radar', 'recalls',
  'registration', 'renewal', 'renewals', 'retrievalQuality', 'scheme',
  'standards', 'testing', 'vault', 'visits', 'wizard',
];

const langs = [
  'en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 
  'ur', 'sa', 'ne', 'ks', 'kok', 'mni', 'brx', 'doi', 'mai', 'sat'
];

let out = `import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Generated imports for all languages and namespaces
`;

for (const lang of langs) {
  out += `// ── ${lang.toUpperCase()} ────────────────────────────────────────────────────────────\n`;
  for (const ns of namespaces) {
    const importName = `${lang}${ns.charAt(0).toUpperCase() + ns.slice(1)}`;
    out += `import ${importName} from "./locales/${lang}/${ns}.json";\n`;
  }
  out += `\n`;
}

out += `export const LANGUAGES = [
  "en", "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or", "as",
  "ur", "sa", "ne", "ks", "kok", "mni", "brx", "doi", "mai", "sat",
];

export const RTL_LANGS = new Set(["ur", "ks"]);

const resources = {
`;

for (const lang of langs) {
  out += `  ${lang}: {\n`;
  for (const ns of namespaces) {
    const importName = `${lang}${ns.charAt(0).toUpperCase() + ns.slice(1)}`;
    out += `    ${ns}: ${importName},\n`;
  }
  out += `  },\n`;
}

out += `};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: [
      "admin", "alerts", "appeals", "audits", "auth", "businessAccount",
      "calendar", "certificates", "chain", "chat", "citation", "classification",
      "conformity", "conversation", "corrections", "cortex", "dashboard",
      "developers", "grievance", "history", "intel", "invoices", "jurisdiction",
      "laboratory", "landing", "legal", "licenseActions", "locations", "nexus",
      "notifications", "payments", "profile", "radar", "recalls",
      "registration", "renewal", "renewals", "retrievalQuality", "scheme",
      "standards", "testing", "vault", "visits", "wizard"
    ],
    defaultNS: "chat",
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

export const syncDocumentLanguage = (lang: string) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
  }
};

export default i18n;
`;

fs.writeFileSync(indexTsPath, out, 'utf8');
console.log('Successfully updated index.ts');
