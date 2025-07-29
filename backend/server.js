const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-netlify-app.netlify.app']
}));
app.use(express.json());

let db = require('./db.json');
app.get('/goals', (req, res) => res.json(db.goals));

app.post('/goals', (req, res) => {
  const newGoal = { id: Date.now(), ...req.body };
  db.goals.push(newGoal);
  saveDb();
  res.status(201).json(newGoal);
});

app.patch('/goals/:id', (req, res) => {
  const goal = db.goals.find(g => g.id == req.params.id);
  Object.assign(goal, req.body);
  saveDb();
  res.json(goal);
});

function saveDb() {
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));