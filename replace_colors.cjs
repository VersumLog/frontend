const fs = require('fs');
const path = require('path');

const map = {
  // Plum family
  '432534': 'plum',
  '2d1b22': 'plum-hover',
  '744458': 'plum-light',
  '73485e': 'plum-light',
  '72485e': 'plum-light',
  '7e4864': 'plum-scroll',
  '4a2739': 'plum-scroll',
  '61344b': 'plum-scroll-hover',
  '5a3444': 'plum-scroll-hover',
  '5c3a4b': 'plum-scroll-hover',
  
  // Mint family
  '4f9689': 'mint',
  '439688': 'mint',
  '4a9588': 'mint',
  '1c4b43': 'mint-dark',
  '144b44': 'mint-dark',
  '1a5e55': 'mint-dark',
  '2a7064': 'mint-dark',
  '55bba6': 'mint-light',
  '52afa0': 'mint-light',
  '4eb09c': 'mint-hover',
  '459a8c': 'mint-hover',
  '28a745': 'mint',
  '4caf50': 'mint',
  'eafaf1': 'mint-light',
  
  // Cream family
  'fde9d1': 'cream',
  'efd6ac': 'cream-dark',
  'e9c99d': 'cream-dark',
  'deb378': 'cream-dark',
  'c2b280': 'cream-dark',
  'b1a170': 'cream-dark',
  'fff1db': 'cream-light',
  'ffe6b7': 'cream-light',
  'ffe6bd': 'cream-light',
  'fdf5e6': 'cream-light',
  'f3edf0': 'cream-input',
  'f3eee5': 'cream-input',
  'e5d8c1': 'cream-input',
  'd1c4ae': 'cream-input',

  // Mauve family
  'e4c1d3': 'mauve',
  'dcbccd': 'mauve-light',
  'cca8ba': 'mauve-light',
  'b893a5': 'mauve-dark',
  
  // System
  '04151f': 'main',
  '0f2130': 'main',
  '15364e': 'main',
  '1e4b6c': 'main',
  '4a3a41': 'muted',
  '4a343e': 'muted',
  '5c5446': 'muted',
  '333': 'muted',
  '333333': 'muted',
  '999': 'muted',
  '999999': 'muted',
  '8a9a5b': 'muted',
  '7a8a4b': 'muted'
};

function findFiles(dir, filter, res = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.nuxt' || file === '.git' || file === '.output') continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, res);
    } else if (filter.test(filePath)) {
      res.push(filePath);
    }
  }
  return res;
}

const targetFiles = findFiles('.', /\.(vue|js|ts)$/);
let modifiedCount = 0;

for (const file of targetFiles) {
  if (file.includes('tailwind.config.js') || file.includes('replace_colors.js')) continue;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Replace tailwind classes
  content = content.replace(/(bg|text|border|ring|decoration|from|via|to|fill|stroke|shadow|outline)-\[#([0-9a-fA-F]{3,6})\]/g, (match, prefix, hex) => {
    let lowerHex = hex.toLowerCase();
    // expand shorthand hex
    if (lowerHex.length === 3) {
      lowerHex = lowerHex.split('').map(char => char + char).join('');
    }
    if (map[lowerHex]) {
      return prefix + '-' + map[lowerHex];
    }
    return match;
  });

  // 2. Replace raw hex codes that are not in Tailwind brackets
  content = content.replace(/#([0-9a-fA-F]{3,6})/g, (match, hex) => {
    // If preceded by "-\[" or followed by "\]", skip (it's handled by step 1 or is a tailwind arbitrary value not in our map)
    let lowerHex = hex.toLowerCase();
    if (lowerHex.length === 3) {
      lowerHex = lowerHex.split('').map(char => char + char).join('');
    }
    if (map[lowerHex]) {
      let cssVar = '';
      if (['main', 'muted'].includes(map[lowerHex])) {
        cssVar = 'var(--text-' + map[lowerHex] + ')';
      } else if (map[lowerHex] === 'input-bg') {
        cssVar = 'var(--bg-input)';
      } else {
        cssVar = 'var(--color-' + map[lowerHex] + ')';
      }
      return cssVar;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Updated', file);
  }
}
console.log('Modified files:', modifiedCount);
