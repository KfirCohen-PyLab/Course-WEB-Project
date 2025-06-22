import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../style/pagestyle/main.css';

/**
 * Login Component
 *
 * This component is a login form that lets users enter email and password to authenticate.
 * On success, it saves user data to localStorage and redirects to the choose page.
 *
 * Features:
 * - Displays error messages on failed login or server connection issues
 * - Navigates to registration page via a clickable link for new users
 *
 * Hooks used:
 * - useState: Manages form inputs, loading state, and error messages
 * - useNavigate: Programmatic navigation on login success or link click
 */

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        navigate('/choose');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Error connecting to server');
    }
  };
  
  return (
    <div className="login-page">
      <Header />
      <div className="form-container">
        <h2>Login to Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button id="btnLogin" type="submit" className="general-button" disabled={isLoading }>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="register-link">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="link">
            Register here
          </span>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
