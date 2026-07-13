import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const fileDir = path.dirname(filePath);

  // Regex to match imports: import ... from "relative-path" or import "relative-path"
  const importRegex = /(from\s+|import\s+)(['"])(\.\.?\/[^'"]+)\2/g;

  content = content.replace(importRegex, (match, prefix, quote, relPath) => {
    const absoluteImportPath = path.resolve(fileDir, relPath);
    // Check if the resolved path is inside src
    if (absoluteImportPath.startsWith(srcDir)) {
      // Calculate path relative to src
      let aliasPath = '@/' + path.relative(srcDir, absoluteImportPath).replace(/\\/g, '/');
      changed = true;
      return `${prefix}${quote}${aliasPath}${quote}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir(srcDir, processFile);
console.log("Done refactoring imports.");
