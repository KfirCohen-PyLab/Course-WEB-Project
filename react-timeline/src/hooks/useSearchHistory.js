import { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API || 'http://localhost:5000';

export default function useSearchHistory(userId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setHistory([]);
      return;
    }
    setLoading(true);
    setError('');
    fetch(`${API_BASE}/api/users/search-history/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch search history');
        return res.json();
      })
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => {
        setError('Error fetching search history');
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { history, loading, error };
}