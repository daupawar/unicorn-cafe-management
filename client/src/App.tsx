import { useEffect } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import { routes } from './routes/routes';
import BottomMenu from './components/BottomMenu';

function App() {
  const element = useRoutes(routes);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && window.location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const token = localStorage.getItem('token');

  return (
    <>
      {element}
      {token && <BottomMenu />}
    </>
  );
}

export default App;