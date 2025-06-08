import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaList, FaPlus, FaMoneyBill, FaUser, FaUpload, FaFileExcel } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';

const BottomMenu = () => {
  const role = localStorage.getItem('role');
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle plus icon click
  const handlePlusClick = () => {
    setShowMenu((prev) => !prev);
  };

  // Handle Add Expense
  const handleAddExpense = () => {
    setShowMenu(false);
    navigate('/add-expense');
  };

  // Handle Bulk Upload
  const handleBulkUploadClick = () => {
    setShowMenu(false);
    fileInputRef.current?.click();
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axiosInstance.post('/expenses/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Bulk upload successful!');
    } catch (err: any) {
      alert('Bulk upload failed: ' + (err?.response?.data?.message || err.message));
    }
    e.target.value = '';
  };

  return (
    <nav
      className="navbar fixed-bottom navbar-light bg-light border-top"
      style={{
        height: 60,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
        padding: 0,
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Link
        to="/dashboard"
        className={`text-center flex-fill nav-link${location.pathname === '/dashboard' ? ' active text-primary' : ''}`}
        style={{ fontSize: 18 }}
      >
        <FaHome />
        <div style={{ fontSize: 12 }}>Dashboard</div>
      </Link>

      {role === 'admin' && (
        <Link
          to="/add-branches"
          className={`text-center flex-fill nav-link${location.pathname === '/add-branches' ? ' active text-primary' : ''}`}
          style={{ fontSize: 18 }}
        >
          <FaBuilding />
          <div style={{ fontSize: 12 }}>Manage Branches</div>
        </Link>
      )}

   
{/* Floating menu OUTSIDE the pointerEvents:none container */}
{showMenu && (
  <div
    style={{
      position: 'fixed',
      bottom: 70,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      padding: 8,
      minWidth: 160,
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      pointerEvents: 'auto', // menu is clickable
    }}
  >
    <button
      className="btn btn-link text-start"
      style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
      onClick={handleAddExpense}
    >
      <FaMoneyBill style={{ marginRight: 8 }} />
      Add Expense
    </button>
    <button
      className="btn btn-link text-start"
      style={{ textDecoration: 'none', color: '#388e3c', fontWeight: 500 }}
      onClick={handleBulkUploadClick}
    >
      <FaFileExcel style={{ marginRight: 8 }} />
      Bulk Upload
    </button>
    {/* Hidden file input */}
    <input
      ref={fileInputRef}
      type="file"
      accept=".xls,.xlsx"
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />
  </div>
)}

      {(role === 'admin' || role === 'manager') && (
        <Link
          to="/branch-list"
          className={`text-center flex-fill nav-link${location.pathname === '/branch-list' ? ' active text-primary' : ''}`}
          style={{ fontSize: 18 }}
        >
          <FaList />
          <div style={{ fontSize: 12 }}>Branch List</div>
        </Link>
      )}

      {(role === 'admin' || role === 'manager') && (
        <Link
          to="/manage-expense-revenue"
          className={`text-center flex-fill nav-link${location.pathname === '/manage-expense-revenue' ? ' active text-primary' : ''}`}
          style={{ fontSize: 18 }}
        >
          <FaMoneyBill />
          <div style={{ fontSize: 12 }}>Expenses</div>
        </Link>
      )}

      <Link
        to="/profile"
        className={`text-center flex-fill nav-link${location.pathname === '/profile' ? ' active text-primary' : ''}`}
        style={{ fontSize: 18 }}
      >
        <FaUser />
        <div style={{ fontSize: 12 }}>Profile</div>
      </Link>
    </nav>
  );
};

export default BottomMenu;