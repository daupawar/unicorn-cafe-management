import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ViewExpenses from '../../components/ViewExpenses';

type Expense = {
  _id?: string;
  date: string;
  revenue: number;
  expenses: number;
  reason?: string;
};

const ITEM_NAMES = [
  "milk",
  "butterkg",
  "rohit salary",
  "sakhr",
  "bun",
  "sbun",
  "sahil salary",
  "chakali-bhakarvadi",
  "chakali",
  "cake",
  "kokam",
  "ebill",
  "disposal material",
  "bhakarwadi",
  "bailley",
  "lemon cup",
  "gas",
  "jaam",
  "osmania",
  "shree biscuit",
  "butter"
];

const AddExpense = () => {
  const [form, setForm] = useState<Expense>({ date: '', revenue: 0, expenses: 0, reason: '' });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchExpenses = async () => {
    try {
      const res = await axiosInstance.get('/expenses');
      setExpenses(res.data);
    } catch {
      setError('Failed to fetch expenses');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await axiosInstance.put(`/expenses/${editingId}`, form);
        setSuccess('Expense updated!');
      } else {
        await axiosInstance.post('/expenses', form);
        setSuccess('Expense added!');
      }
      setForm({ date: '', revenue: 0, expenses: 0, reason: '' });
      setEditingId(null);
      fetchExpenses();
    } catch {
      setError('Failed to save expense');
    }
  };

  const handleEdit = (expense: Expense) => {
    setForm({
      _id: expense._id,
      date: expense.date?.slice(0, 10),
      revenue: expense.revenue,
      expenses: expense.expenses,
      reason: expense.reason || '',
    });
    setEditingId(expense._id || null);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Delete this expense?')) return;
    try {
      await axiosInstance.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch {
      setError('Failed to delete expense');
    }
  };

  // Bulk upload handlers
  const handleBulkUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleBulkFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setError('');
    setSuccess('');
    try {
      await axiosInstance.post('/expenses/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Bulk upload successful!');
      fetchExpenses();
    } catch {
      setError('Bulk upload failed!');
    }
    e.target.value = '';
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
        <h2>{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
        <div className="mb-3">
          <label htmlFor="expense-date" className="form-label">Date</label>
          <input
            id="expense-date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="form-control"
            style={{ marginBottom: 12, padding: 8 }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="expense-amount" className="form-label">Expenses</label>
          <input
            id="expense-amount"
            name="expenses"
            type="number"
            placeholder="Expenses"
            value={form.expenses}
            onChange={handleChange}
            required
            className="form-control"
            style={{ marginBottom: 12, padding: 8 }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="expense-reason" className="form-label">Reason for Expenses</label>
          <select
            id="expense-reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="form-control"
            style={{ marginBottom: 12, padding: 8 }}
            required
          >
            <option value="">Select Reason</option>
            {ITEM_NAMES.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: 10 }}>{editingId ? 'Update' : 'Add'} Expense</button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setForm({ date: '', revenue: 0, expenses: 0, reason: '' }); setEditingId(null); }}
            style={{ width: '100%', padding: 10, marginTop: 8 }}
          >
            Cancel
          </button>
        )}
        {/* Bulk Upload Button */}
        <button
          type="button"
          onClick={handleBulkUploadClick}
          style={{ width: '100%', padding: 10, marginTop: 8, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 4 }}
        >
          Bulk Upload (Excel)
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xls,.xlsx"
          style={{ display: 'none' }}
          onChange={handleBulkFileChange}
        />
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      </form>

      <ViewExpenses
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AddExpense;