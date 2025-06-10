import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';

type Expense = {
  _id?: string;
  date: string;
  amount?: number;
  revenue?: number;
  expenses?: number;
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
      message.success('Expense deleted!');
    } catch {
      setError('Failed to delete expense');
    }
  };

  // Columns for Ant Design Table
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => date?.slice(0, 10),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Expense) =>
        amount ?? record.expenses ?? record.revenue ?? '-',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    (onEdit || onDelete)
      ? {
          title: 'Actions',
          key: 'actions',
          align: 'center' as const,
          render: (_: any, record: Expense) => (
            <Space size="middle">
              {onEdit && (
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => onEdit(record)}
                />
              )}
              <Popconfirm
                title="Are you sure to delete this expense?"
                onConfirm={() =>
                  onDelete ? onDelete(record._id) : handleDelete(record._id)
                }
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                />
              </Popconfirm>
            </Space>
          ),
          responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        }
      : {},
  ].filter(Boolean);

  return (
    
    <div style={{ width: '100%', margin: '0 auto', padding: 0 }}>
      
      <Table
        columns={columns}
        dataSource={expenses}
        rowKey={record => record._id || record.date + (record.amount ?? record.expenses ?? record.revenue ?? '')}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        size="middle"
        scroll={{ x: true }}
        bordered
      />
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default ViewExpenses;