import { Row, Col, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const { Title, Text } = Typography;

export default function WelcomeHeader({
  role,
  selectedBranch,
  onBranchChange
}: {
  role: string | null;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}) {
  const navigate = useNavigate();
  const [branchOptions, setBranchOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axiosInstance.get('/branches');
        const options = (res.data || []).map((b: any) => ({
          label: b.name,
          value: b.name.replace(/\s+/g, '') // Remove all spaces
        }));
        setBranchOptions(options);

        // If no branch is selected, set the first option as default and update localStorage
        if (options.length > 0 && !selectedBranch) {
          onBranchChange(options[0].value);
          localStorage.setItem('selectedBranch', options[0].value);
        }
      } catch {
        setBranchOptions([]);
      }
    };
    fetchBranches();
    // eslint-disable-next-line
  }, []);

  const handleBranchChange = (branch: string) => {
    onBranchChange(branch);
    localStorage.setItem('selectedBranch', branch);
    navigate(0);
  };

  return (
    <Row align="middle" justify="space-between" gutter={8} style={{ padding: 20 }}>
      <Col>
        <Title level={5} style={{ margin: 0 }}>
          Welcome, <Text strong><b>{role}</b></Text>
        </Title>
      </Col>
      {(role === 'admin' || role === 'manager') && (
        <Col>
          <Select
            value={selectedBranch.replace(/\s+/g, '')}
            onChange={handleBranchChange}
            style={{ minWidth: 180 }}
            size="small"
            options={branchOptions}
            placeholder="Select Branch"
            loading={branchOptions.length === 0}
          />
        </Col>
      )}
    </Row>
  );
}