const fs = require('fs');
const path = require('path');

const componentOrder = [
  'head.html',
  'header.html',
  'hero.html',
  'about.html',
  'experience.html',
  'projects.html',
  'education.html',
  'footer.html',
  'scripts.html',
  'end.html'
];

const componentsDir = path.join(__dirname, 'components');
const assetsDir = path.join(__dirname, 'assets');
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// 1. Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// 2. Assemble the main index.html
function assemblePage() {
  return componentOrder
    .map(name => {
      const filePath = path.join(componentsDir, name);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      } else {
        console.warn(`Component not found: ${name}`);
        return '';
      }
    })
    .join('');
}

const fullHtml = assemblePage();
fs.writeFileSync(path.join(distDir, 'index.html'), fullHtml, 'utf8');
console.log('index.html assembled and written to dist/');

// 3. Copy styles.css
const stylesCssPath = path.join(__dirname, 'styles.css');
if (fs.existsSync(stylesCssPath)) {
  fs.copyFileSync(stylesCssPath, path.join(distDir, 'styles.css'));
  console.log('styles.css copied to dist/');
} else {
  console.warn('styles.css not found, skipping copy.');
}

// 4. Copy assets directory
if (fs.existsSync(assetsDir)) {
  fs.cpSync(assetsDir, path.join(distDir, 'assets'), { recursive: true });
  console.log('assets/ copied to dist/');
} else {
  console.warn('assets/ directory not found, skipping copy.');
}

// 5. Copy resume PDF from public directory
const resumePath = path.join(publicDir, 'Abhijeet_Pawar_Resume.pdf');
if (fs.existsSync(resumePath)) {
  fs.copyFileSync(resumePath, path.join(distDir, 'Abhijeet_Pawar_Resume.pdf'));
  console.log('Abhijeet_Pawar_Resume.pdf copied to dist/');
} else {
  console.warn('Abhijeet_Pawar_Resume.pdf not found in public/, skipping copy.');
}

console.log('Build process completed!');

