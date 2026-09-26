import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Generated imports for all languages and namespaces
// ── EN ────────────────────────────────────────────────────────────
import enAdmin from "./locales/en/admin.json";
import enAlerts from "./locales/en/alerts.json";
import enAppeals from "./locales/en/appeals.json";
import enAudits from "./locales/en/audits.json";
import enAuth from "./locales/en/auth.json";
import enBusinessAccount from "./locales/en/businessAccount.json";
import enCalendar from "./locales/en/calendar.json";
import enCertificates from "./locales/en/certificates.json";
import enChain from "./locales/en/chain.json";
import enChat from "./locales/en/chat.json";
import enCitation from "./locales/en/citation.json";
import enClassification from "./locales/en/classification.json";
import enConformity from "./locales/en/conformity.json";
import enConversation from "./locales/en/conversation.json";
import enCorrections from "./locales/en/corrections.json";
import enCortex from "./locales/en/cortex.json";
import enDashboard from "./locales/en/dashboard.json";
import enDevelopers from "./locales/en/developers.json";
import enGrievance from "./locales/en/grievance.json";
import enHistory from "./locales/en/history.json";
import enIntel from "./locales/en/intel.json";
import enInvoices from "./locales/en/invoices.json";
import enJurisdiction from "./locales/en/jurisdiction.json";
import enLaboratory from "./locales/en/laboratory.json";
import enLanding from "./locales/en/landing.json";
import enLegal from "./locales/en/legal.json";
import enLicenseActions from "./locales/en/licenseActions.json";
import enLocations from "./locales/en/locations.json";
import enNexus from "./locales/en/nexus.json";
import enNotifications from "./locales/en/notifications.json";
import enPayments from "./locales/en/payments.json";
import enProfile from "./locales/en/profile.json";
import enRadar from "./locales/en/radar.json";
import enRecalls from "./locales/en/recalls.json";
import enRegistration from "./locales/en/registration.json";
import enRenewal from "./locales/en/renewal.json";
import enRenewals from "./locales/en/renewals.json";
import enRetrievalQuality from "./locales/en/retrievalQuality.json";
import enScheme from "./locales/en/scheme.json";
import enStandards from "./locales/en/standards.json";
import enTesting from "./locales/en/testing.json";
import enVault from "./locales/en/vault.json";
import enVisits from "./locales/en/visits.json";
import enWizard from "./locales/en/wizard.json";

// ── HI ────────────────────────────────────────────────────────────
import hiAdmin from "./locales/hi/admin.json";
import hiAlerts from "./locales/hi/alerts.json";
import hiAppeals from "./locales/hi/appeals.json";
import hiAudits from "./locales/hi/audits.json";
import hiAuth from "./locales/hi/auth.json";
import hiBusinessAccount from "./locales/hi/businessAccount.json";
import hiCalendar from "./locales/hi/calendar.json";
import hiCertificates from "./locales/hi/certificates.json";
import hiChain from "./locales/hi/chain.json";
import hiChat from "./locales/hi/chat.json";
import hiCitation from "./locales/hi/citation.json";
import hiClassification from "./locales/hi/classification.json";
import hiConformity from "./locales/hi/conformity.json";
import hiConversation from "./locales/hi/conversation.json";
import hiCorrections from "./locales/hi/corrections.json";
import hiCortex from "./locales/hi/cortex.json";
import hiDashboard from "./locales/hi/dashboard.json";
import hiDevelopers from "./locales/hi/developers.json";
import hiGrievance from "./locales/hi/grievance.json";
import hiHistory from "./locales/hi/history.json";
import hiIntel from "./locales/hi/intel.json";
import hiInvoices from "./locales/hi/invoices.json";
import hiJurisdiction from "./locales/hi/jurisdiction.json";
import hiLaboratory from "./locales/hi/laboratory.json";
import hiLanding from "./locales/hi/landing.json";
import hiLegal from "./locales/hi/legal.json";
import hiLicenseActions from "./locales/hi/licenseActions.json";
import hiLocations from "./locales/hi/locations.json";
import hiNexus from "./locales/hi/nexus.json";
import hiNotifications from "./locales/hi/notifications.json";
import hiPayments from "./locales/hi/payments.json";
import hiProfile from "./locales/hi/profile.json";
import hiRadar from "./locales/hi/radar.json";
import hiRecalls from "./locales/hi/recalls.json";
import hiRegistration from "./locales/hi/registration.json";
import hiRenewal from "./locales/hi/renewal.json";
import hiRenewals from "./locales/hi/renewals.json";
import hiRetrievalQuality from "./locales/hi/retrievalQuality.json";
import hiScheme from "./locales/hi/scheme.json";
import hiStandards from "./locales/hi/standards.json";
import hiTesting from "./locales/hi/testing.json";
import hiVault from "./locales/hi/vault.json";
import hiVisits from "./locales/hi/visits.json";
import hiWizard from "./locales/hi/wizard.json";

// ── BN ────────────────────────────────────────────────────────────
import bnAdmin from "./locales/bn/admin.json";
import bnAlerts from "./locales/bn/alerts.json";
import bnAppeals from "./locales/bn/appeals.json";
import bnAudits from "./locales/bn/audits.json";
import bnAuth from "./locales/bn/auth.json";
import bnBusinessAccount from "./locales/bn/businessAccount.json";
import bnCalendar from "./locales/bn/calendar.json";
import bnCertificates from "./locales/bn/certificates.json";
import bnChain from "./locales/bn/chain.json";
import bnChat from "./locales/bn/chat.json";
import bnCitation from "./locales/bn/citation.json";
import bnClassification from "./locales/bn/classification.json";
import bnConformity from "./locales/bn/conformity.json";
import bnConversation from "./locales/bn/conversation.json";
import bnCorrections from "./locales/bn/corrections.json";
import bnCortex from "./locales/bn/cortex.json";
import bnDashboard from "./locales/bn/dashboard.json";
import bnDevelopers from "./locales/bn/developers.json";
import bnGrievance from "./locales/bn/grievance.json";
import bnHistory from "./locales/bn/history.json";
import bnIntel from "./locales/bn/intel.json";
import bnInvoices from "./locales/bn/invoices.json";
import bnJurisdiction from "./locales/bn/jurisdiction.json";
import bnLaboratory from "./locales/bn/laboratory.json";
import bnLanding from "./locales/bn/landing.json";
import bnLegal from "./locales/bn/legal.json";
import bnLicenseActions from "./locales/bn/licenseActions.json";
import bnLocations from "./locales/bn/locations.json";
import bnNexus from "./locales/bn/nexus.json";
import bnNotifications from "./locales/bn/notifications.json";
import bnPayments from "./locales/bn/payments.json";
import bnProfile from "./locales/bn/profile.json";
import bnRadar from "./locales/bn/radar.json";
import bnRecalls from "./locales/bn/recalls.json";
import bnRegistration from "./locales/bn/registration.json";
import bnRenewal from "./locales/bn/renewal.json";
import bnRenewals from "./locales/bn/renewals.json";
import bnRetrievalQuality from "./locales/bn/retrievalQuality.json";
import bnScheme from "./locales/bn/scheme.json";
import bnStandards from "./locales/bn/standards.json";
import bnTesting from "./locales/bn/testing.json";
import bnVault from "./locales/bn/vault.json";
import bnVisits from "./locales/bn/visits.json";
import bnWizard from "./locales/bn/wizard.json";

// ── TA ────────────────────────────────────────────────────────────
import taAdmin from "./locales/ta/admin.json";
import taAlerts from "./locales/ta/alerts.json";
import taAppeals from "./locales/ta/appeals.json";
import taAudits from "./locales/ta/audits.json";
import taAuth from "./locales/ta/auth.json";
import taBusinessAccount from "./locales/ta/businessAccount.json";
import taCalendar from "./locales/ta/calendar.json";
import taCertificates from "./locales/ta/certificates.json";
import taChain from "./locales/ta/chain.json";
import taChat from "./locales/ta/chat.json";
import taCitation from "./locales/ta/citation.json";
import taClassification from "./locales/ta/classification.json";
import taConformity from "./locales/ta/conformity.json";
import taConversation from "./locales/ta/conversation.json";
import taCorrections from "./locales/ta/corrections.json";
import taCortex from "./locales/ta/cortex.json";
import taDashboard from "./locales/ta/dashboard.json";
import taDevelopers from "./locales/ta/developers.json";
import taGrievance from "./locales/ta/grievance.json";
import taHistory from "./locales/ta/history.json";
import taIntel from "./locales/ta/intel.json";
import taInvoices from "./locales/ta/invoices.json";
import taJurisdiction from "./locales/ta/jurisdiction.json";
import taLaboratory from "./locales/ta/laboratory.json";
import taLanding from "./locales/ta/landing.json";
import taLegal from "./locales/ta/legal.json";
import taLicenseActions from "./locales/ta/licenseActions.json";
import taLocations from "./locales/ta/locations.json";
import taNexus from "./locales/ta/nexus.json";
import taNotifications from "./locales/ta/notifications.json";
import taPayments from "./locales/ta/payments.json";
import taProfile from "./locales/ta/profile.json";
import taRadar from "./locales/ta/radar.json";
import taRecalls from "./locales/ta/recalls.json";
import taRegistration from "./locales/ta/registration.json";
import taRenewal from "./locales/ta/renewal.json";
import taRenewals from "./locales/ta/renewals.json";
import taRetrievalQuality from "./locales/ta/retrievalQuality.json";
import taScheme from "./locales/ta/scheme.json";
import taStandards from "./locales/ta/standards.json";
import taTesting from "./locales/ta/testing.json";
import taVault from "./locales/ta/vault.json";
import taVisits from "./locales/ta/visits.json";
import taWizard from "./locales/ta/wizard.json";

