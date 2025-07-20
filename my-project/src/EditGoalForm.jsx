import { useState } from 'react';

export default function EditGoalForm({ goal, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    name: goal.name,
    targetAmount: goal.targetAmount,
    category: goal.category,
    deadline: goal.deadline
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(goal.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-goal-form">
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
        Target Amount:
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
          <option value="Education">Education</option>
          <option value="Home">Home</option>
          <option value="Vehicle">Vehicle</option>
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
        />
      </label>
      
      <div className="form-actions">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}