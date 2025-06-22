import React from 'react';

const Loading = ({ query }) => {
  return (
    <div className="loading-container">
      <p className="search-query-display">
        Searching for: <span className="query-text">{query}</span>
      </p>
      <p className="loading-message">Loading timeline...</p>
    </div>
  );
};

export default Loading;