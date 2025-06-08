import { useEffect, useState } from 'react';
import BranchList from '../components/BranchList';
import axiosInstance from '../api/axiosInstance';

type Branch = {
  _id?: string;
  name: string;
  location: string;
  owner: string;
  address: string;
  openingDate: string;
  isActive: boolean;
  comment: string;
};

const BranchListPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axiosInstance.get('/branches');
        setBranches(res.data);
      } catch {
        setError('Failed to fetch branches');
      }
    };
    fetchBranches();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <h2>Branch List</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <BranchList branches={branches} />
    </div>
  );
};

export default BranchListPage;