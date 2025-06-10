import { useEffect, useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import WelcomeHeader from "./components/WelcomeHeader";
import BottomMenu from "./components/BottomMenu";
import { routes } from "./routes/routes";

function App() {
  const role = localStorage.getItem('role');
  const element = useRoutes(routes);
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<string>(() => localStorage.getItem('selectedBranch') || branchOptions[0].value);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    localStorage.setItem('selectedBranch', value);
  };

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
      {token && (
        <WelcomeHeader
          role={role}
          selectedBranch={selectedBranch}
          onBranchChange={handleBranchChange}
        />
      )}
      {element}
      {token && <BottomMenu />}
    </>
  );
}

export default App;