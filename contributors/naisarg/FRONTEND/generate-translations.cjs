const fs = require('fs');
const path = require('path');

const locales = ['ks', 'kok', 'mni', 'brx', 'doi', 'mai', 'sat'];
const baseDir = path.join(__dirname, 'src', 'i18n', 'locales');

// English reference for auth.json
const enAuth = {
  loginCta: "Login",
  title: "Welcome to SAATHI",
  description: "This is a UI-only demo login — no real account is created or verified.",
  tabs: { login: "Login", signup: "Sign Up" },
  emailLabel: "Email or username",
  emailPlaceholder: "you@example.com",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",
  showPassword: "Show password",
  hidePassword: "Hide password",
  accountTypeLabel: "Account type",
  accountType: { public: "Public User", industry: "Industry", admin: "Admin" },
  loginSubmit: "Log in",
  signupSubmit: "Create account",
  logout: "Logout",
  errors: {
    emailRequired: "Enter your email or username.",
    emailInvalid: "That email address doesn't look right.",
    passwordRequired: "Enter your password.",
    passwordTooShort: "Password must be at least 6 characters."
  }
};

const enChat = {
  title: "SAATHI - Ask about Indian Standards",
  logo: "SAATHI",
  inputPlaceholder: "Ask about Indian Standards...",
  sendAriaLabel: "Send message",
  thinking: "SAATHI is thinking…",
  backToHome: "Back to Home",
  nav: {
    standardsBrowser: "Standards Browser",
    adminPanel: "Admin Panel",
    documentManagement: "Document Management",
    conformityCheck: "Conformity Check",
    notifications: "Notifications",
    regulatoryRadar: "Regulatory Radar",
    intelFeed: "Intel Feed",
    documentCortex: "Document Cortex"
  },
  placeholder: {
    comingSoon: "This is a placeholder — full functionality is coming soon.",
    roleRequired: "Your current account doesn't have access to this page.",
    backToChat: "Back to chat"
  },
  clearChat: {
    trigger: "Clear chat",
    title: "Clear this conversation?",
    description: "This removes the current messages.",
    cancel: "Keep conversation",
    confirm: "Clear chat",
    emptyTitle: "Fresh conversation",
    emptyDescription: "Ask SAATHI about an Indian Standard to start again."
  }
};

const enLanding = JSON.parse(fs.readFileSync(path.join(baseDir, 'en', 'landing.json'), 'utf8'));

// Very basic simulated translations for these low-resource languages. 
// In a real production scenario, these would be translated by native speakers.
// Here we provide a mix of transliterated terms and translated keywords 
// where applicable, mapping UI elements logically.

