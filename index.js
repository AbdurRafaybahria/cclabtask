// Main entry point for Vercel
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');

const server = createServer((req, res) => {
  // Redirect root to index.html
  if (req.url === '/') {
    const indexPath = path.join(__dirname, 'pages', 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexContent);
    return;
  }
  
  // Handle API requests
  if (req.url.startsWith('/api/')) {
    // Let Vercel handle API routes through vercel.json configuration
    res.writeHead(404);
    res.end('API route not found');
    return;
  }
  
  // For other routes, try to serve from pages directory
  const filePath = path.join(__dirname, 'pages', req.url.substring(1) + '.html');
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('File not found');
    }
  } catch (error) {
    res.writeHead(500);
    res.end('Server error');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Export for Vercel
module.exports = server;
