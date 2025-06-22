import React, { useState } from 'react';
import '../../style/componentsStyle/searchBar.css';
import useSearchHistory from '../../hooks/useSearchHistory';

function SearchBar({ onSearch }) {
  const userId = localStorage.getItem('userId');
  const { history: searchHistory } = useSearchHistory(userId);

  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  const fetchSuggestions = (input) => {
    if (!userId || !input.trim()) {
      setSuggestions([]);
      return;
    }
    const filteredSuggestions = searchHistory.filter(historyTerm =>
      historyTerm.toLowerCase().startsWith(input.toLowerCase()) &&
      historyTerm.toLowerCase() !== input.toLowerCase()
    );
    setSuggestions(filteredSuggestions);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setTerm(suggestion);
    setShowSuggestions(false);
    onSearch({
      query: suggestion,
      startYear: startYear.trim(),
      endYear: endYear.trim()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    setShowSuggestions(false);
    onSearch({
      query: term.trim(),
      startYear: startYear.trim(),
      endYear: endYear.trim()
    });
  };

  return (
    <div className="search-bar">
      <form className="search-bar-form" onSubmit={handleSubmit}>
        <div className="search-term">
          <input
            type="text"
            value={term}
            onChange={handleInputChange}
            placeholder="Search for a topic..."
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-scroll">
              <div className="suggestions-inner">
                {suggestions.map((suggestion, idx) => (
                  <span
                    key={idx}
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="year-range">
          <input
            type="text"
            value={startYear}
            onChange={e => setStartYear(e.target.value)}
            placeholder="Start Year"
          />
          <input
            type="text"
            value={endYear}
            onChange={e => setEndYear(e.target.value)}
            placeholder="End Year"
          />
        </div>
        <button type="submit" className="general-button">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;