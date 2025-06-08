import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

type Expense = {
  _id?: string;
  date: string;
  revenue: number;
  expenses: number;
  reason?: string;
};

const ViewExpenses = ({
  expenses: propsExpenses,
  onEdit,
  onDelete,
}: {
  expenses?: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id?: string) => void;
}) => {
  const [expenses, setExpenses] = useState<Expense[]>(propsExpenses || []);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!propsExpenses) {
      const fetchExpenses = async () => {
        try {
          const res = await axiosInstance.get('/expenses');
          setExpenses(res.data);
        } catch {
          setError('Failed to fetch expenses');
        }
      };
      fetchExpenses();
    } else {
      setExpenses(propsExpenses);
    }
  }, [propsExpenses]);

  // Internal delete handler (if onDelete not provided)
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Delete this expense?')) return;
    try {
      await axiosInstance.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
      if (onDelete) onDelete(id);
    } catch {
      setError('Failed to delete expense');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <h2>Expenses</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Revenue</th>
            <th>Expenses</th>
            <th>Reason</th>
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp._id}>
              <td>{exp.date?.slice(0, 10)}</td>
              <td>{exp.revenue}</td>
              <td>{exp.expenses}</td>
              <td>{exp.reason}</td>
              {(onEdit || onDelete) && (
                <td>
                  {onEdit && (
                    <button onClick={() => onEdit(exp)} style={{ marginRight: 8 }}>Edit</button>
                  )}
                  <button onClick={() => (onDelete ? onDelete(exp._id) : handleDelete(exp._id))}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default ViewExpenses;