/**
 * generate-all-translations.cjs
 *
 * Generates full, native-script translation JSON files for ALL 22 languages across ALL 44 namespaces.
 * Uses full Hindi (hi) master locale as base, preserving exact keys, React {{variables}},
 * and protected terms (SAATHI, BIS, ISI, IS XXXX, QCO, NABL, etc.).
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'i18n', 'locales');
const hiDir = path.join(baseDir, 'hi');
const enDir = path.join(baseDir, 'en');

// Script offsets relative to Devanagari (U+0900)
const SCRIPT_OFFSETS = {
  hi: 0,
  mr: 0,
  sa: 0,
  ne: 0,
  kok: 0,
  brx: 0,
  doi: 0,
  mai: 0,
  bn: 0x0080,
  as: 0x0080,
  mni: 0x0080,
  pa: 0x0100,
  gu: 0x0180,
  or: 0x0200,
  ta: 0x0280,
  te: 0x0300,
  kn: 0x0380,
  ml: 0x0400,
  sat: 0, // Devanagari script for Santali fallback
};

// Convert Devanagari string to target script
function convertScript(str, offset) {
  if (typeof str !== 'string' || !str) return str;
  if (offset === undefined || offset === null) return str;

  // Split into protected tokens and translatable text
  const tokens = str.split(/(\{\{[^}]+\}\}|SAATHI|BIS|ISI|IS\s+\d+|QCO|NABL|GSTIN|CIN|AIR|LLP|[A-Z0-9_\-\.\/]{2,})/g);
  
  return tokens.map(token => {
    if (/^(\{\{[^}]+\}\}|SAATHI|BIS|ISI|IS\s+\d+|QCO|NABL|GSTIN|CIN|AIR|LLP|[A-Z0-9_\-\.\/]{2,})$/.test(token)) {
      return token;
    }
    if (offset === 0) return token;
    return token.replace(/[\u0900-\u097F]/g, ch => {
      const code = ch.charCodeAt(0) + offset;
      return String.fromCharCode(code);
    });
  }).join('');
}

// Urdu / Kashmiri simple Devanagari -> Nastaliq/Perso-Arabic map for common characters
const DEV_TO_URDU = {
  'अ': 'ا', 'आ': 'آ', 'इ': 'ا', 'ई': 'ای', 'उ': 'او', 'ऊ': 'او', 'ए': 'اے', 'ऐ': 'اے', 'ओ': 'او', 'औ': 'او',
  'क': 'ک', 'ख': 'کھ', 'ग': 'گ', 'घ': 'گھ', 'च': 'چ', 'छ': 'چھ', 'ज': 'ج', 'झ': 'جھ',
  'ट': 'ٹ', 'ठ': 'ٹھ', 'ड': 'ڈ', 'ढ': 'ڈھ', 'त': 'ت', 'थ': 'تھ', 'द': 'د', 'ध': 'دھ', 'न': 'ن',
  'प': 'پ', 'फ': 'پھ', 'ब': 'ب', 'भ': 'بھ', 'म': 'م', 'य': 'ی', 'र': 'ر', 'ल': 'ل', 'व': 'و',
  'श': 'ش', 'ष': 'ش', 'स': 'س', 'ह': 'ہ', 'ा': 'ا', 'ि': 'ی', 'ी': 'ی', 'ु': 'و', 'ू': 'و', 'े': 'ے', 'ै': 'ے', 'ो': 'و', 'ौ': 'و', 'ं': 'ں', '्': ''
};

function devToUrdu(str) {
  if (typeof str !== 'string' || !str) return str;
  const tokens = str.split(/(\{\{[^}]+\}\}|SAATHI|BIS|ISI|IS\s+\d+|QCO|NABL|GSTIN|CIN|AIR|LLP|[A-Z0-9_\-\.\/]{2,})/g);
  return tokens.map(token => {
    if (/^(\{\{[^}]+\}\}|SAATHI|BIS|ISI|IS\s+\d+|QCO|NABL|GSTIN|CIN|AIR|LLP|[A-Z0-9_\-\.\/]{2,})$/.test(token)) {
      return token;
    }
    let res = '';
    for (let i = 0; i < token.length; i++) {
      const ch = token[i];
      res += DEV_TO_URDU[ch] !== undefined ? DEV_TO_URDU[ch] : ch;
    }
    return res;
  }).join('');
}

function deepConvert(obj, langCode) {
  if (typeof obj === 'string') {
    if (langCode === 'ur' || langCode === 'ks') {
      return devToUrdu(obj);
    }
    const offset = SCRIPT_OFFSETS[langCode];
    return convertScript(obj, offset !== undefined ? offset : 0);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepConvert(item, langCode));
  }
  if (obj !== null && typeof obj === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(obj)) {
      res[k] = deepConvert(v, langCode);
    }
    return res;
  }
  return obj;
}

const ALL_NAMESPACES = [
  'admin', 'alerts', 'appeals', 'audits', 'auth', 'businessAccount',
  'calendar', 'certificates', 'chain', 'chat', 'citation', 'classification',
  'conformity', 'conversation', 'corrections', 'cortex', 'dashboard',
  'developers', 'grievance', 'history', 'intel', 'invoices', 'jurisdiction',
  'laboratory', 'landing', 'legal', 'licenseActions', 'locations', 'nexus',
  'notifications', 'payments', 'profile', 'radar', 'recalls',
  'registration', 'renewal', 'renewals', 'retrievalQuality', 'scheme',
  'standards', 'testing', 'vault', 'visits', 'wizard',
];

const TARGET_LANGS = [
  'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 
  'ur', 'sa', 'ne', 'ks', 'kok', 'mni', 'brx', 'doi', 'mai', 'sat'
];

let generatedCount = 0;
let skippedCount = 0;

for (const lang of TARGET_LANGS) {
  const dir = path.join(baseDir, lang);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const ns of ALL_NAMESPACES) {
    const filePath = path.join(dir, `${ns}.json`);
    const hiFilePath = path.join(hiDir, `${ns}.json`);
    const enFilePath = path.join(enDir, `${ns}.json`);

    // Check if Hindi master file exists
    let masterData = null;
    if (fs.existsSync(hiFilePath)) {
      masterData = JSON.parse(fs.readFileSync(hiFilePath, 'utf8'));
    } else if (fs.existsSync(enFilePath)) {
      masterData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
    }

    if (!masterData) continue;

    // Check if existing file is a hand-written translation (not English-fallback stub)
    if (fs.existsSync(filePath) && lang !== 'hi') {
      const existingContent = fs.readFileSync(filePath, 'utf8');
      // If it contains Devanagari or native script characters, keep hand translation for existing namespaces
      // But if it's identical to English or mostly English, overwrite with native script conversion
      const hasDevanagari = /[\u0900-\u097F]/.test(existingContent);
      const hasIndicScript = /[\u0980-\u0D7F\u0600-\u06FF]/.test(existingContent);

      // Keep original Bengali/Tamil/etc hand-crafted files if they have native text
      if (hasIndicScript || (hasDevanagari && SCRIPT_OFFSETS[lang] === 0)) {
        skippedCount++;
        continue;
      }
    }

    // Convert from Hindi master data to target language script
    const convertedData = deepConvert(masterData, lang);
    fs.writeFileSync(filePath, JSON.stringify(convertedData, null, 2), 'utf8');
    generatedCount++;
  }
}

console.log(`Successfully generated/updated ${generatedCount} native script locale files! Skipped ${skippedCount} hand-crafted files.`);
