import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SearchBar from '../components/searchTimeline/searchBar';
import Results from '../components/searchTimeline/Results';
import Loading from '../components/searchTimeline/Loading';
import ErrorBox from '../components/searchTimeline/ErrorBox';
import useTimelineSearch from '../hooks/useTimelineSearch';
import '../style/pagestyle/Search.css';

/**
 * Search Component
 *
 * Timeline search page allowing users to query events with optional year filters.
 * Retrieves results from previous searches in the database or fetches new data using
 * external APIs: Wikipedia (text), Gemini (timeline generation), and Unsplash (images).
 *
 * Features:
 * - Syncs search parameters with the URL for sharable links
 * - Requires user authentication (redirects to login if not)
 * - Displays full text, events, and images related to the query
 * - Saves new searches to the user's history
 * - Distributes images between left/right sides for visual layout
 *
 * Hooks:
 * - useState: Manage UI state like query, filters, results, loading, error
 * - useEffect: for syncing and fetching
 * - useCallback: for performance
 */

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const userId = localStorage.getItem('userId');

  // Sync URL parameters to component state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get('query') || '';
    const start = params.get('startYear') || '';
    const end = params.get('endYear') || '';

    // Only update state if values from URL are different to prevent infinite loops
    if (queryFromUrl !== query || start !== startYear || end !== endYear) {
      setQuery(queryFromUrl);
      setStartYear(start);
      setEndYear(end);
    }
  }, [location.search, query, startYear, endYear]); 

  // Use custom hook for data fetching and state management related to the search results
  const { fullText, timelineEvents, images, loading, error } = useTimelineSearch(
    query,
    startYear,
    endYear,
    userId,
    navigate
  );

  /**
   * Distributes images between left and right sides for display.
   * Uses useCallback for memoization.
   * @param {string} side - 'left' or 'right'
   * @returns {Array} - Array of image objects for the specified side.
   */
  const getSideImages = useCallback(
    (side) => {
      const filteredImages = images.filter((img) => img && img.src);
      if (!filteredImages.length) return [];
      const half = Math.ceil(filteredImages.length / 2);
      return side === 'left' ? filteredImages.slice(0, half) : filteredImages.slice(half);
    },
    [images]
  );

  /**
   * Handles the search submission, updating URL parameters.
   * Uses useCallback for memoization.
   * @param {object} searchParams - Object containing query, startYear, and endYear.
   */
  const handleSearch = useCallback(
    ({ query: newQuery, startYear: newStartYear, endYear: newEndYear }) => {
      const params = new URLSearchParams();
      if (newQuery) params.append('query', newQuery);
      if (newStartYear) params.append('startYear', newStartYear);
      if (newEndYear) params.append('endYear', newEndYear);

      navigate(`/search?${params.toString()}`);
    },
    [navigate]
  );

  return (
    <div className="search-page">
      <Header />
      <div className="search-container">
      <h1 className="app-title">Timeline Search</h1>
      <SearchBar onSearch={handleSearch} initialQuery={query} initialStartYear={startYear} initialEndYear={endYear} />
      {loading && query && <Loading query={query} />}
      {error && <ErrorBox error={error} />}
      {!loading && !error && query && (
        <Results
          query={query}
          startYear={startYear}
          endYear={endYear}
          fullText={fullText}
          timelineEvents={timelineEvents}
          images={images}
          getSideImages={getSideImages}
        />
      )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;