import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { isRtlLanguage } from "./languages";

import enAdmin from "./locales/en/admin.json";
import enAuth from "./locales/en/auth.json";
import enChat from "./locales/en/chat.json";
import enCitation from "./locales/en/citation.json";
import enClassification from "./locales/en/classification.json";
import enConformity from "./locales/en/conformity.json";
import enConversation from "./locales/en/conversation.json";
import enCortex from "./locales/en/cortex.json";
import enDashboard from "./locales/en/dashboard.json";
import enDevelopers from "./locales/en/developers.json";
import enGrievance from "./locales/en/grievance.json";
import enHistory from "./locales/en/history.json";
import enIntel from "./locales/en/intel.json";
import enJurisdiction from "./locales/en/jurisdiction.json";
import enLanding from "./locales/en/landing.json";
import enLegal from "./locales/en/legal.json";
import enNexus from "./locales/en/nexus.json";
import enNotifications from "./locales/en/notifications.json";
import enPayments from "./locales/en/payments.json";
import enProfile from "./locales/en/profile.json";
import enRadar from "./locales/en/radar.json";
import enRegistration from "./locales/en/registration.json";
import enRenewal from "./locales/en/renewal.json";
import enStandards from "./locales/en/standards.json";
import enTesting from "./locales/en/testing.json";
import enVault from "./locales/en/vault.json";
import enWizard from "./locales/en/wizard.json";
import hiAdmin from "./locales/hi/admin.json";
import hiAuth from "./locales/hi/auth.json";
import hiChat from "./locales/hi/chat.json";
import hiCitation from "./locales/hi/citation.json";
import hiClassification from "./locales/hi/classification.json";
import hiConformity from "./locales/hi/conformity.json";
import hiConversation from "./locales/hi/conversation.json";
import hiCortex from "./locales/hi/cortex.json";
import hiDashboard from "./locales/hi/dashboard.json";
import hiDevelopers from "./locales/hi/developers.json";
import hiGrievance from "./locales/hi/grievance.json";
import hiHistory from "./locales/hi/history.json";
import hiIntel from "./locales/hi/intel.json";
import hiJurisdiction from "./locales/hi/jurisdiction.json";
import hiLanding from "./locales/hi/landing.json";
import hiLegal from "./locales/hi/legal.json";
import hiNexus from "./locales/hi/nexus.json";
import hiNotifications from "./locales/hi/notifications.json";
import hiPayments from "./locales/hi/payments.json";
import hiProfile from "./locales/hi/profile.json";
import hiRadar from "./locales/hi/radar.json";
import hiRegistration from "./locales/hi/registration.json";
import hiRenewal from "./locales/hi/renewal.json";
import hiStandards from "./locales/hi/standards.json";
import hiTesting from "./locales/hi/testing.json";
import hiVault from "./locales/hi/vault.json";
import hiWizard from "./locales/hi/wizard.json";

// The 11 languages below are a curated demo veneer, not full localization:
// each only carries `landing` (nav/hero/trust), `auth`, and `chat`
// (empty-state) namespaces — see the `$comment` disclaimer at the top of
// each locale file. Every other namespace, and every other locale file's
// content, falls back to English via `fallbackLng` below.
import bnAuth from "./locales/bn/auth.json";
import bnChat from "./locales/bn/chat.json";
import bnLanding from "./locales/bn/landing.json";
import taAuth from "./locales/ta/auth.json";
import taChat from "./locales/ta/chat.json";
import taLanding from "./locales/ta/landing.json";
import teAuth from "./locales/te/auth.json";
import teChat from "./locales/te/chat.json";
import teLanding from "./locales/te/landing.json";
import mrAuth from "./locales/mr/auth.json";
import mrChat from "./locales/mr/chat.json";
import mrLanding from "./locales/mr/landing.json";
import guAuth from "./locales/gu/auth.json";
import guChat from "./locales/gu/chat.json";
import guLanding from "./locales/gu/landing.json";
import knAuth from "./locales/kn/auth.json";
import knChat from "./locales/kn/chat.json";
import knLanding from "./locales/kn/landing.json";
import mlAuth from "./locales/ml/auth.json";
import mlChat from "./locales/ml/chat.json";
import mlLanding from "./locales/ml/landing.json";
import paAuth from "./locales/pa/auth.json";
import paChat from "./locales/pa/chat.json";
import paLanding from "./locales/pa/landing.json";
import orAuth from "./locales/or/auth.json";
import orChat from "./locales/or/chat.json";
import orLanding from "./locales/or/landing.json";
import asAuth from "./locales/as/auth.json";
import asChat from "./locales/as/chat.json";
import asLanding from "./locales/as/landing.json";
import urAuth from "./locales/ur/auth.json";
import urChat from "./locales/ur/chat.json";
import urLanding from "./locales/ur/landing.json";