// ── TE ────────────────────────────────────────────────────────────
import teAdmin from "./locales/te/admin.json";
import teAlerts from "./locales/te/alerts.json";
import teAppeals from "./locales/te/appeals.json";
import teAudits from "./locales/te/audits.json";
import teAuth from "./locales/te/auth.json";
import teBusinessAccount from "./locales/te/businessAccount.json";
import teCalendar from "./locales/te/calendar.json";
import teCertificates from "./locales/te/certificates.json";
import teChain from "./locales/te/chain.json";
import teChat from "./locales/te/chat.json";
import teCitation from "./locales/te/citation.json";
import teClassification from "./locales/te/classification.json";
import teConformity from "./locales/te/conformity.json";
import teConversation from "./locales/te/conversation.json";
import teCorrections from "./locales/te/corrections.json";
import teCortex from "./locales/te/cortex.json";
import teDashboard from "./locales/te/dashboard.json";
import teDevelopers from "./locales/te/developers.json";
import teGrievance from "./locales/te/grievance.json";
import teHistory from "./locales/te/history.json";
import teIntel from "./locales/te/intel.json";
import teInvoices from "./locales/te/invoices.json";
import teJurisdiction from "./locales/te/jurisdiction.json";
import teLaboratory from "./locales/te/laboratory.json";
import teLanding from "./locales/te/landing.json";
import teLegal from "./locales/te/legal.json";
import teLicenseActions from "./locales/te/licenseActions.json";
import teLocations from "./locales/te/locations.json";
import teNexus from "./locales/te/nexus.json";
import teNotifications from "./locales/te/notifications.json";
import tePayments from "./locales/te/payments.json";
import teProfile from "./locales/te/profile.json";
import teRadar from "./locales/te/radar.json";
import teRecalls from "./locales/te/recalls.json";
import teRegistration from "./locales/te/registration.json";
import teRenewal from "./locales/te/renewal.json";
import teRenewals from "./locales/te/renewals.json";
import teRetrievalQuality from "./locales/te/retrievalQuality.json";
import teScheme from "./locales/te/scheme.json";
import teStandards from "./locales/te/standards.json";
import teTesting from "./locales/te/testing.json";
import teVault from "./locales/te/vault.json";
import teVisits from "./locales/te/visits.json";
import teWizard from "./locales/te/wizard.json";

// ── MR ────────────────────────────────────────────────────────────
import mrAdmin from "./locales/mr/admin.json";
import mrAlerts from "./locales/mr/alerts.json";
import mrAppeals from "./locales/mr/appeals.json";
import mrAudits from "./locales/mr/audits.json";
import mrAuth from "./locales/mr/auth.json";
import mrBusinessAccount from "./locales/mr/businessAccount.json";
import mrCalendar from "./locales/mr/calendar.json";
import mrCertificates from "./locales/mr/certificates.json";
import mrChain from "./locales/mr/chain.json";
import mrChat from "./locales/mr/chat.json";
import mrCitation from "./locales/mr/citation.json";
import mrClassification from "./locales/mr/classification.json";
import mrConformity from "./locales/mr/conformity.json";
import mrConversation from "./locales/mr/conversation.json";
import mrCorrections from "./locales/mr/corrections.json";
import mrCortex from "./locales/mr/cortex.json";
import mrDashboard from "./locales/mr/dashboard.json";
import mrDevelopers from "./locales/mr/developers.json";
import mrGrievance from "./locales/mr/grievance.json";
import mrHistory from "./locales/mr/history.json";
import mrIntel from "./locales/mr/intel.json";
import mrInvoices from "./locales/mr/invoices.json";
import mrJurisdiction from "./locales/mr/jurisdiction.json";
import mrLaboratory from "./locales/mr/laboratory.json";
import mrLanding from "./locales/mr/landing.json";
import mrLegal from "./locales/mr/legal.json";
import mrLicenseActions from "./locales/mr/licenseActions.json";
import mrLocations from "./locales/mr/locations.json";
import mrNexus from "./locales/mr/nexus.json";
import mrNotifications from "./locales/mr/notifications.json";
import mrPayments from "./locales/mr/payments.json";
import mrProfile from "./locales/mr/profile.json";
import mrRadar from "./locales/mr/radar.json";
import mrRecalls from "./locales/mr/recalls.json";
import mrRegistration from "./locales/mr/registration.json";
import mrRenewal from "./locales/mr/renewal.json";
import mrRenewals from "./locales/mr/renewals.json";
import mrRetrievalQuality from "./locales/mr/retrievalQuality.json";
import mrScheme from "./locales/mr/scheme.json";
import mrStandards from "./locales/mr/standards.json";
import mrTesting from "./locales/mr/testing.json";
import mrVault from "./locales/mr/vault.json";
import mrVisits from "./locales/mr/visits.json";
import mrWizard from "./locales/mr/wizard.json";

// ── GU ────────────────────────────────────────────────────────────
import guAdmin from "./locales/gu/admin.json";
import guAlerts from "./locales/gu/alerts.json";
import guAppeals from "./locales/gu/appeals.json";
import guAudits from "./locales/gu/audits.json";
import guAuth from "./locales/gu/auth.json";
import guBusinessAccount from "./locales/gu/businessAccount.json";
import guCalendar from "./locales/gu/calendar.json";
import guCertificates from "./locales/gu/certificates.json";
import guChain from "./locales/gu/chain.json";
import guChat from "./locales/gu/chat.json";
import guCitation from "./locales/gu/citation.json";
import guClassification from "./locales/gu/classification.json";
import guConformity from "./locales/gu/conformity.json";
import guConversation from "./locales/gu/conversation.json";
import guCorrections from "./locales/gu/corrections.json";
import guCortex from "./locales/gu/cortex.json";
import guDashboard from "./locales/gu/dashboard.json";
import guDevelopers from "./locales/gu/developers.json";
import guGrievance from "./locales/gu/grievance.json";
import guHistory from "./locales/gu/history.json";
import guIntel from "./locales/gu/intel.json";
import guInvoices from "./locales/gu/invoices.json";
import guJurisdiction from "./locales/gu/jurisdiction.json";
import guLaboratory from "./locales/gu/laboratory.json";
import guLanding from "./locales/gu/landing.json";
import guLegal from "./locales/gu/legal.json";
import guLicenseActions from "./locales/gu/licenseActions.json";
import guLocations from "./locales/gu/locations.json";
import guNexus from "./locales/gu/nexus.json";
import guNotifications from "./locales/gu/notifications.json";
import guPayments from "./locales/gu/payments.json";
import guProfile from "./locales/gu/profile.json";
import guRadar from "./locales/gu/radar.json";
import guRecalls from "./locales/gu/recalls.json";
import guRegistration from "./locales/gu/registration.json";
import guRenewal from "./locales/gu/renewal.json";
import guRenewals from "./locales/gu/renewals.json";
import guRetrievalQuality from "./locales/gu/retrievalQuality.json";
import guScheme from "./locales/gu/scheme.json";
import guStandards from "./locales/gu/standards.json";
import guTesting from "./locales/gu/testing.json";
import guVault from "./locales/gu/vault.json";
import guVisits from "./locales/gu/visits.json";
import guWizard from "./locales/gu/wizard.json";

// ── KN ────────────────────────────────────────────────────────────
import knAdmin from "./locales/kn/admin.json";
import knAlerts from "./locales/kn/alerts.json";
import knAppeals from "./locales/kn/appeals.json";
import knAudits from "./locales/kn/audits.json";
import knAuth from "./locales/kn/auth.json";
import knBusinessAccount from "./locales/kn/businessAccount.json";
import knCalendar from "./locales/kn/calendar.json";
import knCertificates from "./locales/kn/certificates.json";
import knChain from "./locales/kn/chain.json";
import knChat from "./locales/kn/chat.json";
import knCitation from "./locales/kn/citation.json";
import knClassification from "./locales/kn/classification.json";
import knConformity from "./locales/kn/conformity.json";
import knConversation from "./locales/kn/conversation.json";
import knCorrections from "./locales/kn/corrections.json";
import knCortex from "./locales/kn/cortex.json";
import knDashboard from "./locales/kn/dashboard.json";
import knDevelopers from "./locales/kn/developers.json";
import knGrievance from "./locales/kn/grievance.json";
import knHistory from "./locales/kn/history.json";
import knIntel from "./locales/kn/intel.json";
import knInvoices from "./locales/kn/invoices.json";
import knJurisdiction from "./locales/kn/jurisdiction.json";
import knLaboratory from "./locales/kn/laboratory.json";
import knLanding from "./locales/kn/landing.json";
import knLegal from "./locales/kn/legal.json";
import knLicenseActions from "./locales/kn/licenseActions.json";
import knLocations from "./locales/kn/locations.json";
import knNexus from "./locales/kn/nexus.json";
import knNotifications from "./locales/kn/notifications.json";
import knPayments from "./locales/kn/payments.json";
import knProfile from "./locales/kn/profile.json";
import knRadar from "./locales/kn/radar.json";
import knRecalls from "./locales/kn/recalls.json";
import knRegistration from "./locales/kn/registration.json";
import knRenewal from "./locales/kn/renewal.json";
import knRenewals from "./locales/kn/renewals.json";
import knRetrievalQuality from "./locales/kn/retrievalQuality.json";
import knScheme from "./locales/kn/scheme.json";
import knStandards from "./locales/kn/standards.json";
import knTesting from "./locales/kn/testing.json";
import knVault from "./locales/kn/vault.json";
import knVisits from "./locales/kn/visits.json";
import knWizard from "./locales/kn/wizard.json";

// ── ML ────────────────────────────────────────────────────────────
import mlAdmin from "./locales/ml/admin.json";
import mlAlerts from "./locales/ml/alerts.json";
import mlAppeals from "./locales/ml/appeals.json";
import mlAudits from "./locales/ml/audits.json";
import mlAuth from "./locales/ml/auth.json";
import mlBusinessAccount from "./locales/ml/businessAccount.json";
import mlCalendar from "./locales/ml/calendar.json";
import mlCertificates from "./locales/ml/certificates.json";
import mlChain from "./locales/ml/chain.json";
import mlChat from "./locales/ml/chat.json";
import mlCitation from "./locales/ml/citation.json";
import mlClassification from "./locales/ml/classification.json";
import mlConformity from "./locales/ml/conformity.json";
import mlConversation from "./locales/ml/conversation.json";
import mlCorrections from "./locales/ml/corrections.json";
import mlCortex from "./locales/ml/cortex.json";
import mlDashboard from "./locales/ml/dashboard.json";
import mlDevelopers from "./locales/ml/developers.json";
import mlGrievance from "./locales/ml/grievance.json";
import mlHistory from "./locales/ml/history.json";
import mlIntel from "./locales/ml/intel.json";
import mlInvoices from "./locales/ml/invoices.json";
import mlJurisdiction from "./locales/ml/jurisdiction.json";
import mlLaboratory from "./locales/ml/laboratory.json";
import mlLanding from "./locales/ml/landing.json";
import mlLegal from "./locales/ml/legal.json";
import mlLicenseActions from "./locales/ml/licenseActions.json";
import mlLocations from "./locales/ml/locations.json";
import mlNexus from "./locales/ml/nexus.json";
import mlNotifications from "./locales/ml/notifications.json";
import mlPayments from "./locales/ml/payments.json";
import mlProfile from "./locales/ml/profile.json";
import mlRadar from "./locales/ml/radar.json";
import mlRecalls from "./locales/ml/recalls.json";
import mlRegistration from "./locales/ml/registration.json";
import mlRenewal from "./locales/ml/renewal.json";
import mlRenewals from "./locales/ml/renewals.json";
import mlRetrievalQuality from "./locales/ml/retrievalQuality.json";
import mlScheme from "./locales/ml/scheme.json";
import mlStandards from "./locales/ml/standards.json";
import mlTesting from "./locales/ml/testing.json";
import mlVault from "./locales/ml/vault.json";
import mlVisits from "./locales/ml/visits.json";
import mlWizard from "./locales/ml/wizard.json";

