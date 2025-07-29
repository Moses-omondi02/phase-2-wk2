const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); 
const app = express();
const PORT = process.env.PORT || 3001; 


const allowedOrigins = [
  'http://localhost:3000',
  'my-week-2.netlify.app' 
];

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ 
    status: 'API is running',
    availableEndpoints: [
      'GET /goals',
      'POST /goals',
      'PATCH /goals/:id'
    ]
  });
});


const dbPath = path.join(__dirname, 'db.json');
let db = require(dbPath);

app.get('/goals', (req, res) => res.json(db.goals));

app.post('/goals', (req, res) => {
  const newGoal = { id: Date.now(), ...req.body };
  db.goals.push(newGoal);
  saveDb();
  res.status(201).json(newGoal);
});

app.patch('/goals/:id', (req, res) => {
  const goal = db.goals.find(g => g.id == req.params.id);
  if (!goal) return res.status(404).json({ error: 'Goal not found' }); 
    
  Object.assign(goal, req.body);
  saveDb();
  res.json(goal);
});
app.get('/', (req, res) => {
  res.json({ 
    status: 'API is working',
    endpoints: ['/goals', '/goals/:id'] 
  });
});

function saveDb() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving database:', err);
    throw err;
  }
}

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));