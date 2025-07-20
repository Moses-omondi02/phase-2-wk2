import { useState, useEffect } from 'react';
import AddGoalForm from './AddGoalForm';
import { fetchGoals, deleteGoal, makeDeposit } from './services/api';
import './App.css';

function App() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:3001/goals');
      const data = await response.json();
      setGoals(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleAddGoal = (newGoal) => {
    setGoals([...goals, newGoal]);
  };

  const handleDeleteGoal = async (id) => {
  const wasDeleted = await deleteGoal(id);
  if (wasDeleted) {
    setGoals(goals.filter(goal => goal.id !== id));
  }
};

  const handleDeposit = async (goalId, amount) => {
    try {
      const updatedGoal = await makeDeposit(goalId, amount);
      setGoals(goals.map(goal => 
        goal.id === goalId ? updatedGoal : goal
      ));
    } catch (error) {
      console.error('Error making deposit:', error);
    }
  };

    const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
    const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;

  if (loading) return <div>Loading goals...</div>;

  return (
    <div className="app">
      <h1>My  Saving Plan</h1>
      <div className="overview">
        <div className="stat">
          <h3>Total Goals</h3>
          <p>{totalGoals}</p>
        </div>
        <div className="stat">
          <h3>Total Saved</h3>
          <p>${totalSaved.toLocaleString()}</p>
        </div>
        <div className="stat">
          <h3>Completed</h3>
          <p>{completedGoals}</p>
        </div>
      </div>
      
      <AddGoalForm onAddGoal={handleAddGoal} />
      
      <div className="goals-container">
        {goals.map(goal => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.savedAmount;

          return (
            <div key={goal.id} className="goal-card">
              <h2>{goal.name}</h2>
              <p>Target: ${goal.targetAmount}</p>
              <p>Saved: ${goal.savedAmount}</p>
              <p>Remaining: ${remaining}</p>
              
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="deposit-form">
                <input
                  type="number"
                  placeholder="Amount"
                  min="1"
                  id={`deposit-${goal.id}`}
                />
                <button 
                  onClick={() => {
                  const amount = document.getElementById(`deposit-${goal.id}`).value;
                    if (amount) handleDeposit(goal.id, amount);
                  }}
                >
                  Deposit
                </button>
              </div>
              
              <button 
                onClick={() => handleDeleteGoal(goal.id)}
                className="delete-button"
              >
                Delete Goal
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;