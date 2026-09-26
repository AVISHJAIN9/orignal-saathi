/**
 * Housekeeping script to ensure all individual microservice packages have a proper .gitignore
 * that excludes .env, node_modules, __pycache__, and .venv
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const STANDARD_GITIGNORE = `# Local environment secrets
.env
*.env
.env.*
!.env.example

# Dependencies & Build artifacts
node_modules/
dist/
build/

# Python virtual environment & caches
__pycache__/
*.py[cod]
.pytest_cache/
.venv/
venv/
env/

# System files
.DS_Store
`;

const targetParentDirs = ['m', 'p', 'g', 'd', 'x', 'c', 's', 'i'];

let addedCount = 0;
let updatedCount = 0;

for (const parent of targetParentDirs) {
  const parentPath = path.join(repoRoot, parent);
  if (!fs.existsSync(parentPath)) continue;

  const subdirs = fs.readdirSync(parentPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const sub of subdirs) {
    const subPath = path.join(parentPath, sub.name);
    // Only add if it's a microservice package (contains package.json, requirements.txt, or src)
    const isPackage = fs.existsSync(path.join(subPath, 'package.json')) ||
                      fs.existsSync(path.join(subPath, 'requirements.txt')) ||
                      fs.existsSync(path.join(subPath, 'src')) ||
                      fs.existsSync(path.join(subPath, 'main.py'));

    if (isPackage) {
      const gitignorePath = path.join(subPath, '.gitignore');
      if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, STANDARD_GITIGNORE, 'utf8');
        addedCount++;
      } else {
        let content = fs.readFileSync(gitignorePath, 'utf8');
        let needsUpdate = false;
        if (!content.includes('.env')) { content += '\n.env\n*.env\n!.env.example\n'; needsUpdate = true; }
        if (!content.includes('node_modules')) { content += 'node_modules/\n'; needsUpdate = true; }
        if (!content.includes('__pycache__')) { content += '__pycache__/\n'; needsUpdate = true; }
        if (!content.includes('.venv')) { content += '.venv/\nvenv/\n'; needsUpdate = true; }
        if (needsUpdate) {
          fs.writeFileSync(gitignorePath, content, 'utf8');
          updatedCount++;
        }
      }
    }
  }
}

console.log(`Subfolder .gitignore audit complete: ${addedCount} created, ${updatedCount} updated.`);
