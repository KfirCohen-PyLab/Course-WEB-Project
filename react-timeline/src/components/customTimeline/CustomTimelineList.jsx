import React from 'react';

const TimelineList = ({ timelines, onSelect }) => (
  <div className="timeline-list">
    <h3>Your Timelines:</h3>
    {timelines.length === 0 ? (
      <p>No timelines found.</p>
    ) : (
      <ul>
        {timelines.map((tl) => (
          <li key={tl._id}>
            <button className="general-button" onClick={() => onSelect(tl)}>
              {tl.title}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default TimelineList;