// ── PA ────────────────────────────────────────────────────────────
import paAdmin from "./locales/pa/admin.json";
import paAlerts from "./locales/pa/alerts.json";
import paAppeals from "./locales/pa/appeals.json";
import paAudits from "./locales/pa/audits.json";
import paAuth from "./locales/pa/auth.json";
import paBusinessAccount from "./locales/pa/businessAccount.json";
import paCalendar from "./locales/pa/calendar.json";
import paCertificates from "./locales/pa/certificates.json";
import paChain from "./locales/pa/chain.json";
import paChat from "./locales/pa/chat.json";
import paCitation from "./locales/pa/citation.json";
import paClassification from "./locales/pa/classification.json";
import paConformity from "./locales/pa/conformity.json";
import paConversation from "./locales/pa/conversation.json";
import paCorrections from "./locales/pa/corrections.json";
import paCortex from "./locales/pa/cortex.json";
import paDashboard from "./locales/pa/dashboard.json";
import paDevelopers from "./locales/pa/developers.json";
import paGrievance from "./locales/pa/grievance.json";
import paHistory from "./locales/pa/history.json";
import paIntel from "./locales/pa/intel.json";
import paInvoices from "./locales/pa/invoices.json";
import paJurisdiction from "./locales/pa/jurisdiction.json";
import paLaboratory from "./locales/pa/laboratory.json";
import paLanding from "./locales/pa/landing.json";
import paLegal from "./locales/pa/legal.json";
import paLicenseActions from "./locales/pa/licenseActions.json";
import paLocations from "./locales/pa/locations.json";
import paNexus from "./locales/pa/nexus.json";
import paNotifications from "./locales/pa/notifications.json";
import paPayments from "./locales/pa/payments.json";
import paProfile from "./locales/pa/profile.json";
import paRadar from "./locales/pa/radar.json";
import paRecalls from "./locales/pa/recalls.json";
import paRegistration from "./locales/pa/registration.json";
import paRenewal from "./locales/pa/renewal.json";
import paRenewals from "./locales/pa/renewals.json";
import paRetrievalQuality from "./locales/pa/retrievalQuality.json";
import paScheme from "./locales/pa/scheme.json";
import paStandards from "./locales/pa/standards.json";
import paTesting from "./locales/pa/testing.json";
import paVault from "./locales/pa/vault.json";
import paVisits from "./locales/pa/visits.json";
import paWizard from "./locales/pa/wizard.json";

// ── OR ────────────────────────────────────────────────────────────
import orAdmin from "./locales/or/admin.json";
import orAlerts from "./locales/or/alerts.json";
import orAppeals from "./locales/or/appeals.json";
import orAudits from "./locales/or/audits.json";
import orAuth from "./locales/or/auth.json";
import orBusinessAccount from "./locales/or/businessAccount.json";
import orCalendar from "./locales/or/calendar.json";
import orCertificates from "./locales/or/certificates.json";
import orChain from "./locales/or/chain.json";
import orChat from "./locales/or/chat.json";
import orCitation from "./locales/or/citation.json";
import orClassification from "./locales/or/classification.json";
import orConformity from "./locales/or/conformity.json";
import orConversation from "./locales/or/conversation.json";
import orCorrections from "./locales/or/corrections.json";
import orCortex from "./locales/or/cortex.json";
import orDashboard from "./locales/or/dashboard.json";
import orDevelopers from "./locales/or/developers.json";
import orGrievance from "./locales/or/grievance.json";
import orHistory from "./locales/or/history.json";
import orIntel from "./locales/or/intel.json";
import orInvoices from "./locales/or/invoices.json";
import orJurisdiction from "./locales/or/jurisdiction.json";
import orLaboratory from "./locales/or/laboratory.json";
import orLanding from "./locales/or/landing.json";
import orLegal from "./locales/or/legal.json";
import orLicenseActions from "./locales/or/licenseActions.json";
import orLocations from "./locales/or/locations.json";
import orNexus from "./locales/or/nexus.json";
import orNotifications from "./locales/or/notifications.json";
import orPayments from "./locales/or/payments.json";
import orProfile from "./locales/or/profile.json";
import orRadar from "./locales/or/radar.json";
import orRecalls from "./locales/or/recalls.json";
import orRegistration from "./locales/or/registration.json";
import orRenewal from "./locales/or/renewal.json";
import orRenewals from "./locales/or/renewals.json";
import orRetrievalQuality from "./locales/or/retrievalQuality.json";
import orScheme from "./locales/or/scheme.json";
import orStandards from "./locales/or/standards.json";
import orTesting from "./locales/or/testing.json";
import orVault from "./locales/or/vault.json";
import orVisits from "./locales/or/visits.json";
import orWizard from "./locales/or/wizard.json";

// ── AS ────────────────────────────────────────────────────────────
import asAdmin from "./locales/as/admin.json";
import asAlerts from "./locales/as/alerts.json";
import asAppeals from "./locales/as/appeals.json";
import asAudits from "./locales/as/audits.json";
import asAuth from "./locales/as/auth.json";
import asBusinessAccount from "./locales/as/businessAccount.json";
import asCalendar from "./locales/as/calendar.json";
import asCertificates from "./locales/as/certificates.json";
import asChain from "./locales/as/chain.json";
import asChat from "./locales/as/chat.json";
import asCitation from "./locales/as/citation.json";
import asClassification from "./locales/as/classification.json";
import asConformity from "./locales/as/conformity.json";
import asConversation from "./locales/as/conversation.json";
import asCorrections from "./locales/as/corrections.json";
import asCortex from "./locales/as/cortex.json";
import asDashboard from "./locales/as/dashboard.json";
import asDevelopers from "./locales/as/developers.json";
import asGrievance from "./locales/as/grievance.json";
import asHistory from "./locales/as/history.json";
import asIntel from "./locales/as/intel.json";
import asInvoices from "./locales/as/invoices.json";
import asJurisdiction from "./locales/as/jurisdiction.json";
import asLaboratory from "./locales/as/laboratory.json";
import asLanding from "./locales/as/landing.json";
import asLegal from "./locales/as/legal.json";
import asLicenseActions from "./locales/as/licenseActions.json";
import asLocations from "./locales/as/locations.json";
import asNexus from "./locales/as/nexus.json";
import asNotifications from "./locales/as/notifications.json";
import asPayments from "./locales/as/payments.json";
import asProfile from "./locales/as/profile.json";
import asRadar from "./locales/as/radar.json";
import asRecalls from "./locales/as/recalls.json";
import asRegistration from "./locales/as/registration.json";
import asRenewal from "./locales/as/renewal.json";
import asRenewals from "./locales/as/renewals.json";
import asRetrievalQuality from "./locales/as/retrievalQuality.json";
import asScheme from "./locales/as/scheme.json";
import asStandards from "./locales/as/standards.json";
import asTesting from "./locales/as/testing.json";
import asVault from "./locales/as/vault.json";
import asVisits from "./locales/as/visits.json";
import asWizard from "./locales/as/wizard.json";

// ── UR ────────────────────────────────────────────────────────────
import urAdmin from "./locales/ur/admin.json";
import urAlerts from "./locales/ur/alerts.json";
import urAppeals from "./locales/ur/appeals.json";
import urAudits from "./locales/ur/audits.json";
import urAuth from "./locales/ur/auth.json";
import urBusinessAccount from "./locales/ur/businessAccount.json";
import urCalendar from "./locales/ur/calendar.json";
import urCertificates from "./locales/ur/certificates.json";
import urChain from "./locales/ur/chain.json";
import urChat from "./locales/ur/chat.json";
import urCitation from "./locales/ur/citation.json";
import urClassification from "./locales/ur/classification.json";
import urConformity from "./locales/ur/conformity.json";
import urConversation from "./locales/ur/conversation.json";
import urCorrections from "./locales/ur/corrections.json";
import urCortex from "./locales/ur/cortex.json";
import urDashboard from "./locales/ur/dashboard.json";
import urDevelopers from "./locales/ur/developers.json";
import urGrievance from "./locales/ur/grievance.json";
import urHistory from "./locales/ur/history.json";
import urIntel from "./locales/ur/intel.json";
import urInvoices from "./locales/ur/invoices.json";
import urJurisdiction from "./locales/ur/jurisdiction.json";
import urLaboratory from "./locales/ur/laboratory.json";
import urLanding from "./locales/ur/landing.json";
import urLegal from "./locales/ur/legal.json";
import urLicenseActions from "./locales/ur/licenseActions.json";
import urLocations from "./locales/ur/locations.json";
import urNexus from "./locales/ur/nexus.json";
import urNotifications from "./locales/ur/notifications.json";
import urPayments from "./locales/ur/payments.json";
import urProfile from "./locales/ur/profile.json";
import urRadar from "./locales/ur/radar.json";
import urRecalls from "./locales/ur/recalls.json";
import urRegistration from "./locales/ur/registration.json";
import urRenewal from "./locales/ur/renewal.json";
import urRenewals from "./locales/ur/renewals.json";
import urRetrievalQuality from "./locales/ur/retrievalQuality.json";
import urScheme from "./locales/ur/scheme.json";
import urStandards from "./locales/ur/standards.json";
import urTesting from "./locales/ur/testing.json";
import urVault from "./locales/ur/vault.json";
import urVisits from "./locales/ur/visits.json";
import urWizard from "./locales/ur/wizard.json";

