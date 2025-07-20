import { useState } from 'react';

export default function AddGoalForm({ onAddGoal }) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    category: 'Savings',
    deadline: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddGoal({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      savedAmount: 0,
      createdAt: new Date().toISOString()
    });
    setFormData({
      name: '',
      targetAmount: '',
      category: 'Savings',
      deadline: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-goal-form">
      <h2>Add New Goal</h2>
      
      <label>
        Goal Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      
      <label>
        Target Amount ($):
        <input
          type="number"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleChange}
          min="1"
          step="0.01"
          required
        />
      </label>
      
      <label>
        Category:
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Savings">Savings</option>
          <option value="Travel">Travel</option>
          <option value="Emergency">Emergency Fund</option>
        </select>
      </label>
      
      <label>
        Deadline:
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </label>
      
      <button type="submit">Add Goal</button>
    </form>
  );
}

