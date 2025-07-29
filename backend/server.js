const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',
  'https://my-week-2.netlify.app', 
  'https://your-netlify-app.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
   
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

let db;
try {
  db = require(DB_PATH);
} catch (err) {
  console.error('Failed to load database:', err);
  db = { goals: [] }; 
}

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Failed to save database:', err);
    throw err;
  }
}

app.get('/goals', (req, res) => {
  try {
    res.json(db.goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/goals', (req, res) => {
  try {
    if (!req.body.name || !req.body.targetAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newGoal = { 
      id: Date.now().toString(), 
      createdAt: new Date().toISOString(),
      savedAmount: 0,
      ...req.body 
    };
    
    db.goals.push(newGoal);
    saveDb();
    res.status(201).json(newGoal);
  } catch (err) {
    console.error('Error creating goal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/goals/:id', (req, res) => {
  try {
    const goal = db.goals.find(g => g.id === req.params.id);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    Object.assign(goal, req.body);
    goal.updatedAt = new Date().toISOString();
    saveDb();
    res.json(goal);
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/goals/:id', (req, res) => {
  try {
    const index = db.goals.findIndex(g => g.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    db.goals.splice(index, 1);
    saveDb();
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting goal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});