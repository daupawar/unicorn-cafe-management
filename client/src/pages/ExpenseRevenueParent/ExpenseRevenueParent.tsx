import { useState } from 'react';
import AddExpense from './AddExpense';
import AddRevenue from './AddRevenue';
import { Tabs, Card } from 'antd';

const ExpenseRevenueParent = () => {
  const [activeTab, setActiveTab] = useState<'expense' | 'revenue'>('expense');

  const tabItems = [
    {
      key: 'expense',
      label: 'Expenses',
      children: <AddExpense />,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      children: <AddRevenue />,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', width: '100%', paddingBottom:90 }}>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key as 'expense' | 'revenue')}
          items={tabItems}
          tabBarGutter={32}
          type="line"
        />
      </Card>
    </div>
  );
};

export default ExpenseRevenueParent;