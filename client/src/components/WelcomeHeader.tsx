import { Row, Col, Select, Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

const branchOptions = [
  { label: 'Rankala', value: 'Rankala' },
  { label: 'Dhyanchand Hockey Stadium', value: 'Dhyanchand Hockey Stadium' }
];

export default function WelcomeHeader({
  role,
  selectedBranch,
  onBranchChange
}: {
  role: string | null;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}) {
  return (
      
      <Row align="middle" justify="space-between" gutter={8} style={{ padding: 20 }}>
        <Col>
          <Title level={5} style={{ margin: 0 }}>
            Welcome, <Text strong><b>{role}</b></Text> to Admin
          </Title>
        </Col>
        {role === 'admin' && (
          <Col>
            <Select
              value={selectedBranch}
              onChange={onBranchChange}
              style={{ minWidth: 180 }}
              size="small"
              options={branchOptions}
              placeholder="Select Branch"
            />
          </Col>
        )}
      </Row>
   
  );
}