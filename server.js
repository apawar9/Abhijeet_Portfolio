const http = require('http');
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

function assemblePage() {
  return componentOrder
    .map(name => fs.readFileSync(path.join(__dirname, 'components', name), 'utf8'))
    .join('');
}

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(assemblePage());
    return;
  }

  // Serve static files from the public directory
  const filePath = path.join(__dirname, 'public', req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentTypes = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.html': 'text/html',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg'
    };

    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

if (!process.argv.includes('--test')) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = server;
