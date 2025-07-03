const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript files in src
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the old import with the new one
    const oldImport = /import\s+{\s*useAuth\s*}\s+from\s+['"]@\/hooks\/useAuth['"];?/g;
    const newImport = "import { useAuth } from '@/contexts/AuthContext';";
    
    if (oldImport.test(content)) {
      content = content.replace(oldImport, newImport);
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
      console.log(`Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nTotal files fixed: ${fixedCount}`);