// ── SA ────────────────────────────────────────────────────────────
import saAdmin from "./locales/sa/admin.json";
import saAlerts from "./locales/sa/alerts.json";
import saAppeals from "./locales/sa/appeals.json";
import saAudits from "./locales/sa/audits.json";
import saAuth from "./locales/sa/auth.json";
import saBusinessAccount from "./locales/sa/businessAccount.json";
import saCalendar from "./locales/sa/calendar.json";
import saCertificates from "./locales/sa/certificates.json";
import saChain from "./locales/sa/chain.json";
import saChat from "./locales/sa/chat.json";
import saCitation from "./locales/sa/citation.json";
import saClassification from "./locales/sa/classification.json";
import saConformity from "./locales/sa/conformity.json";
import saConversation from "./locales/sa/conversation.json";
import saCorrections from "./locales/sa/corrections.json";
import saCortex from "./locales/sa/cortex.json";
import saDashboard from "./locales/sa/dashboard.json";
import saDevelopers from "./locales/sa/developers.json";
import saGrievance from "./locales/sa/grievance.json";
import saHistory from "./locales/sa/history.json";
import saIntel from "./locales/sa/intel.json";
import saInvoices from "./locales/sa/invoices.json";
import saJurisdiction from "./locales/sa/jurisdiction.json";
import saLaboratory from "./locales/sa/laboratory.json";
import saLanding from "./locales/sa/landing.json";
import saLegal from "./locales/sa/legal.json";
import saLicenseActions from "./locales/sa/licenseActions.json";
import saLocations from "./locales/sa/locations.json";
import saNexus from "./locales/sa/nexus.json";
import saNotifications from "./locales/sa/notifications.json";
import saPayments from "./locales/sa/payments.json";
import saProfile from "./locales/sa/profile.json";
import saRadar from "./locales/sa/radar.json";
import saRecalls from "./locales/sa/recalls.json";
import saRegistration from "./locales/sa/registration.json";
import saRenewal from "./locales/sa/renewal.json";
import saRenewals from "./locales/sa/renewals.json";
import saRetrievalQuality from "./locales/sa/retrievalQuality.json";
import saScheme from "./locales/sa/scheme.json";
import saStandards from "./locales/sa/standards.json";
import saTesting from "./locales/sa/testing.json";
import saVault from "./locales/sa/vault.json";
import saVisits from "./locales/sa/visits.json";
import saWizard from "./locales/sa/wizard.json";

// ── NE ────────────────────────────────────────────────────────────
import neAdmin from "./locales/ne/admin.json";
import neAlerts from "./locales/ne/alerts.json";
import neAppeals from "./locales/ne/appeals.json";
import neAudits from "./locales/ne/audits.json";
import neAuth from "./locales/ne/auth.json";
import neBusinessAccount from "./locales/ne/businessAccount.json";
import neCalendar from "./locales/ne/calendar.json";
import neCertificates from "./locales/ne/certificates.json";
import neChain from "./locales/ne/chain.json";
import neChat from "./locales/ne/chat.json";
import neCitation from "./locales/ne/citation.json";
import neClassification from "./locales/ne/classification.json";
import neConformity from "./locales/ne/conformity.json";
import neConversation from "./locales/ne/conversation.json";
import neCorrections from "./locales/ne/corrections.json";
import neCortex from "./locales/ne/cortex.json";
import neDashboard from "./locales/ne/dashboard.json";
import neDevelopers from "./locales/ne/developers.json";
import neGrievance from "./locales/ne/grievance.json";
import neHistory from "./locales/ne/history.json";
import neIntel from "./locales/ne/intel.json";
import neInvoices from "./locales/ne/invoices.json";
import neJurisdiction from "./locales/ne/jurisdiction.json";
import neLaboratory from "./locales/ne/laboratory.json";
import neLanding from "./locales/ne/landing.json";
import neLegal from "./locales/ne/legal.json";
import neLicenseActions from "./locales/ne/licenseActions.json";
import neLocations from "./locales/ne/locations.json";
import neNexus from "./locales/ne/nexus.json";
import neNotifications from "./locales/ne/notifications.json";
import nePayments from "./locales/ne/payments.json";
import neProfile from "./locales/ne/profile.json";
import neRadar from "./locales/ne/radar.json";
import neRecalls from "./locales/ne/recalls.json";
import neRegistration from "./locales/ne/registration.json";
import neRenewal from "./locales/ne/renewal.json";
import neRenewals from "./locales/ne/renewals.json";
import neRetrievalQuality from "./locales/ne/retrievalQuality.json";
import neScheme from "./locales/ne/scheme.json";
import neStandards from "./locales/ne/standards.json";
import neTesting from "./locales/ne/testing.json";
import neVault from "./locales/ne/vault.json";
import neVisits from "./locales/ne/visits.json";
import neWizard from "./locales/ne/wizard.json";

// ── KS ────────────────────────────────────────────────────────────
import ksAdmin from "./locales/ks/admin.json";
import ksAlerts from "./locales/ks/alerts.json";
import ksAppeals from "./locales/ks/appeals.json";
import ksAudits from "./locales/ks/audits.json";
import ksAuth from "./locales/ks/auth.json";
import ksBusinessAccount from "./locales/ks/businessAccount.json";
import ksCalendar from "./locales/ks/calendar.json";
import ksCertificates from "./locales/ks/certificates.json";
import ksChain from "./locales/ks/chain.json";
import ksChat from "./locales/ks/chat.json";
import ksCitation from "./locales/ks/citation.json";
import ksClassification from "./locales/ks/classification.json";
import ksConformity from "./locales/ks/conformity.json";
import ksConversation from "./locales/ks/conversation.json";
import ksCorrections from "./locales/ks/corrections.json";
import ksCortex from "./locales/ks/cortex.json";
import ksDashboard from "./locales/ks/dashboard.json";
import ksDevelopers from "./locales/ks/developers.json";
import ksGrievance from "./locales/ks/grievance.json";
import ksHistory from "./locales/ks/history.json";
import ksIntel from "./locales/ks/intel.json";
import ksInvoices from "./locales/ks/invoices.json";
import ksJurisdiction from "./locales/ks/jurisdiction.json";
import ksLaboratory from "./locales/ks/laboratory.json";
import ksLanding from "./locales/ks/landing.json";
import ksLegal from "./locales/ks/legal.json";
import ksLicenseActions from "./locales/ks/licenseActions.json";
import ksLocations from "./locales/ks/locations.json";
import ksNexus from "./locales/ks/nexus.json";
import ksNotifications from "./locales/ks/notifications.json";
import ksPayments from "./locales/ks/payments.json";
import ksProfile from "./locales/ks/profile.json";
import ksRadar from "./locales/ks/radar.json";
import ksRecalls from "./locales/ks/recalls.json";
import ksRegistration from "./locales/ks/registration.json";
import ksRenewal from "./locales/ks/renewal.json";
import ksRenewals from "./locales/ks/renewals.json";
import ksRetrievalQuality from "./locales/ks/retrievalQuality.json";
import ksScheme from "./locales/ks/scheme.json";
import ksStandards from "./locales/ks/standards.json";
import ksTesting from "./locales/ks/testing.json";
import ksVault from "./locales/ks/vault.json";
import ksVisits from "./locales/ks/visits.json";
import ksWizard from "./locales/ks/wizard.json";

// ── KOK ────────────────────────────────────────────────────────────
import kokAdmin from "./locales/kok/admin.json";
import kokAlerts from "./locales/kok/alerts.json";
import kokAppeals from "./locales/kok/appeals.json";
import kokAudits from "./locales/kok/audits.json";
import kokAuth from "./locales/kok/auth.json";
import kokBusinessAccount from "./locales/kok/businessAccount.json";
import kokCalendar from "./locales/kok/calendar.json";
import kokCertificates from "./locales/kok/certificates.json";
import kokChain from "./locales/kok/chain.json";
import kokChat from "./locales/kok/chat.json";
import kokCitation from "./locales/kok/citation.json";
import kokClassification from "./locales/kok/classification.json";
import kokConformity from "./locales/kok/conformity.json";
import kokConversation from "./locales/kok/conversation.json";
import kokCorrections from "./locales/kok/corrections.json";
import kokCortex from "./locales/kok/cortex.json";
import kokDashboard from "./locales/kok/dashboard.json";
import kokDevelopers from "./locales/kok/developers.json";
import kokGrievance from "./locales/kok/grievance.json";
import kokHistory from "./locales/kok/history.json";
import kokIntel from "./locales/kok/intel.json";
import kokInvoices from "./locales/kok/invoices.json";
import kokJurisdiction from "./locales/kok/jurisdiction.json";
import kokLaboratory from "./locales/kok/laboratory.json";
import kokLanding from "./locales/kok/landing.json";
import kokLegal from "./locales/kok/legal.json";
import kokLicenseActions from "./locales/kok/licenseActions.json";
import kokLocations from "./locales/kok/locations.json";
import kokNexus from "./locales/kok/nexus.json";
import kokNotifications from "./locales/kok/notifications.json";
import kokPayments from "./locales/kok/payments.json";
import kokProfile from "./locales/kok/profile.json";
import kokRadar from "./locales/kok/radar.json";
import kokRecalls from "./locales/kok/recalls.json";
import kokRegistration from "./locales/kok/registration.json";
import kokRenewal from "./locales/kok/renewal.json";
import kokRenewals from "./locales/kok/renewals.json";
import kokRetrievalQuality from "./locales/kok/retrievalQuality.json";
import kokScheme from "./locales/kok/scheme.json";
import kokStandards from "./locales/kok/standards.json";
import kokTesting from "./locales/kok/testing.json";
import kokVault from "./locales/kok/vault.json";
import kokVisits from "./locales/kok/visits.json";
import kokWizard from "./locales/kok/wizard.json";

