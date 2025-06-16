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

  // Handle requests for assets separately
  if (req.url.startsWith('/assets/')) {
    const assetPath = path.join(__dirname, req.url);
    fs.readFile(assetPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Asset Not Found');
        return;
      }

      const ext = path.extname(assetPath);
      const contentTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.html': 'text/html',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.pdf': 'application/pdf'
      };

      const headers = {
        'Content-Type': contentTypes[ext] || 'application/octet-stream'
      };

      res.writeHead(200, headers);
      res.end(data);
    });
    return;
  }

  // Serve other static files from the public directory
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
      '.jpeg': 'image/jpeg',
      '.pdf': 'application/pdf'
    };

    const headers = {
      'Content-Type': contentTypes[ext] || 'application/octet-stream'
    };

    // For PDF files, add content-disposition to open in browser
    if (ext === '.pdf') {
      headers['Content-Disposition'] = 'inline';
    }

    res.writeHead(200, headers);
    res.end(data);
  });
});

// Watch for changes in components directory
const componentsDir = path.join(__dirname, 'components');
fs.watch(componentsDir, (eventType, filename) => {
  if (filename) {
    console.log(`File ${filename} changed. Reloading...`);
    // Clear require cache for the changed file
    const filePath = path.join(componentsDir, filename);
    delete require.cache[require.resolve(filePath)];
  }
});

if (!process.argv.includes('--test')) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = server;
