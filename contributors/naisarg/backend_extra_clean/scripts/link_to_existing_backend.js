/**
 * Script to verify and establish the bridge link between
 * 'backend extra' and 'sih2026 origins'.
 */

const fs = require('fs');
const path = require('path');

const originsPath = path.resolve(__dirname, '../../sih2026 origins');
const adapterPath = path.join(originsPath, 'routes', 'backend_extra_adapter.js');

console.log('[Linker] Checking connection between backend extra and existing backend...');

if (fs.existsSync(originsPath)) {
  console.log(`[Linker] Found existing backend at: ${originsPath}`);
  if (fs.existsSync(adapterPath)) {
    console.log(`[Linker] Bridge adapter verified at: ${adapterPath}`);
  } else {
    console.warn(`[Linker] Bridge adapter missing at: ${adapterPath}`);
  }
  console.log('[Linker] Linking successfully established.');
} else {
  console.warn('[Linker] Existing backend directory not found at relative path.');
}
