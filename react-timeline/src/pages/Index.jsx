import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../style/pagestyle/main.css';

/**
 * Index Component
 *
 * This is the landing page of the HistoryFlow app, welcoming users and providing
 * navigation options to either login or register.
 *
 * Features:
 * - Displays a welcome message and app description
 * - Provides two primary action buttons: Login and Register
 * - Uses React Router's useNavigate hook for client-side navigation
 *
 * Hooks used:
 * - useNavigate: To programmatically navigate to login or register routes
 */

const Index = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/register');

  return (
    <div className="index-page">
      <Header />
      <main className="index-content">
        <h1 className="app-title">Welcome to HistoryFlow</h1>
        
        <div className="index-buttons-container">
          <button onClick={goToLogin} className="index-bubble-button primary">
            Login
          </button>

          <button onClick={goToRegister} className="index-bubble-button secondary">
            Register
          </button>
        </div>

        <section className="index-description">
          <p>Discover historical events and timelines through our interactive search platform.</p>
          <p>Login to access your personalized timeline searches or register to get started!</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Index;