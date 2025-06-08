import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import BranchList from '../components/BranchList';

type Branch = {
  _id?: string;
  name: string;
  location: string;
  owner: string;
  address: string;
  openingDate: string;
  isActive: boolean;
  comment: string;
  email: string;
  username?: string;
  password?: string;
};

const emptyBranch: Branch = {
  name: '',
  location: '',
  owner: '',
  address: '',
  openingDate: '',
  isActive: true,
  comment: '',
  email: '',
};

const BranchManagement = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [form, setForm] = useState<Branch>(emptyBranch);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);

  const token = localStorage.getItem('token');

  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get('http://localhost:5000/api/branches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(res.data);
    } catch {
      setError('Failed to fetch branches');
    }
  };

  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let response;
      if (editingId) {
        response = await axiosInstance.put(
          `http://localhost:5000/api/branches/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCredentials(null); // Don't show credentials on edit
      } else {
        response = await axiosInstance.post(
          'http://localhost:5000/api/branches',
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data && response.data.credentials) {
          setCredentials(response.data.credentials);
        } else {
          setCredentials(null);
        }
      }
      setForm(emptyBranch);
      setEditingId(null);
      fetchBranches();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save branch');
    }
  };

  const handleEdit = (branch: Branch) => {
    setForm({ ...branch, openingDate: branch.openingDate?.slice(0, 10) });
    setEditingId(branch._id || null);
    setCredentials(null); // Hide credentials card on edit
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Delete this branch?')) return;
    try {
      await axiosInstance.delete(`http://localhost:5000/api/branches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBranches();
    } catch {
      setError('Failed to delete branch');
    }
  };

  const handleCancel = () => {
    setForm(emptyBranch);
    setEditingId(null);
    setError('');
    setCredentials(null); // Hide credentials card on cancel
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <h2>Branch Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
        <input name="name" placeholder="Branch Name" value={form.name} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <input name="owner" placeholder="Owner" value={form.owner} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <input name="openingDate" type="date" value={form.openingDate} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <label>
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} style={{ marginRight: 8 }} />
          Active
        </label>
        <textarea name="comment" placeholder="Comment" value={form.comment} onChange={handleChange} style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <div>
          <button type="submit" style={{ marginRight: 8 }}>{editingId ? 'Update' : 'Add'} Branch</button>
          {editingId && <button type="button" onClick={handleCancel}>Cancel</button>}
        </div>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </form>

      {credentials && (
        <div style={{
          border: '2px solid #4caf50',
          borderRadius: 8,
          padding: 16,
          margin: '16px 0',
          background: '#f6fff6'
        }}>
          <h3>Branch Credentials</h3>
          <div><b>Username:</b> {credentials.username}</div>
          <div><b>Password:</b> {credentials.password}</div>
        </div>
      )}

      <BranchList branches={branches} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default BranchManagement;