import { useState } from 'react';

export default function DepositForm({ goalId, onDeposit }) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    
    setIsSubmitting(true);
    try {
      await onDeposit(goalId, amount);
      setAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="deposit-form">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Deposit amount"
        min="0.01"
        step="0.01"
        required
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Add Deposit'}
      </button>
    </form>
  );
}