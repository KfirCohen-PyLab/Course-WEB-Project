import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Profile from './pages/Profile';
import TimelinePage from './pages/TimelinePage';
import BubblePage from './pages/bubble';
import Choose from './pages/choose';



function App() {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        navigator.sendBeacon(
          'http://localhost:4000/api/users/logout',
          JSON.stringify({ email })
        );
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/bubble" element={<BubblePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
