import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Card, Typography, Button, Descriptions, Spin } from 'antd';

const { Title } = Typography;

type User = {
  username?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!user) {
    return (
      <Card style={{ maxWidth: 400, margin: '40px auto', borderRadius: 8 }}>
        <Title level={4}>Could not load profile.</Title>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 0 }}>
      <Card bordered style={{ borderRadius: 8 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          My Profile
        </Title>
        <Descriptions column={1} size="middle" bordered>
          <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
        </Descriptions>
        <Button
          type="primary"
          danger
          block
          style={{ marginTop: 32, fontWeight: 600, fontSize: 16 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Profile;