const tr = {
  ks: { // Kashmiri (RTL)
    auth: { ...enAuth, title: "سٲتھی مَنٛز خۄش آمدید", loginCta: "لاگ اِن", tabs: { login: "لاگ اِن", signup: "سائن اَپ" } },
    chat: { ...enChat, inputPlaceholder: "ہِندوستٲنۍ معیارن مُتعلِق پُچھِو...", logo: "سٲتھی", thinking: "سٲتھی چھُ سوچان..." },
    landing: { ...enLanding, nav: { ...enLanding.nav, brand: "سٲتھی", openChat: "کَتھ باتھ شروٗع کٔرِو" }, closing: { heading: "سٲتھی پُچھِو۔", cta: "کَتھ باتھ شروٗع کٔرِو" } }
  },
  kok: { // Konkani
    auth: { ...enAuth, title: "SAATHI-ंत येवकार", loginCta: "लॉग इन", tabs: { login: "लॉग इन", signup: "साइन अप" } },
    chat: { ...enChat, inputPlaceholder: "भारतीय मानकां विशीं विचारचें...", logo: "SAATHI", thinking: "SAATHI विचार करता..." },
    landing: { ...enLanding, nav: { ...enLanding.nav, brand: "SAATHI", openChat: "उलोवंक सुरवात करात" }, closing: { heading: "SAATHI कडेन विचारात.", cta: "उलोवंक सुरवात करात" } }
  },
  mni: { // Manipuri
    auth: { ...enAuth, title: "SAATHI দা তরাম্না ওকচরি", loginCta: "লগইন", tabs: { login: "লগইন", signup: "শাইন অপ" } },
    chat: { ...enChat, inputPlaceholder: "ইন্দিয়ান স্তেন্দার্দকী মরমদা হংবিয়ু...", logo: "SAATHI", thinking: "SAATHI খল্লি..." },
    landing: { ...enLanding, nav: { ...enLanding.nav, brand: "SAATHI", openChat: "ৱারী শান্নবা হৌবিয়ু" }, closing: { heading: "SAATHI দা হংবিয়ু.", cta: "ৱারী শান্নবা হৌবিয়ু" } }
  },
  brx: { // Bodo
    auth: { ...enAuth, title: "SAATHI आव बरायनाय जाबाय", loginCta: "लग इन", tabs: { login: "लग इन", signup: "साइन आप" } },
    chat: { ...enChat, inputPlaceholder: "भारतारि माननि सोमोन्दै सों...", logo: "SAATHI", thinking: "SAATHI सानगासिनो..." },
    landing: { ...enLanding, nav: { ...enLanding.nav, brand: "SAATHI", openChat: "रायजलायनो जागाय" }, closing: { heading: "SAATHI खौ सों.", cta: "रायजलायनो जागाय" } }
  },
  doi: { // Dogri
    auth: { ...enAuth, title: "SAATHI च तुंदा स्वागत ऐ", loginCta: "लाग इन", tabs: { login: "लाग इन", signup: "साइन अप" } },
    chat: { ...enChat, inputPlaceholder: "भारतीय मानकें दे बारे च पुच्छो...", logo: "SAATHI", thinking: "SAATHI सोच करै करदा ऐ..." },
    landing: { ...enLanding, nav: { ...enLanding.nav, brand: "SAATHI", openChat: "गल्लबात शुरू करो" }, closing: { heading: "SAATHI गी पुच्छो.", cta: "गल्लबात शुरू करो" } }
  },
  mai: { // Maithili
    auth: { ...enAuth, title: "SAATHI मे अहाँक स्वागत अछि", loginCta: "लॉग इन", tabs: { login: "लॉग इन", signup: "साइन अप" } },
    chat: { ...enChat, inputPlaceholder: "भारतीय मानक क बारे मे पूछू...", logo: "SAATHI", thinking: "SAATHI सोच रहल अछि..." },
    landing: { ...enLanding, nav: { ...enLanding.nav, brand: "SAATHI", openChat: "गपशप शुरू करू" }, closing: { heading: "SAATHI सँ पूछू.", cta: "गपशप शुरू करू" } }
  },
  sat: { // Santali
    auth: { ...enAuth, title: "SAATHI ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ", loginCta: "ᱞᱚᱜᱽ ᱤᱱ", tabs: { login: "ᱞᱚᱜᱽ ᱤᱱ", signup: "ᱥᱟᱭᱤᱱ ᱟᱯ" } },
    chat: { ...enChat, inputPlaceholder: "ᱥᱤᱧᱚᱛᱤᱭᱟᱹ ᱥᱴᱟᱱᱰᱟᱨᱰ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤ...", logo: "SAATHI", thinking: "SAATHI ᱦᱩᱫᱤᱥ ᱮᱫᱟ..." },
    landing: { ...enLanding, nav: { ...enLanding.nav, brand: "SAATHI", openChat: "ᱨᱚᱯᱚᱲ ᱮᱦᱚᱵᱽ" }, closing: { heading: "SAATHI ᱠᱩᱞᱤ ᱮ.", cta: "ᱨᱚᱯᱚᱲ ᱮᱦᱚᱵᱽ" } }
  }
};

locales.forEach(lang => {
  const dir = path.join(baseDir, lang);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(path.join(dir, 'auth.json'), JSON.stringify(tr[lang].auth, null, 2), 'utf8');
  fs.writeFileSync(path.join(dir, 'chat.json'), JSON.stringify(tr[lang].chat, null, 2), 'utf8');
  fs.writeFileSync(path.join(dir, 'landing.json'), JSON.stringify(tr[lang].landing, null, 2), 'utf8');
  
  console.log(`Generated translations for ${lang}`);
});
