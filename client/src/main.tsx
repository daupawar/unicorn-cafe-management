
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Wrapping the App component with BrowserRouter to enable routing
    <BrowserRouter>
      <App />
    </BrowserRouter> 
);