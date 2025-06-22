import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import TimelineList from '../components/customTimeline/CustomTimelineList';
import TimelineEditor from '../components/customTimeline/CustomTimelineEditor';
import NewTimelineEditor from '../components/customTimeline/NewCustomTimelineEditor';
import '../style/pagestyle/customTimeline.css';

/**
 * CustomTimeline Component
 *
 * This component allows users to build, edit, and save custom timelines.
 * Users can add events with a title, date, and description, and either create a new timeline
 * or update an existing one. All timelines are fetched and saved through a backend API.
 *
 * Features:
 * - Displays a list of user timelines fetched from the server
 * - Allows selection and editing of an existing timeline
 * - Enables creation of a new timeline with multiple events
 * - Uses localStorage to identify the logged-in user by email
 *
 * Hooks used:
 * - useState: Manages local component state (timelines, events, selected timeline, etc.)
 * - useEffect: Fetches timelines on component mount
 * - useCallback: Optimizes and memoizes the fetch function to avoid unnecessary re-creations
 */

const CustomTimeline = () => {
  const userEmail = localStorage.getItem('userEmail');

  const [timelines, setTimelines] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [timelineName, setTimelineName] = useState('');
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });

  // Fetch timelines for the user
  const fetchTimelines = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/api/customtimelines/user/${userEmail}`);
      if (!res.ok) throw new Error('Failed to fetch timelines');
      const data = await res.json();
      setTimelines(data);
    } catch (error) {
      console.error(error);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchTimelines();
  }, [fetchTimelines]);

  // Handle changes for new event inputs
  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // Add event either to selected timeline or to the new timeline events list
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    if (selectedTimeline) {
      setSelectedTimeline(prev => ({
        ...prev,
        events: [...prev.events, newEvent],
      }));
    } else {
      setEvents(prev => [...prev, newEvent]);
    }

    setNewEvent({ title: '', date: '', description: '' });
  };

  // Save a new timeline
  const saveNewTimeline = async () => {
    if (!timelineName.trim() || events.length === 0) {
      alert('Please enter a name and add at least one event.');
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/api/customtimelines/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userEmail, title: timelineName.trim(), events }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Timeline saved successfully!');
        setTimelineName('');
        setEvents([]);
        fetchTimelines();
      } else {
        alert('Error saving timeline: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save timeline');
    }
  };

  // Update an existing timeline
  const saveExistingTimeline = async () => {
    if (!selectedTimeline) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API}/api/customtimelines/${selectedTimeline._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedTimeline.title,
          events: selectedTimeline.events,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Timeline updated successfully!');
        setSelectedTimeline(null);
        fetchTimelines();
      } else {
        alert('Error updating timeline: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update timeline');
    }
  };

  // Handle editing timeline name for existing timeline
  const handleEditTimelineName = (e) => {
    if (!selectedTimeline) return;
    const newTitle = e.target.value;
    setSelectedTimeline(prev => ({ ...prev, title: newTitle }));
  };

  return (
    <div className="custom-timeline-page">
      <Header />
      <div className="custom-timeline-container">
        <h2 className="app-title">Build Your Own Timeline</h2>
        <TimelineList timelines={timelines} onSelect={setSelectedTimeline} />

        <div className="timeline-editor">
          {selectedTimeline ? (
            <TimelineEditor
              selectedTimeline={selectedTimeline}
              newEvent={newEvent}
              onAddEvent={handleAddEvent}
              onEditTimelineName={handleEditTimelineName}
              onChangeNewEvent={handleNewEventChange}
              onSave={saveExistingTimeline}
              onCancel={() => setSelectedTimeline(null)}
            />
          ) : (
            <NewTimelineEditor
              timelineName={timelineName}
              newEvent={newEvent}
              events={events}
              onTimelineNameChange={(e) => setTimelineName(e.target.value)}
              onChangeNewEvent={handleNewEventChange}
              onAddEvent={handleAddEvent}
              onSave={saveNewTimeline}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomTimeline;