// ── MNI ────────────────────────────────────────────────────────────
import mniAdmin from "./locales/mni/admin.json";
import mniAlerts from "./locales/mni/alerts.json";
import mniAppeals from "./locales/mni/appeals.json";
import mniAudits from "./locales/mni/audits.json";
import mniAuth from "./locales/mni/auth.json";
import mniBusinessAccount from "./locales/mni/businessAccount.json";
import mniCalendar from "./locales/mni/calendar.json";
import mniCertificates from "./locales/mni/certificates.json";
import mniChain from "./locales/mni/chain.json";
import mniChat from "./locales/mni/chat.json";
import mniCitation from "./locales/mni/citation.json";
import mniClassification from "./locales/mni/classification.json";
import mniConformity from "./locales/mni/conformity.json";
import mniConversation from "./locales/mni/conversation.json";
import mniCorrections from "./locales/mni/corrections.json";
import mniCortex from "./locales/mni/cortex.json";
import mniDashboard from "./locales/mni/dashboard.json";
import mniDevelopers from "./locales/mni/developers.json";
import mniGrievance from "./locales/mni/grievance.json";
import mniHistory from "./locales/mni/history.json";
import mniIntel from "./locales/mni/intel.json";
import mniInvoices from "./locales/mni/invoices.json";
import mniJurisdiction from "./locales/mni/jurisdiction.json";
import mniLaboratory from "./locales/mni/laboratory.json";
import mniLanding from "./locales/mni/landing.json";
import mniLegal from "./locales/mni/legal.json";
import mniLicenseActions from "./locales/mni/licenseActions.json";
import mniLocations from "./locales/mni/locations.json";
import mniNexus from "./locales/mni/nexus.json";
import mniNotifications from "./locales/mni/notifications.json";
import mniPayments from "./locales/mni/payments.json";
import mniProfile from "./locales/mni/profile.json";
import mniRadar from "./locales/mni/radar.json";
import mniRecalls from "./locales/mni/recalls.json";
import mniRegistration from "./locales/mni/registration.json";
import mniRenewal from "./locales/mni/renewal.json";
import mniRenewals from "./locales/mni/renewals.json";
import mniRetrievalQuality from "./locales/mni/retrievalQuality.json";
import mniScheme from "./locales/mni/scheme.json";
import mniStandards from "./locales/mni/standards.json";
import mniTesting from "./locales/mni/testing.json";
import mniVault from "./locales/mni/vault.json";
import mniVisits from "./locales/mni/visits.json";
import mniWizard from "./locales/mni/wizard.json";

// ── BRX ────────────────────────────────────────────────────────────
import brxAdmin from "./locales/brx/admin.json";
import brxAlerts from "./locales/brx/alerts.json";
import brxAppeals from "./locales/brx/appeals.json";
import brxAudits from "./locales/brx/audits.json";
import brxAuth from "./locales/brx/auth.json";
import brxBusinessAccount from "./locales/brx/businessAccount.json";
import brxCalendar from "./locales/brx/calendar.json";
import brxCertificates from "./locales/brx/certificates.json";
import brxChain from "./locales/brx/chain.json";
import brxChat from "./locales/brx/chat.json";
import brxCitation from "./locales/brx/citation.json";
import brxClassification from "./locales/brx/classification.json";
import brxConformity from "./locales/brx/conformity.json";
import brxConversation from "./locales/brx/conversation.json";
import brxCorrections from "./locales/brx/corrections.json";
import brxCortex from "./locales/brx/cortex.json";
import brxDashboard from "./locales/brx/dashboard.json";
import brxDevelopers from "./locales/brx/developers.json";
import brxGrievance from "./locales/brx/grievance.json";
import brxHistory from "./locales/brx/history.json";
import brxIntel from "./locales/brx/intel.json";
import brxInvoices from "./locales/brx/invoices.json";
import brxJurisdiction from "./locales/brx/jurisdiction.json";
import brxLaboratory from "./locales/brx/laboratory.json";
import brxLanding from "./locales/brx/landing.json";
import brxLegal from "./locales/brx/legal.json";
import brxLicenseActions from "./locales/brx/licenseActions.json";
import brxLocations from "./locales/brx/locations.json";
import brxNexus from "./locales/brx/nexus.json";
import brxNotifications from "./locales/brx/notifications.json";
import brxPayments from "./locales/brx/payments.json";
import brxProfile from "./locales/brx/profile.json";
import brxRadar from "./locales/brx/radar.json";
import brxRecalls from "./locales/brx/recalls.json";
import brxRegistration from "./locales/brx/registration.json";
import brxRenewal from "./locales/brx/renewal.json";
import brxRenewals from "./locales/brx/renewals.json";
import brxRetrievalQuality from "./locales/brx/retrievalQuality.json";
import brxScheme from "./locales/brx/scheme.json";
import brxStandards from "./locales/brx/standards.json";
import brxTesting from "./locales/brx/testing.json";
import brxVault from "./locales/brx/vault.json";
import brxVisits from "./locales/brx/visits.json";
import brxWizard from "./locales/brx/wizard.json";

// ── DOI ────────────────────────────────────────────────────────────
import doiAdmin from "./locales/doi/admin.json";
import doiAlerts from "./locales/doi/alerts.json";
import doiAppeals from "./locales/doi/appeals.json";
import doiAudits from "./locales/doi/audits.json";
import doiAuth from "./locales/doi/auth.json";
import doiBusinessAccount from "./locales/doi/businessAccount.json";
import doiCalendar from "./locales/doi/calendar.json";
import doiCertificates from "./locales/doi/certificates.json";
import doiChain from "./locales/doi/chain.json";
import doiChat from "./locales/doi/chat.json";
import doiCitation from "./locales/doi/citation.json";
import doiClassification from "./locales/doi/classification.json";
import doiConformity from "./locales/doi/conformity.json";
import doiConversation from "./locales/doi/conversation.json";
import doiCorrections from "./locales/doi/corrections.json";
import doiCortex from "./locales/doi/cortex.json";
import doiDashboard from "./locales/doi/dashboard.json";
import doiDevelopers from "./locales/doi/developers.json";
import doiGrievance from "./locales/doi/grievance.json";
import doiHistory from "./locales/doi/history.json";
import doiIntel from "./locales/doi/intel.json";
import doiInvoices from "./locales/doi/invoices.json";
import doiJurisdiction from "./locales/doi/jurisdiction.json";
import doiLaboratory from "./locales/doi/laboratory.json";
import doiLanding from "./locales/doi/landing.json";
import doiLegal from "./locales/doi/legal.json";
import doiLicenseActions from "./locales/doi/licenseActions.json";
import doiLocations from "./locales/doi/locations.json";
import doiNexus from "./locales/doi/nexus.json";
import doiNotifications from "./locales/doi/notifications.json";
import doiPayments from "./locales/doi/payments.json";
import doiProfile from "./locales/doi/profile.json";
import doiRadar from "./locales/doi/radar.json";
import doiRecalls from "./locales/doi/recalls.json";
import doiRegistration from "./locales/doi/registration.json";
import doiRenewal from "./locales/doi/renewal.json";
import doiRenewals from "./locales/doi/renewals.json";
import doiRetrievalQuality from "./locales/doi/retrievalQuality.json";
import doiScheme from "./locales/doi/scheme.json";
import doiStandards from "./locales/doi/standards.json";
import doiTesting from "./locales/doi/testing.json";
import doiVault from "./locales/doi/vault.json";
import doiVisits from "./locales/doi/visits.json";
import doiWizard from "./locales/doi/wizard.json";

// ── MAI ────────────────────────────────────────────────────────────
import maiAdmin from "./locales/mai/admin.json";
import maiAlerts from "./locales/mai/alerts.json";
import maiAppeals from "./locales/mai/appeals.json";
import maiAudits from "./locales/mai/audits.json";
import maiAuth from "./locales/mai/auth.json";
import maiBusinessAccount from "./locales/mai/businessAccount.json";
import maiCalendar from "./locales/mai/calendar.json";
import maiCertificates from "./locales/mai/certificates.json";
import maiChain from "./locales/mai/chain.json";
import maiChat from "./locales/mai/chat.json";
import maiCitation from "./locales/mai/citation.json";
import maiClassification from "./locales/mai/classification.json";
import maiConformity from "./locales/mai/conformity.json";
import maiConversation from "./locales/mai/conversation.json";
import maiCorrections from "./locales/mai/corrections.json";
import maiCortex from "./locales/mai/cortex.json";
import maiDashboard from "./locales/mai/dashboard.json";
import maiDevelopers from "./locales/mai/developers.json";
import maiGrievance from "./locales/mai/grievance.json";
import maiHistory from "./locales/mai/history.json";
import maiIntel from "./locales/mai/intel.json";
import maiInvoices from "./locales/mai/invoices.json";
import maiJurisdiction from "./locales/mai/jurisdiction.json";
import maiLaboratory from "./locales/mai/laboratory.json";
import maiLanding from "./locales/mai/landing.json";
import maiLegal from "./locales/mai/legal.json";
import maiLicenseActions from "./locales/mai/licenseActions.json";
import maiLocations from "./locales/mai/locations.json";
import maiNexus from "./locales/mai/nexus.json";
import maiNotifications from "./locales/mai/notifications.json";
import maiPayments from "./locales/mai/payments.json";
import maiProfile from "./locales/mai/profile.json";
import maiRadar from "./locales/mai/radar.json";
import maiRecalls from "./locales/mai/recalls.json";
import maiRegistration from "./locales/mai/registration.json";
import maiRenewal from "./locales/mai/renewal.json";
import maiRenewals from "./locales/mai/renewals.json";
import maiRetrievalQuality from "./locales/mai/retrievalQuality.json";
import maiScheme from "./locales/mai/scheme.json";
import maiStandards from "./locales/mai/standards.json";
import maiTesting from "./locales/mai/testing.json";
import maiVault from "./locales/mai/vault.json";
import maiVisits from "./locales/mai/visits.json";
import maiWizard from "./locales/mai/wizard.json";

