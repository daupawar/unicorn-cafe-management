import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance';

type Revenue = {
  _id?: string;
  date: string;
  revenue: number;
  reason?: string;
};

const AddRevenue = () => {
  const [form, setForm] = useState<Revenue>({ date: '', revenue: 0 });
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRevenues = async () => {
    try {
      const res = await axiosInstance.get('/revenue');
      setRevenues(res.data);
    } catch {
      setError('Failed to fetch revenue');
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await axiosInstance.put(`/revenue/${editingId}`, form);
        setSuccess('Revenue updated!');
      } else {
        await axiosInstance.post('/revenue', form);
        setSuccess('Revenue added!');
      }
      setForm({ date: '', revenue: 0 });
      setEditingId(null);
      fetchRevenues();
    } catch {
      setError('Failed to save revenue');
    }
  };

  const handleEdit = (revenue: Revenue) => {
    setForm({
      _id: revenue._id,
      date: revenue.date?.slice(0, 10),
      revenue: revenue.revenue,
    });
    setEditingId(revenue._id || null);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Delete this revenue?')) return;
    try {
      await axiosInstance.delete(`/revenue/${id}`);
      fetchRevenues();
    } catch {
      setError('Failed to delete revenue');
    }
  };

  // Bulk upload handlers (optional, can be removed if not needed)
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
      await axiosInstance.post('/revenue/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Bulk upload successful!');
      fetchRevenues();
    } catch {
      setError('Bulk upload failed!');
    }
    e.target.value = '';
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
        <h2>{editingId ? 'Edit Revenue' : 'Add Revenue'}</h2>
        <div className="mb-3">
          <label htmlFor="revenue-date" className="form-label">Date</label>
          <input
            id="revenue-date"
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
          <label htmlFor="revenue-amount" className="form-label">Revenue</label>
          <input
            id="revenue-amount"
            name="revenue"
            type="number"
            placeholder="Revenue"
            value={form.revenue}
            onChange={handleChange}
            required
            className="form-control"
            style={{ marginBottom: 12, padding: 8 }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10 }}>{editingId ? 'Update' : 'Add'} Revenue</button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setForm({ date: '', revenue: 0 }); setEditingId(null); }}
            style={{ width: '100%', padding: 10, marginTop: 8 }}
          >
            Cancel
          </button>
        )}
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

      {/* Revenue List */}
      <div style={{ maxWidth: 700, margin: '30px auto' }}>
        <h4>Revenue List</h4>
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {revenues.length > 0 ? (
                revenues.map((rev) => (
                  <tr key={rev._id}>
                    <td>{rev.date?.slice(0, 10)}</td>
                    <td>₹{rev.revenue}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(rev)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rev._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-muted">No revenue records</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddRevenue;