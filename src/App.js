import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <BrowserRouter>
      <SignUpPage />
    </BrowserRouter>
  );
}

export default App;
