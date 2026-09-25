const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'i18n', 'locales');
const locales = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

locales.forEach(lang => {
  const landingPath = path.join(baseDir, lang, 'landing.json');
  if (fs.existsSync(landingPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(landingPath, 'utf8'));
      
      if (data.bilingual) {
        if (lang === 'hi') {
           data.bilingual.heading = "भारत के मानक, भारत की अपनी भाषाओं में।";
           data.bilingual.body = "कश्मीरी से लेकर मलयालम तक, SAATHI आपके घर की भाषा बोलता है। हर उद्धरण, हर मानक और हर प्रामाणिक जवाब सभी 22 अनुसूचित भाषाओं में तुरंत उपलब्ध है।";
        } else {
           data.bilingual.heading = "India's Standards, in India's Languages.";
           data.bilingual.body = "From Kashmiri to Malayalam, SAATHI speaks the language of your home. Every citation, every standard, and every honest answer is available instantly across all 22 Scheduled Languages.";
        }
      }
      
      fs.writeFileSync(landingPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated ${lang}/landing.json with creative copy`);
    } catch (e) {
      console.error(`Failed to process ${lang}/landing.json:`, e);
    }
  }
});
