const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'https://my-week-2.netlify.app', 
  'http://localhost:3000',         
  'https://www.your-custom-domain.com' 
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (!origin) return next();
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin'); 
  
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
  }
  
  next();
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This is protected CORS data' });
});

app.get('/', (req, res) => {
  res.json({
    status: 'Server is running',
    cors: {
      allowedOrigins,
      documentation: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
});