import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SearchBar from '../components/timeline/searchBar';
import Results from '../components/timeline/Results';
import Loading from '../components/common/Loading';
import ErrorBox from '../components/common/ErrorBox';
import '../style/pagestyle/Search.css';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [fullText, setFullText] = useState('');
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const userId = localStorage.getItem('userId');

  const location = useLocation();

useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get('query');
    const start = params.get('startYear') || '';
    const end = params.get('endYear') || '';

    if (queryFromUrl) {
      setQuery(queryFromUrl);
      setStartYear(start);
      setEndYear(end);
    }
  }, [location.search]);
  
  useEffect(() => {
    if (!query) {
      setFullText('');
      setTimelineEvents([]);
      setImages([]);
      setError(null);
      return;
    }

    const fetchTimelineData = async () => {
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

        const searchUrl = new URL('http://localhost:4000/search');
        searchUrl.searchParams.append('q', query);
        searchUrl.searchParams.append('startYear', startYear);
        searchUrl.searchParams.append('endYear', endYear);
        
        const searchResponse = await fetch(searchUrl, {
          headers: { 'user-email': userEmail }
        });

        if (searchResponse.status === 401) {
          navigate('/login');
          return;
        }

        if (!searchResponse.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await searchResponse.json();
        
        // Save search to user's history
        if (userId) {
          try {
            await fetch('http://localhost:4000/api/users/search-history', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                query
              }),
            });
          } catch (historyError) {
            console.error('Failed to save to search history:', historyError);
          }
        }

        setFullText(data.extract);
        setTimelineEvents(data.timelineEvents || []);
        setImages(data.images || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to load timeline: ${err.message}`);
        setFullText('');
        setTimelineEvents([]);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [query, startYear, endYear, navigate, userId]);


  const getSideImages = (side) => {
    const filteredImages = images.filter(img => img && img.src);
    if (filteredImages.length === 0) return [];
    const half = Math.ceil(filteredImages.length / 2);
    return side === 'left' ? filteredImages.slice(0, half) : filteredImages.slice(half);
  };

  return (
    <div className="app-container">
      <Header />
      <h1 className="app-title">Timeline Search</h1>

      <SearchBar 
        onSearch={({ query, startYear, endYear }) => {
          setQuery(query);
          setStartYear(startYear);
          setEndYear(endYear);
        }}
      />

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
      <Footer />
    </div>
  );
};

export default Search;