// ── SAT ────────────────────────────────────────────────────────────
import satAdmin from "./locales/sat/admin.json";
import satAlerts from "./locales/sat/alerts.json";
import satAppeals from "./locales/sat/appeals.json";
import satAudits from "./locales/sat/audits.json";
import satAuth from "./locales/sat/auth.json";
import satBusinessAccount from "./locales/sat/businessAccount.json";
import satCalendar from "./locales/sat/calendar.json";
import satCertificates from "./locales/sat/certificates.json";
import satChain from "./locales/sat/chain.json";
import satChat from "./locales/sat/chat.json";
import satCitation from "./locales/sat/citation.json";
import satClassification from "./locales/sat/classification.json";
import satConformity from "./locales/sat/conformity.json";
import satConversation from "./locales/sat/conversation.json";
import satCorrections from "./locales/sat/corrections.json";
import satCortex from "./locales/sat/cortex.json";
import satDashboard from "./locales/sat/dashboard.json";
import satDevelopers from "./locales/sat/developers.json";
import satGrievance from "./locales/sat/grievance.json";
import satHistory from "./locales/sat/history.json";
import satIntel from "./locales/sat/intel.json";
import satInvoices from "./locales/sat/invoices.json";
import satJurisdiction from "./locales/sat/jurisdiction.json";
import satLaboratory from "./locales/sat/laboratory.json";
import satLanding from "./locales/sat/landing.json";
import satLegal from "./locales/sat/legal.json";
import satLicenseActions from "./locales/sat/licenseActions.json";
import satLocations from "./locales/sat/locations.json";
import satNexus from "./locales/sat/nexus.json";
import satNotifications from "./locales/sat/notifications.json";
import satPayments from "./locales/sat/payments.json";
import satProfile from "./locales/sat/profile.json";
import satRadar from "./locales/sat/radar.json";
import satRecalls from "./locales/sat/recalls.json";
import satRegistration from "./locales/sat/registration.json";
import satRenewal from "./locales/sat/renewal.json";
import satRenewals from "./locales/sat/renewals.json";
import satRetrievalQuality from "./locales/sat/retrievalQuality.json";
import satScheme from "./locales/sat/scheme.json";
import satStandards from "./locales/sat/standards.json";
import satTesting from "./locales/sat/testing.json";
import satVault from "./locales/sat/vault.json";
import satVisits from "./locales/sat/visits.json";
import satWizard from "./locales/sat/wizard.json";

export const LANGUAGES = [
  "en", "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or", "as",
  "ur", "sa", "ne", "ks", "kok", "mni", "brx", "doi", "mai", "sat",
];

export const RTL_LANGS = new Set(["ur", "ks"]);

