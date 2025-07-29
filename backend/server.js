const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'https://my-week-2.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Your routes
app.get('/goals', (req, res) => {
  res.json([{id: 1, name: "Sample goal"}]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});