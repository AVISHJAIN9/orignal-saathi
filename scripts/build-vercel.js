const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 [Vercel Build] Starting SAATHI frontend build...');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'SAATHI-main-2', 'frontend', 'frontend');

if (!fs.existsSync(frontendDir)) {
  console.error(`❌ Frontend directory not found at: ${frontendDir}`);
  process.exit(1);
}

console.log(`📦 [Vercel Build] Installing dependencies in ${frontendDir}...`);
execSync('npm install', {
  cwd: frontendDir,
  stdio: 'inherit',
  env: { ...process.env, CI: '1' }
});

console.log('⚡ [Vercel Build] Compiling frontend with Nitro Vercel preset...');
execSync('npm run build', {
  cwd: frontendDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    VERCEL: '1',
    NITRO_PRESET: 'vercel'
  }
});

const srcVercelOutput = path.join(frontendDir, '.vercel');
const targetVercelOutput = path.join(rootDir, '.vercel');

if (fs.existsSync(srcVercelOutput)) {
  console.log(`🚚 [Vercel Build] Copying build artifacts from ${srcVercelOutput} to ${targetVercelOutput}...`);
  fs.cpSync(srcVercelOutput, targetVercelOutput, { recursive: true });
  console.log('✅ [Vercel Build] Build artifacts copied successfully to root.');
} else {
  console.warn('⚠️ [Vercel Build] Warning: .vercel folder not found in frontend directory.');
}

console.log('🎉 [Vercel Build] Frontend build completed successfully!');