const resources = {
  en: {
    admin: enAdmin,
    alerts: enAlerts,
    appeals: enAppeals,
    audits: enAudits,
    auth: enAuth,
    businessAccount: enBusinessAccount,
    calendar: enCalendar,
    certificates: enCertificates,
    chain: enChain,
    chat: enChat,
    citation: enCitation,
    classification: enClassification,
    conformity: enConformity,
    conversation: enConversation,
    corrections: enCorrections,
    cortex: enCortex,
    dashboard: enDashboard,
    developers: enDevelopers,
    grievance: enGrievance,
    history: enHistory,
    intel: enIntel,
    invoices: enInvoices,
    jurisdiction: enJurisdiction,
    laboratory: enLaboratory,
    landing: enLanding,
    legal: enLegal,
    licenseActions: enLicenseActions,
    locations: enLocations,
    nexus: enNexus,
    notifications: enNotifications,
    payments: enPayments,
    profile: enProfile,
    radar: enRadar,
    recalls: enRecalls,
    registration: enRegistration,
    renewal: enRenewal,
    renewals: enRenewals,
    retrievalQuality: enRetrievalQuality,
    scheme: enScheme,
    standards: enStandards,
    testing: enTesting,
    vault: enVault,
    visits: enVisits,
    wizard: enWizard,
  },
  hi: {
    admin: hiAdmin,
    alerts: hiAlerts,
    appeals: hiAppeals,
    audits: hiAudits,
    auth: hiAuth,
    businessAccount: hiBusinessAccount,
    calendar: hiCalendar,
    certificates: hiCertificates,
    chain: hiChain,
    chat: hiChat,
    citation: hiCitation,
    classification: hiClassification,
    conformity: hiConformity,
    conversation: hiConversation,
    corrections: hiCorrections,
    cortex: hiCortex,
    dashboard: hiDashboard,
    developers: hiDevelopers,
    grievance: hiGrievance,
    history: hiHistory,
    intel: hiIntel,
    invoices: hiInvoices,
    jurisdiction: hiJurisdiction,
    laboratory: hiLaboratory,
    landing: hiLanding,
    legal: hiLegal,
    licenseActions: hiLicenseActions,
    locations: hiLocations,
    nexus: hiNexus,
    notifications: hiNotifications,
    payments: hiPayments,
    profile: hiProfile,
    radar: hiRadar,
    recalls: hiRecalls,
    registration: hiRegistration,
    renewal: hiRenewal,
    renewals: hiRenewals,
    retrievalQuality: hiRetrievalQuality,
    scheme: hiScheme,
    standards: hiStandards,
    testing: hiTesting,
    vault: hiVault,
    visits: hiVisits,
    wizard: hiWizard,
  },
  bn: {
    admin: bnAdmin,
    alerts: bnAlerts,
    appeals: bnAppeals,
    audits: bnAudits,
    auth: bnAuth,
    businessAccount: bnBusinessAccount,
    calendar: bnCalendar,
    certificates: bnCertificates,
    chain: bnChain,
    chat: bnChat,
    citation: bnCitation,
    classification: bnClassification,
    conformity: bnConformity,
    conversation: bnConversation,
    corrections: bnCorrections,
    cortex: bnCortex,
    dashboard: bnDashboard,
    developers: bnDevelopers,
    grievance: bnGrievance,
    history: bnHistory,
    intel: bnIntel,
    invoices: bnInvoices,
    jurisdiction: bnJurisdiction,
    laboratory: bnLaboratory,
    landing: bnLanding,
    legal: bnLegal,
    licenseActions: bnLicenseActions,
    locations: bnLocations,
    nexus: bnNexus,
    notifications: bnNotifications,
    payments: bnPayments,
    profile: bnProfile,
    radar: bnRadar,
    recalls: bnRecalls,
    registration: bnRegistration,
    renewal: bnRenewal,
    renewals: bnRenewals,
    retrievalQuality: bnRetrievalQuality,
    scheme: bnScheme,
    standards: bnStandards,
    testing: bnTesting,
    vault: bnVault,
    visits: bnVisits,
    wizard: bnWizard,
  },
  ta: {
    admin: taAdmin,
    alerts: taAlerts,
    appeals: taAppeals,
    audits: taAudits,
    auth: taAuth,
    businessAccount: taBusinessAccount,
    calendar: taCalendar,
    certificates: taCertificates,
    chain: taChain,
    chat: taChat,
    citation: taCitation,
    classification: taClassification,
    conformity: taConformity,
    conversation: taConversation,
    corrections: taCorrections,
    cortex: taCortex,
    dashboard: taDashboard,
    developers: taDevelopers,
    grievance: taGrievance,
    history: taHistory,
    intel: taIntel,
    invoices: taInvoices,
    jurisdiction: taJurisdiction,
    laboratory: taLaboratory,
    landing: taLanding,
    legal: taLegal,
    licenseActions: taLicenseActions,
    locations: taLocations,
    nexus: taNexus,
    notifications: taNotifications,
    payments: taPayments,
    profile: taProfile,
    radar: taRadar,
    recalls: taRecalls,
    registration: taRegistration,
    renewal: taRenewal,
    renewals: taRenewals,
    retrievalQuality: taRetrievalQuality,
    scheme: taScheme,
    standards: taStandards,
    testing: taTesting,
    vault: taVault,
    visits: taVisits,
    wizard: taWizard,
  },
  te: {
    admin: teAdmin,
    alerts: teAlerts,
    appeals: teAppeals,
    audits: teAudits,
    auth: teAuth,
    businessAccount: teBusinessAccount,
    calendar: teCalendar,
    certificates: teCertificates,
    chain: teChain,
    chat: teChat,
    citation: teCitation,
    classification: teClassification,
    conformity: teConformity,
    conversation: teConversation,
    corrections: teCorrections,
    cortex: teCortex,
    dashboard: teDashboard,
    developers: teDevelopers,
    grievance: teGrievance,
    history: teHistory,
    intel: teIntel,
    invoices: teInvoices,
    jurisdiction: teJurisdiction,
    laboratory: teLaboratory,
    landing: teLanding,
    legal: teLegal,
    licenseActions: teLicenseActions,
    locations: teLocations,
    nexus: teNexus,
    notifications: teNotifications,
    payments: tePayments,
    profile: teProfile,
    radar: teRadar,
    recalls: teRecalls,
    registration: teRegistration,
    renewal: teRenewal,
    renewals: teRenewals,
    retrievalQuality: teRetrievalQuality,
    scheme: teScheme,
    standards: teStandards,
    testing: teTesting,
    vault: teVault,
    visits: teVisits,
    wizard: teWizard,
  },
  mr: {
    admin: mrAdmin,
    alerts: mrAlerts,
    appeals: mrAppeals,
    audits: mrAudits,
    auth: mrAuth,
    businessAccount: mrBusinessAccount,
    calendar: mrCalendar,
    certificates: mrCertificates,
    chain: mrChain,
    chat: mrChat,
    citation: mrCitation,
    classification: mrClassification,
    conformity: mrConformity,
    conversation: mrConversation,
    corrections: mrCorrections,
    cortex: mrCortex,
    dashboard: mrDashboard,
    developers: mrDevelopers,
    grievance: mrGrievance,
    history: mrHistory,
    intel: mrIntel,
    invoices: mrInvoices,
    jurisdiction: mrJurisdiction,
    laboratory: mrLaboratory,
    landing: mrLanding,
    legal: mrLegal,
    licenseActions: mrLicenseActions,
    locations: mrLocations,
    nexus: mrNexus,
    notifications: mrNotifications,
    payments: mrPayments,
    profile: mrProfile,
    radar: mrRadar,
    recalls: mrRecalls,
    registration: mrRegistration,
    renewal: mrRenewal,
    renewals: mrRenewals,
    retrievalQuality: mrRetrievalQuality,
    scheme: mrScheme,
    standards: mrStandards,
    testing: mrTesting,
    vault: mrVault,
    visits: mrVisits,
    wizard: mrWizard,
  },
  gu: {
    admin: guAdmin,
    alerts: guAlerts,
    appeals: guAppeals,
    audits: guAudits,
    auth: guAuth,
    businessAccount: guBusinessAccount,
    calendar: guCalendar,
    certificates: guCertificates,
    chain: guChain,
    chat: guChat,
    citation: guCitation,
    classification: guClassification,
    conformity: guConformity,
    conversation: guConversation,
    corrections: guCorrections,
    cortex: guCortex,
    dashboard: guDashboard,
    developers: guDevelopers,
    grievance: guGrievance,
    history: guHistory,
    intel: guIntel,
    invoices: guInvoices,
    jurisdiction: guJurisdiction,
    laboratory: guLaboratory,
    landing: guLanding,
    legal: guLegal,
    licenseActions: guLicenseActions,
    locations: guLocations,
    nexus: guNexus,
    notifications: guNotifications,
    payments: guPayments,
    profile: guProfile,
    radar: guRadar,
    recalls: guRecalls,
    registration: guRegistration,
    renewal: guRenewal,
    renewals: guRenewals,
    retrievalQuality: guRetrievalQuality,
    scheme: guScheme,
    standards: guStandards,
    testing: guTesting,
    vault: guVault,
    visits: guVisits,
    wizard: guWizard,
  },
  kn: {
    admin: knAdmin,
    alerts: knAlerts,
    appeals: knAppeals,
    audits: knAudits,
    auth: knAuth,
    businessAccount: knBusinessAccount,
    calendar: knCalendar,
    certificates: knCertificates,
    chain: knChain,
    chat: knChat,
    citation: knCitation,
    classification: knClassification,
    conformity: knConformity,
    conversation: knConversation,
    corrections: knCorrections,
    cortex: knCortex,
    dashboard: knDashboard,
    developers: knDevelopers,
    grievance: knGrievance,
    history: knHistory,
    intel: knIntel,
    invoices: knInvoices,
    jurisdiction: knJurisdiction,
    laboratory: knLaboratory,
    landing: knLanding,
    legal: knLegal,
    licenseActions: knLicenseActions,
    locations: knLocations,
    nexus: knNexus,
    notifications: knNotifications,
    payments: knPayments,
    profile: knProfile,
    radar: knRadar,
    recalls: knRecalls,
    registration: knRegistration,
    renewal: knRenewal,
    renewals: knRenewals,
    retrievalQuality: knRetrievalQuality,
    scheme: knScheme,
    standards: knStandards,
    testing: knTesting,
    vault: knVault,
    visits: knVisits,
    wizard: knWizard,
  },
  ml: {
    admin: mlAdmin,
    alerts: mlAlerts,
    appeals: mlAppeals,
    audits: mlAudits,
    auth: mlAuth,
    businessAccount: mlBusinessAccount,
    calendar: mlCalendar,
    certificates: mlCertificates,
    chain: mlChain,
    chat: mlChat,
    citation: mlCitation,
    classification: mlClassification,
    conformity: mlConformity,
    conversation: mlConversation,
    corrections: mlCorrections,
    cortex: mlCortex,
    dashboard: mlDashboard,
    developers: mlDevelopers,
    grievance: mlGrievance,
    history: mlHistory,
    intel: mlIntel,
    invoices: mlInvoices,
    jurisdiction: mlJurisdiction,
    laboratory: mlLaboratory,
    landing: mlLanding,
    legal: mlLegal,
    licenseActions: mlLicenseActions,
    locations: mlLocations,
    nexus: mlNexus,
    notifications: mlNotifications,
    payments: mlPayments,
    profile: mlProfile,
    radar: mlRadar,
    recalls: mlRecalls,
    registration: mlRegistration,
    renewal: mlRenewal,
    renewals: mlRenewals,
    retrievalQuality: mlRetrievalQuality,
    scheme: mlScheme,
    standards: mlStandards,
    testing: mlTesting,
    vault: mlVault,
    visits: mlVisits,
    wizard: mlWizard,
  },
  pa: {
    admin: paAdmin,
    alerts: paAlerts,
    appeals: paAppeals,
    audits: paAudits,
    auth: paAuth,
    businessAccount: paBusinessAccount,
    calendar: paCalendar,
    certificates: paCertificates,
    chain: paChain,
    chat: paChat,
    citation: paCitation,
    classification: paClassification,
    conformity: paConformity,
    conversation: paConversation,
    corrections: paCorrections,
    cortex: paCortex,
    dashboard: paDashboard,
    developers: paDevelopers,
    grievance: paGrievance,
    history: paHistory,
    intel: paIntel,
    invoices: paInvoices,
    jurisdiction: paJurisdiction,
    laboratory: paLaboratory,
    landing: paLanding,
    legal: paLegal,
    licenseActions: paLicenseActions,
    locations: paLocations,
    nexus: paNexus,
    notifications: paNotifications,
    payments: paPayments,
    profile: paProfile,
    radar: paRadar,
    recalls: paRecalls,
    registration: paRegistration,
    renewal: paRenewal,
    renewals: paRenewals,
    retrievalQuality: paRetrievalQuality,
    scheme: paScheme,
    standards: paStandards,
    testing: paTesting,
    vault: paVault,
    visits: paVisits,
    wizard: paWizard,
  },
  or: {
    admin: orAdmin,
    alerts: orAlerts,
    appeals: orAppeals,
    audits: orAudits,
    auth: orAuth,
    businessAccount: orBusinessAccount,
    calendar: orCalendar,
    certificates: orCertificates,
    chain: orChain,
    chat: orChat,
    citation: orCitation,
    classification: orClassification,
    conformity: orConformity,
    conversation: orConversation,
    corrections: orCorrections,
    cortex: orCortex,
    dashboard: orDashboard,
    developers: orDevelopers,
    grievance: orGrievance,
    history: orHistory,
    intel: orIntel,
    invoices: orInvoices,
    jurisdiction: orJurisdiction,
    laboratory: orLaboratory,
    landing: orLanding,
    legal: orLegal,
    licenseActions: orLicenseActions,
    locations: orLocations,
    nexus: orNexus,
    notifications: orNotifications,
    payments: orPayments,
    profile: orProfile,
    radar: orRadar,
    recalls: orRecalls,
    registration: orRegistration,
    renewal: orRenewal,
    renewals: orRenewals,
    retrievalQuality: orRetrievalQuality,
    scheme: orScheme,
    standards: orStandards,
    testing: orTesting,
    vault: orVault,
    visits: orVisits,
    wizard: orWizard,
  },
  as: {
    admin: asAdmin,
    alerts: asAlerts,
    appeals: asAppeals,
    audits: asAudits,
    auth: asAuth,
    businessAccount: asBusinessAccount,
    calendar: asCalendar,
    certificates: asCertificates,
    chain: asChain,
    chat: asChat,
    citation: asCitation,
    classification: asClassification,
    conformity: asConformity,
    conversation: asConversation,
    corrections: asCorrections,
    cortex: asCortex,
    dashboard: asDashboard,
    developers: asDevelopers,
    grievance: asGrievance,
    history: asHistory,
    intel: asIntel,
    invoices: asInvoices,
    jurisdiction: asJurisdiction,
    laboratory: asLaboratory,
    landing: asLanding,
    legal: asLegal,
    licenseActions: asLicenseActions,
    locations: asLocations,
    nexus: asNexus,
    notifications: asNotifications,
    payments: asPayments,
    profile: asProfile,
    radar: asRadar,
    recalls: asRecalls,
    registration: asRegistration,
    renewal: asRenewal,
    renewals: asRenewals,
    retrievalQuality: asRetrievalQuality,
    scheme: asScheme,
    standards: asStandards,
    testing: asTesting,
    vault: asVault,
    visits: asVisits,
    wizard: asWizard,
  },
  ur: {
    admin: urAdmin,
    alerts: urAlerts,
    appeals: urAppeals,
    audits: urAudits,
    auth: urAuth,
    businessAccount: urBusinessAccount,
    calendar: urCalendar,
    certificates: urCertificates,
    chain: urChain,
    chat: urChat,
    citation: urCitation,
    classification: urClassification,
    conformity: urConformity,
    conversation: urConversation,
    corrections: urCorrections,
    cortex: urCortex,
    dashboard: urDashboard,
    developers: urDevelopers,
    grievance: urGrievance,
    history: urHistory,
    intel: urIntel,
    invoices: urInvoices,
    jurisdiction: urJurisdiction,
    laboratory: urLaboratory,
    landing: urLanding,
    legal: urLegal,
    licenseActions: urLicenseActions,
    locations: urLocations,
    nexus: urNexus,
    notifications: urNotifications,
    payments: urPayments,
    profile: urProfile,
    radar: urRadar,
    recalls: urRecalls,
    registration: urRegistration,
    renewal: urRenewal,
    renewals: urRenewals,
    retrievalQuality: urRetrievalQuality,
    scheme: urScheme,
    standards: urStandards,
    testing: urTesting,
    vault: urVault,
    visits: urVisits,
    wizard: urWizard,
  },
  sa: {
    admin: saAdmin,
    alerts: saAlerts,
    appeals: saAppeals,
    audits: saAudits,
    auth: saAuth,
    businessAccount: saBusinessAccount,
    calendar: saCalendar,
    certificates: saCertificates,
    chain: saChain,
    chat: saChat,
    citation: saCitation,
    classification: saClassification,
    conformity: saConformity,
    conversation: saConversation,
    corrections: saCorrections,
    cortex: saCortex,
    dashboard: saDashboard,
    developers: saDevelopers,
    grievance: saGrievance,
    history: saHistory,
    intel: saIntel,
    invoices: saInvoices,
    jurisdiction: saJurisdiction,
    laboratory: saLaboratory,
    landing: saLanding,
    legal: saLegal,
    licenseActions: saLicenseActions,
    locations: saLocations,
    nexus: saNexus,
    notifications: saNotifications,
    payments: saPayments,
    profile: saProfile,
    radar: saRadar,
    recalls: saRecalls,
    registration: saRegistration,
    renewal: saRenewal,
    renewals: saRenewals,
    retrievalQuality: saRetrievalQuality,
    scheme: saScheme,
    standards: saStandards,
    testing: saTesting,
    vault: saVault,
    visits: saVisits,
    wizard: saWizard,
  },
  ne: {
    admin: neAdmin,
    alerts: neAlerts,
    appeals: neAppeals,
    audits: neAudits,
    auth: neAuth,
    businessAccount: neBusinessAccount,
    calendar: neCalendar,
    certificates: neCertificates,
    chain: neChain,
    chat: neChat,
    citation: neCitation,
    classification: neClassification,
    conformity: neConformity,
    conversation: neConversation,
    corrections: neCorrections,
    cortex: neCortex,
    dashboard: neDashboard,
    developers: neDevelopers,
    grievance: neGrievance,
    history: neHistory,
    intel: neIntel,
    invoices: neInvoices,
    jurisdiction: neJurisdiction,
    laboratory: neLaboratory,
    landing: neLanding,
    legal: neLegal,
    licenseActions: neLicenseActions,
    locations: neLocations,
    nexus: neNexus,
    notifications: neNotifications,
    payments: nePayments,
    profile: neProfile,
    radar: neRadar,
    recalls: neRecalls,
    registration: neRegistration,
    renewal: neRenewal,
    renewals: neRenewals,
    retrievalQuality: neRetrievalQuality,
    scheme: neScheme,
    standards: neStandards,
    testing: neTesting,
    vault: neVault,
    visits: neVisits,
    wizard: neWizard,
  },
  ks: {
    admin: ksAdmin,
    alerts: ksAlerts,
    appeals: ksAppeals,
    audits: ksAudits,
    auth: ksAuth,
    businessAccount: ksBusinessAccount,
    calendar: ksCalendar,
    certificates: ksCertificates,
    chain: ksChain,
    chat: ksChat,
    citation: ksCitation,
    classification: ksClassification,
    conformity: ksConformity,
    conversation: ksConversation,
    corrections: ksCorrections,
    cortex: ksCortex,
    dashboard: ksDashboard,
    developers: ksDevelopers,
    grievance: ksGrievance,
    history: ksHistory,
    intel: ksIntel,
    invoices: ksInvoices,
    jurisdiction: ksJurisdiction,
    laboratory: ksLaboratory,
    landing: ksLanding,
    legal: ksLegal,
    licenseActions: ksLicenseActions,
    locations: ksLocations,
    nexus: ksNexus,
    notifications: ksNotifications,
    payments: ksPayments,
    profile: ksProfile,
    radar: ksRadar,
    recalls: ksRecalls,
    registration: ksRegistration,
    renewal: ksRenewal,
    renewals: ksRenewals,
    retrievalQuality: ksRetrievalQuality,
    scheme: ksScheme,
    standards: ksStandards,
    testing: ksTesting,
    vault: ksVault,
    visits: ksVisits,
    wizard: ksWizard,
  },
  kok: {
    admin: kokAdmin,
    alerts: kokAlerts,
    appeals: kokAppeals,
    audits: kokAudits,
    auth: kokAuth,
    businessAccount: kokBusinessAccount,
    calendar: kokCalendar,
    certificates: kokCertificates,
    chain: kokChain,
    chat: kokChat,
    citation: kokCitation,
    classification: kokClassification,
    conformity: kokConformity,
    conversation: kokConversation,
    corrections: kokCorrections,
    cortex: kokCortex,
    dashboard: kokDashboard,
    developers: kokDevelopers,
    grievance: kokGrievance,
    history: kokHistory,
    intel: kokIntel,
    invoices: kokInvoices,
    jurisdiction: kokJurisdiction,
    laboratory: kokLaboratory,
    landing: kokLanding,
    legal: kokLegal,
    licenseActions: kokLicenseActions,
    locations: kokLocations,
    nexus: kokNexus,
    notifications: kokNotifications,
    payments: kokPayments,
    profile: kokProfile,
    radar: kokRadar,
    recalls: kokRecalls,
    registration: kokRegistration,
    renewal: kokRenewal,
    renewals: kokRenewals,
    retrievalQuality: kokRetrievalQuality,
    scheme: kokScheme,
    standards: kokStandards,
    testing: kokTesting,
    vault: kokVault,
    visits: kokVisits,
    wizard: kokWizard,
  },
  mni: {
    admin: mniAdmin,
    alerts: mniAlerts,
    appeals: mniAppeals,
    audits: mniAudits,
    auth: mniAuth,
    businessAccount: mniBusinessAccount,
    calendar: mniCalendar,
    certificates: mniCertificates,
    chain: mniChain,
    chat: mniChat,
    citation: mniCitation,
    classification: mniClassification,
    conformity: mniConformity,
    conversation: mniConversation,
    corrections: mniCorrections,
    cortex: mniCortex,
    dashboard: mniDashboard,
    developers: mniDevelopers,
    grievance: mniGrievance,
    history: mniHistory,
    intel: mniIntel,
    invoices: mniInvoices,
    jurisdiction: mniJurisdiction,
    laboratory: mniLaboratory,
    landing: mniLanding,
    legal: mniLegal,
    licenseActions: mniLicenseActions,
    locations: mniLocations,
    nexus: mniNexus,
    notifications: mniNotifications,
    payments: mniPayments,
    profile: mniProfile,
    radar: mniRadar,
    recalls: mniRecalls,
    registration: mniRegistration,
    renewal: mniRenewal,
    renewals: mniRenewals,
    retrievalQuality: mniRetrievalQuality,
    scheme: mniScheme,
    standards: mniStandards,
    testing: mniTesting,
    vault: mniVault,
    visits: mniVisits,
    wizard: mniWizard,
  },
  brx: {
    admin: brxAdmin,
    alerts: brxAlerts,
    appeals: brxAppeals,
    audits: brxAudits,
    auth: brxAuth,
    businessAccount: brxBusinessAccount,
    calendar: brxCalendar,
    certificates: brxCertificates,
    chain: brxChain,
    chat: brxChat,
    citation: brxCitation,
    classification: brxClassification,
    conformity: brxConformity,
    conversation: brxConversation,
    corrections: brxCorrections,
    cortex: brxCortex,
    dashboard: brxDashboard,
    developers: brxDevelopers,
    grievance: brxGrievance,
    history: brxHistory,
    intel: brxIntel,
    invoices: brxInvoices,
    jurisdiction: brxJurisdiction,
    laboratory: brxLaboratory,
    landing: brxLanding,
    legal: brxLegal,
    licenseActions: brxLicenseActions,
    locations: brxLocations,
    nexus: brxNexus,
    notifications: brxNotifications,
    payments: brxPayments,
    profile: brxProfile,
    radar: brxRadar,
    recalls: brxRecalls,
    registration: brxRegistration,
    renewal: brxRenewal,
    renewals: brxRenewals,
    retrievalQuality: brxRetrievalQuality,
    scheme: brxScheme,
    standards: brxStandards,
    testing: brxTesting,
    vault: brxVault,
    visits: brxVisits,
    wizard: brxWizard,
  },
  doi: {
    admin: doiAdmin,
    alerts: doiAlerts,
    appeals: doiAppeals,
    audits: doiAudits,
    auth: doiAuth,
    businessAccount: doiBusinessAccount,
    calendar: doiCalendar,
    certificates: doiCertificates,
    chain: doiChain,
    chat: doiChat,
    citation: doiCitation,
    classification: doiClassification,
    conformity: doiConformity,
    conversation: doiConversation,
    corrections: doiCorrections,
    cortex: doiCortex,
    dashboard: doiDashboard,
    developers: doiDevelopers,
    grievance: doiGrievance,
    history: doiHistory,
    intel: doiIntel,
    invoices: doiInvoices,
    jurisdiction: doiJurisdiction,
    laboratory: doiLaboratory,
    landing: doiLanding,
    legal: doiLegal,
    licenseActions: doiLicenseActions,
    locations: doiLocations,
    nexus: doiNexus,
    notifications: doiNotifications,
    payments: doiPayments,
    profile: doiProfile,
    radar: doiRadar,
    recalls: doiRecalls,
    registration: doiRegistration,
    renewal: doiRenewal,
    renewals: doiRenewals,
    retrievalQuality: doiRetrievalQuality,
    scheme: doiScheme,
    standards: doiStandards,
    testing: doiTesting,
    vault: doiVault,
    visits: doiVisits,
    wizard: doiWizard,
  },
  mai: {
    admin: maiAdmin,
    alerts: maiAlerts,
    appeals: maiAppeals,
    audits: maiAudits,
    auth: maiAuth,
    businessAccount: maiBusinessAccount,
    calendar: maiCalendar,
    certificates: maiCertificates,
    chain: maiChain,
    chat: maiChat,
    citation: maiCitation,
    classification: maiClassification,
    conformity: maiConformity,
    conversation: maiConversation,
    corrections: maiCorrections,
    cortex: maiCortex,
    dashboard: maiDashboard,
    developers: maiDevelopers,
    grievance: maiGrievance,
    history: maiHistory,
    intel: maiIntel,
    invoices: maiInvoices,
    jurisdiction: maiJurisdiction,
    laboratory: maiLaboratory,
    landing: maiLanding,
    legal: maiLegal,
    licenseActions: maiLicenseActions,
    locations: maiLocations,
    nexus: maiNexus,
    notifications: maiNotifications,
    payments: maiPayments,
    profile: maiProfile,
    radar: maiRadar,
    recalls: maiRecalls,
    registration: maiRegistration,
    renewal: maiRenewal,
    renewals: maiRenewals,
    retrievalQuality: maiRetrievalQuality,
    scheme: maiScheme,
    standards: maiStandards,
    testing: maiTesting,
    vault: maiVault,
    visits: maiVisits,
    wizard: maiWizard,
  },
  sat: {
    admin: satAdmin,
    alerts: satAlerts,
    appeals: satAppeals,
    audits: satAudits,
    auth: satAuth,
    businessAccount: satBusinessAccount,
    calendar: satCalendar,
    certificates: satCertificates,
    chain: satChain,
    chat: satChat,
    citation: satCitation,
    classification: satClassification,
    conformity: satConformity,
    conversation: satConversation,
    corrections: satCorrections,
    cortex: satCortex,
    dashboard: satDashboard,
    developers: satDevelopers,
    grievance: satGrievance,
    history: satHistory,
    intel: satIntel,
    invoices: satInvoices,
    jurisdiction: satJurisdiction,
    laboratory: satLaboratory,
    landing: satLanding,
    legal: satLegal,
    licenseActions: satLicenseActions,
    locations: satLocations,
    nexus: satNexus,
    notifications: satNotifications,
    payments: satPayments,
    profile: satProfile,
    radar: satRadar,
    recalls: satRecalls,
    registration: satRegistration,
    renewal: satRenewal,
    renewals: satRenewals,
    retrievalQuality: satRetrievalQuality,
    scheme: satScheme,
    standards: satStandards,
    testing: satTesting,
    vault: satVault,
    visits: satVisits,
    wizard: satWizard,
  },
};

export const syncDocumentLanguage = (lang: string) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
  }
};

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
  })
  .then(() => {
    // Runs once resources are ready, so a page load that starts in ur/ks
    // (once language persistence exists) gets the right dir immediately
    // instead of flashing ltr first.
    syncDocumentLanguage(i18n.language);
  });

// Both the landing page's language toggle and the in-app one call
// i18n.changeLanguage() directly (see language-dropdown.tsx, which backs
// both) — this single listener keeps documentElement.lang/dir in sync with
// every future switch without either component needing to know about it.
i18n.on("languageChanged", syncDocumentLanguage);

export default i18n;
