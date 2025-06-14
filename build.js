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

const output = componentOrder
  .map(name => fs.readFileSync(path.join(__dirname, 'components', name), 'utf8'))
  .join('');

fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), output);
console.log('Built public/index.html');

