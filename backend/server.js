const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;


const allowedOrigins = [
  'https://my-week-2.netlify.app', 
  'http://localhost:3000'          
];

app.use(cors({
  origin: function (origin, callback) {
   
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `Origin ${origin} not allowed by CORS`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');
let db = JSON.parse(fs.readFileSync(dbPath));

app.get('/', (req, res) => {
  res.json({ 
    status: 'API is running',
    endpoints: ['/goals']
  });
});

app.get('/goals', (req, res) => {
  res.json(db.goals);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});