import React from 'react';

const SearchHistory = ({ searches, loading, error, onSelect }) => (
  <div className="search-history">
    <h3>Recent Searches ({searches.length})</h3>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="error-message">{error}</p>
    ) : searches.length === 0 ? (
      <p>No searches yet</p>
    ) : (
      <div className="search-list">
        {searches.map((term, index) => (
          <div
            key={index}
            className="search-item"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect && onSelect(term)}
          >
            <p className="search-term">{term}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default SearchHistory;