// "en"/"hi" are used verbatim as i18next language codes so a future
// voice-input feature can key off the same convention. The 11 languages
// after "hi" are the demo-veneer set described above — real, functional
// entries in the picker, just narrower in coverage than en/hi.
export const LANGUAGES = [
  "en",
  "hi",
  "bn",
  "ta",
  "te",
  "mr",
  "gu",
  "kn",
  "ml",
  "pa",
  "or",
  "as",
  "ur",
] as const;
export type Language = (typeof LANGUAGES)[number];

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      admin: enAdmin,
      auth: enAuth,
      chat: enChat,
      citation: enCitation,
      classification: enClassification,
      conformity: enConformity,
      conversation: enConversation,
      cortex: enCortex,
      dashboard: enDashboard,
      developers: enDevelopers,
      grievance: enGrievance,
      history: enHistory,
      intel: enIntel,
      jurisdiction: enJurisdiction,
      landing: enLanding,
      legal: enLegal,
      nexus: enNexus,
      notifications: enNotifications,
      payments: enPayments,
      profile: enProfile,
      radar: enRadar,
      registration: enRegistration,
      renewal: enRenewal,
      standards: enStandards,
      testing: enTesting,
      vault: enVault,
      wizard: enWizard,
    },
    hi: {
      admin: hiAdmin,
      auth: hiAuth,
      chat: hiChat,
      citation: hiCitation,
      classification: hiClassification,
      conformity: hiConformity,
      conversation: hiConversation,
      cortex: hiCortex,
      dashboard: hiDashboard,
      developers: hiDevelopers,
      grievance: hiGrievance,
      history: hiHistory,
      intel: hiIntel,
      jurisdiction: hiJurisdiction,
      landing: hiLanding,
      legal: hiLegal,
      nexus: hiNexus,
      notifications: hiNotifications,
      payments: hiPayments,
      profile: hiProfile,
      radar: hiRadar,
      registration: hiRegistration,
      renewal: hiRenewal,
      standards: hiStandards,
      testing: hiTesting,
      vault: hiVault,
      wizard: hiWizard,
    },
    bn: { auth: bnAuth, chat: bnChat, landing: bnLanding },
    ta: { auth: taAuth, chat: taChat, landing: taLanding },
    te: { auth: teAuth, chat: teChat, landing: teLanding },
    mr: { auth: mrAuth, chat: mrChat, landing: mrLanding },
    gu: { auth: guAuth, chat: guChat, landing: guLanding },
    kn: { auth: knAuth, chat: knChat, landing: knLanding },
    ml: { auth: mlAuth, chat: mlChat, landing: mlLanding },
    pa: { auth: paAuth, chat: paChat, landing: paLanding },
    or: { auth: orAuth, chat: orChat, landing: orLanding },
    as: { auth: asAuth, chat: asChat, landing: asLanding },
    ur: { auth: urAuth, chat: urChat, landing: urLanding },
  },
  lng: "en",
  fallbackLng: "en",
  ns: [
    "admin",
    "auth",
    "chat",
    "citation",
    "classification",
    "conformity",
    "conversation",
    "cortex",
    "dashboard",
    "developers",
    "grievance",
    "history",
    "intel",
    "jurisdiction",
    "landing",
    "legal",
    "nexus",
    "notifications",
    "payments",
    "profile",
    "radar",
    "registration",
    "renewal",
    "standards",
    "testing",
    "vault",
    "wizard",
  ],
  defaultNS: "chat",
  interpolation: { escapeValue: false },
});

// Kept in sync with the active language so CSS can key off html[lang] —
// see html[lang='hi'] in src/index.css, which swaps --font-sans to the
// Devanagari typeface for the whole document while HI is selected. Also
// drives html[dir], so an RTL language (Urdu today; Kashmiri, Sindhi if they
// arrive) flips the whole document's layout the moment it's selected.
function syncDocumentLanguage(language: string) {
  // Guarded: this module is also evaluated during server rendering, where
  // there is no document — the client picks the attribute up on hydration.
  if (typeof document === "undefined") return;
  document.documentElement.lang = language;
  document.documentElement.dir = isRtlLanguage(language) ? "rtl" : "ltr";
}
i18n.on("languageChanged", syncDocumentLanguage);
syncDocumentLanguage(i18n.language);

export default i18n;
