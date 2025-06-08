// filepath: c:\Users\dell\Downloads\New folder (2)\cafe-daily-expense-manager\client\cafe managment\src\pages\ExpenseRevenueParent.tsx
import { useState } from 'react';
import AddExpense from './AddExpense';
import AddRevenue from './AddRevenue';

const ExpenseRevenueParent = () => {
  const [activeTab, setActiveTab] = useState<'expense' | 'revenue'>('expense');

  return (
    <div>
      <div style={{ maxWidth: 400, margin: '40px auto 0 auto', display: 'flex', borderBottom: '1px solid #eee' }}>
        <button
          className={activeTab === 'expense' ? 'btn btn-primary' : 'btn btn-light'}
          style={{ flex: 1, borderRadius: '8px 8px 0 0', border: 'none' }}
          onClick={() => setActiveTab('expense')}
        >
          Expenses
        </button>
        <button
          className={activeTab === 'revenue' ? 'btn btn-primary' : 'btn btn-light'}
          style={{ flex: 1, borderRadius: '8px 8px 0 0', border: 'none' }}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </button>
      </div>
      <div>
        {activeTab === 'expense' && <AddExpense />}
        {activeTab === 'revenue' && <AddRevenue />}
      </div>
    </div>
  );
};

export default ExpenseRevenueParent;