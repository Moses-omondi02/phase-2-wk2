const API_URL = import.meta.env.PROD
  ? 'https://goals-backend-yg6y.onrender.com' 
  : 'http://localhost:3001';             


fetch(`${API_URL}/goals`)
  .then(response => response.json())

export const createGoal = async (goal) => {
  const response = await fetch(`${API_URL}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal)
  });
  return await response.json();
};

export const fetchGoals = async () => {
  const response = await fetch(`${API_URL}/goals`);
  return await response.json();
};

export const updateGoal = async (id, updates) => {
  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return await response.json();
};

export const deleteGoal = async (id) => {
  const response = await fetch(`http://localhost:3001/goals/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
};
  
export const makeDeposit = async (goalId, amount) => {
  const goal = await fetch(`${API_URL}/goals/${goalId}`).then(res => res.json());
  const newAmount = goal.savedAmount + Number(amount);
  
  const response = await fetch(`${API_URL}/goals/${goalId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ savedAmount: newAmount })
  });
  
  await fetch(`${API_URL}/deposits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      goalId,
      amount: Number(amount),
      date: new Date().toISOString()
    })
  });
  
  return await response.json();
};
export const getOverviewStats = (goals) => {
  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;
  
  return { totalGoals, totalSaved, completedGoals };
};