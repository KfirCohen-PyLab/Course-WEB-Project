// src/hooks/useTimelineSearch.js
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API;
const SEARCH_HISTORY_ENDPOINT = `${API_BASE_URL}/api/users/search-history`;
const SEARCH_ENDPOINT = `${API_BASE_URL}/search`;

/**
 * Custom hook for managing timeline search logic.
 * Handles fetching data, setting loading/error states, and saving search history.
 *
 * @param {string} query - The search term
 * @param {string} startYear - Start year filter
 * @param {string} endYear - End year filter
 * @param {string} userId - Logged-in user's ID
 * @param {function} navigate - React Router's navigate function
 */
const useTimelineSearch = (query, startYear, endYear, userId, navigate) => {
  const [fullText, setFullText] = useState('');
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setFullText('');
      setTimelineEvents([]);
      setImages([]);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setFullText('');
      setTimelineEvents([]);
      setImages([]);

      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          navigate('/login');
          return;
        }

        const searchUrl = new URL(SEARCH_ENDPOINT);
        searchUrl.searchParams.append('q', query);
        searchUrl.searchParams.append('startYear', startYear);
        searchUrl.searchParams.append('endYear', endYear);

        const response = await fetch(searchUrl, {
          headers: { 'user-email': userEmail },
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFullText(data.extract);
        setTimelineEvents(data.timelineEvents || []);
        setImages(data.images || []);

        if (userId) {
          await fetch(SEARCH_HISTORY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, query }),
          });
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to load timeline: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, startYear, endYear, userId, navigate]);

  return { fullText, timelineEvents, images, loading, error };
};

export default useTimelineSearch;
