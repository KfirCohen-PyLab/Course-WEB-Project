import React from 'react';

const TimelineView = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <div className="timeline">
      {sortedEvents.map((event, index) => (
        <div key={index} className="timeline-event">
          <div className="event-date">{event.date}</div>
          <div className="event-details">
            <h4>{event.title}</h4>
            <p>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;
