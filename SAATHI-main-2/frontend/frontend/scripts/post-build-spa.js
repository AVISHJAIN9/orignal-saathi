import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, '.output/public');
const distDir = path.resolve(rootDir, 'dist');

const indexPath = path.join(publicDir, 'index.html');
const fallback200 = path.join(publicDir, '200.html');
const fallback404 = path.join(publicDir, '404.html');

console.log('🚀 Running Post-Build SPA verification...');

if (fs.existsSync(indexPath)) {
  console.log('✅ Found index.html at:', indexPath);
  
  // Copy to 200.html and 404.html for SPA static hosting routing
  fs.copyFileSync(indexPath, fallback200);
  fs.copyFileSync(indexPath, fallback404);
  console.log('✅ Created 200.html and 404.html SPA fallbacks in .output/public');

  // Also mirror to dist/ if needed by Render / standard SPA hosting
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.cpSync(publicDir, distDir, { recursive: true });
  console.log('✅ Synchronized static build files to dist/');
} else {
  console.error('❌ Error: index.html was not generated in', publicDir);
  process.exit(1);
}

console.log('✨ SPA Post-Build successfully finished.');
