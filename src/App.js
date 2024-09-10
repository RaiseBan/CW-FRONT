import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authentication" element={<AuthPage/>}/>
        <Route path="/" element={<HomePage/>}/>
      </Routes>
    </Router>
  );
}
