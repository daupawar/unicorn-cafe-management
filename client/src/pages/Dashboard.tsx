import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaHome, FaBuilding, FaList, FaMoneyBill, FaUser } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
import axiosInstance from '../api/axiosInstance';
import './Dashboard.css';

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const Dashboard = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle between 'day' and 'month' mode
  const [mode, setMode] = useState<'day' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(5, 7);
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const today = new Date();
    return today.getFullYear().toString();
  });

  // Tabs for sales summary
  const [salesTab, setSalesTab] = useState<'revenue' | 'expense'>('revenue');

  // Expenses and Revenue state
  const [expenses, setExpenses] = useState<{ reason: string; amount: number; date: string }[]>([]);
  const [revenues, setRevenues] = useState<{ amount: number; date: string }[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeBranches, setActiveBranches] = useState(0);

   // Fetch both expenses and revenues using their respective /by-date APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Prepare query params
        let params: any = {};
        if (mode === 'day') {
          const dateObj = new Date(selectedDate);
          params.day = String(dateObj.getDate()).padStart(2, '0');
          params.month = String(dateObj.getMonth() + 1).padStart(2, '0');
          params.year = String(dateObj.getFullYear());
        } else {
          params.month = selectedMonth;
          params.year = selectedYear;
        }

        // Expenses by date
        const expRes = await axiosInstance.get('/expenses/by-date', { params });
        const expList = (expRes.data.expenses || expRes.data).filter((exp: any) => exp.expenses > 0);
        setExpenses(
          expList.map((exp: any) => ({
            reason: exp.reason,
            amount: exp.expenses,
            date: exp.date,
          }))
        );
        setTotalExpenses(expList.reduce((sum: number, exp: any) => sum + exp.expenses, 0));

        // Revenues by date
        const revRes = await axiosInstance.get('/revenue/by-date', { params });
        const revList = (revRes.data.revenues || revRes.data).filter((rev: any) => rev.revenue > 0);
        setRevenues(
          revList.map((rev: any) => ({
            amount: rev.revenue,
            date: rev.date,
          }))
        );
        setTotalRevenue(revRes.data.totalRevenue || revList.reduce((sum: number, rev: any) => sum + (rev.revenue || 0), 0));
      } catch {
        setExpenses([]);
        setRevenues([]);
        setTotalExpenses(0);
        setTotalRevenue(0);
      }
    };
    fetchData();
  }, [selectedDate, selectedMonth, selectedYear, mode]);

  // Dummy: Set active branches (replace with API if needed)
  useEffect(() => {
    setActiveBranches(4);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={{ paddingBottom: 70 }}>
      {/* Dashboard 4 Boxes */}
      <div className="container-fluid">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <p>
          Welcome, your role is <b>{role}</b>.
        </p>

        <div className="row g-3">
          {/* Daily Sales Summary */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">Daily Sales Summary</h5>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select form-select-sm"
                      style={{ width: 90 }}
                      value={mode}
                      onChange={e => setMode(e.target.value as 'day' | 'month')}
                    >
                      <option value="day">Day</option>
                      <option value="month">Month</option>
                    </select>
                    {mode === 'day' ? (
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: 130 }}
                      />
                    ) : (
                      <>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 110 }}
                          value={selectedMonth}
                          onChange={e => setSelectedMonth(e.target.value)}
                        >
                          {months.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="2000"
                          max="2100"
                          value={selectedYear}
                          onChange={e => setSelectedYear(e.target.value)}
                          className="form-control form-control-sm"
                          style={{ width: 70 }}
                        />
                      </>
                    )}
                  </div>
                </div>
                {/* Tabs for Revenue/Expenses */}
                <div className="d-flex mb-3">
                  <button
                    className={`btn btn-sm ${salesTab === 'revenue' ? 'btn-success' : 'btn-outline-success'}`}
                    style={{ flex: 1, borderRadius: '8px 0 0 8px' }}
                    onClick={() => setSalesTab('revenue')}
                  >
                    Revenue
                  </button>
                  <button
                    className={`btn btn-sm ${salesTab === 'expense' ? 'btn-danger' : 'btn-outline-danger'}`}
                    style={{ flex: 1, borderRadius: '0 8px 8px 0' }}
                    onClick={() => setSalesTab('expense')}
                  >
                    Expenses
                  </button>
                </div>
                {/* Tab Content */}
                {salesTab === 'revenue' ? (
                  <div>
                    <div className="mb-2" style={{ fontWeight: 600, color: '#388e3c' }}>
                      Total Revenue: ₹{totalRevenue}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {revenues.length > 0 ? (
                            revenues.map((rev, idx) => (
                              <tr key={idx}>
                                <td>{rev.date?.slice(0, 10)}</td>
                                <td>₹{rev.amount}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-center text-muted">No data</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-2" style={{ fontWeight: 600, color: '#d32f2f' }}>
                      Total Expenses: ₹{totalExpenses}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0">
                        <thead>
                          <tr>
                            <th>Reason</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.length > 0 ? (
                            expenses.map((exp, idx) => (
                              <tr key={idx}>
                                <td>{exp.reason}</td>
                                <td>₹{exp.amount}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-center text-muted">No data</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {/* Grand Total */}
                <div className="mt-3" style={{ fontWeight: 700, fontSize: 16 }}>
                  Grand Total (Revenue - Expenses): <span style={{ color: '#1976d2' }}>₹{totalRevenue - totalExpenses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Expenses & Revenue Pie Chart */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm dashboard-card">
              <div className="card-body d-flex flex-column justify-content-center align-items-center dashboard-card-body">
                <h5 className="card-title">Revenue vs Expenses</h5>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#388e3c' }}>₹{totalRevenue}</div>
                <div className="dashboard-profit-expense-graph">
                  <Pie
                    data={{
                      labels: ['Revenue', 'Expenses'],
                      datasets: [
                        {
                          data: [
                            totalRevenue,
                            totalExpenses
                          ],
                          backgroundColor: ['#388e3c', '#d32f2f'],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom' as const,
                        },
                      },
                      cutout: '60%',
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
                <div className="dashboard-profit-expense-row">
                  <span style={{ color: '#388e3c' }}>Revenue: ₹{totalRevenue}</span>
                  <span style={{ color: '#d32f2f' }}>Expenses: ₹{totalExpenses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Branches */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm dashboard-card">
              <div className="card-body d-flex flex-column justify-content-center align-items-center dashboard-card-body">
                <h5 className="card-title">Active Branches</h5>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#1976d2' }}>{activeBranches}</div>
              </div>
            </div>
          </div>

          {/* Other */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm dashboard-card">
              <div className="card-body d-flex flex-column justify-content-center align-items-center dashboard-card-body">
                <h5 className="card-title">Other</h5>
                <div style={{ fontSize: 18, color: '#888' }}>Add your custom info here</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Menu */}
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
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`text-center flex-fill nav-link${location.pathname === '/dashboard' ? ' active text-primary' : ''}`}
          style={{ fontSize: 18 }}
        >
          <FaHome />
          <div style={{ fontSize: 12 }}>Dashboard</div>
        </Link>

        {/* Branch Management (admin only) */}
        {role === 'admin' && (
          <Link
            to="/add-branches"
            className={`text-center flex-fill nav-link${location.pathname === '/add-branches' ? ' active text-primary' : ''}`}
            style={{ fontSize: 18 }}
          >
            <FaBuilding />
            <div style={{ fontSize: 12 }}>Branches</div>
          </Link>
        )}

        {/* Branch List */}
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

        {/* Expense Management */}
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

        {/* Profile */}
        <Link
          to="/profile"
          className={`text-center flex-fill nav-link${location.pathname === '/profile' ? ' active text-primary' : ''}`}
          style={{ fontSize: 18 }}
        >
          <FaUser />
          <div style={{ fontSize: 12 }}>Profile</div>
        </Link>
      </nav>
    </div>
  );
};

export default Dashboard;