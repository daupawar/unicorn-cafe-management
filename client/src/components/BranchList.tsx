import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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

const BranchList = ({
  branches,
  onEdit,
  onDelete,
}: {
  branches: Branch[];
  onEdit?: (branch: Branch) => void;
  onDelete?: (id?: string) => void;
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      ellipsis: true,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Opening Date',
      dataIndex: 'openingDate',
      key: 'openingDate',
      render: (date: string) => date?.slice(0, 10),
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (active ? 'Yes' : 'No'),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      responsive: ['md', 'lg', 'xl'],
    },
    (onEdit || onDelete)
      ? {
          title: 'Actions',
          key: 'actions',
          align: 'center' as const,
          render: (_: any, record: Branch) => (
            <Space size="middle">
              {onEdit && (
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => onEdit(record)}
                />
              )}
              {onDelete && (
                <Popconfirm
                  title="Are you sure to delete this branch?"
                  onConfirm={() => onDelete(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                  />
                </Popconfirm>
              )}
            </Space>
          ),
          responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        }
      : {},
  ].filter(Boolean);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table
        columns={columns}
        dataSource={branches}
        rowKey={record => record._id || record.name + record.location}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        size="middle"
        scroll={{ x: 900 }}
        bordered
      />
    </div>
  );
};

export default BranchList;