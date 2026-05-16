import fs from 'fs';
const content = fs.readFileSync('src/App.tsx', 'utf8');
const cleaned = content.replace(/\uFFFD/g, '');
fs.writeFileSync('src/App.tsx', cleaned);
console.log('Cleaned src/App.tsx');
