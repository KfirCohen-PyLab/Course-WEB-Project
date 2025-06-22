import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../style/pagestyle/choose.css';

/**
 * Choose Component
 *
 * This component provides a simple navigation interface for users to choose their experience path:
 * - Explore Bubbles: Navigate to the interactive bubble page
 * - Explore Timeline: Navigate to the timeline search page
 * - Create Your Own Timeline: Navigate to the custom timeline creation page
 *
 * Features:
 * - Uses buttons styled as arrows for a clear UX
 * - Uses React Router's useNavigate hook for client-side navigation
 *
 * Hooks used:
 * - useNavigate: For programmatic navigation between routes
 */

const Choose = () => {
  const navigate = useNavigate();

  const goToBubbles = () => navigate('/bubble');
  const goToTimelineSearch = () => navigate('/search');
  const goToCreateTimeline = () => navigate('/custom-timeline');

  return (
    <div className="choose-page">
      <Header />
      <main className="choose-content">
        <h1 className="app-title">Choose Your Experience</h1>
        <div className="arrow-buttons-vertical">
          <button className="arrow-block down" onClick={goToBubbles}>
            EXPLORE BUBBLES
          </button>
          <button className="arrow-block up" onClick={goToTimelineSearch}>
            EXPLORE TIMELINE
          </button>
          <button className="arrow-block down" onClick={goToCreateTimeline}>
            CREATE YOUR OWN TIMELINE
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Choose;
