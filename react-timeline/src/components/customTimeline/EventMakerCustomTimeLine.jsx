import React from 'react';

const EventForm = ({ eventData, onChange, onSubmit, timelineName, onTimelineNameChange, isEditing }) => (
  <form className="event-form" onSubmit={onSubmit}>
    {typeof timelineName !== 'undefined' && (
      <input
        type="text"
        value={timelineName}
        onChange={onTimelineNameChange}
        placeholder="Timeline name"
        className={isEditing ? undefined : 'timeline-name'}
        required={!isEditing}
      />
    )}
    <input
      type="text"
      name="title"
      placeholder="Title"
      value={eventData.title}
      onChange={onChange}
      required
    />
    <input
      type="date"
      name="date"
      value={eventData.date}
      onChange={onChange}
      required
    />
    <textarea
      name="description"
      placeholder="Description"
      value={eventData.description}
      onChange={onChange}
    />
    <button type="submit" className="general-button">
      Add Event
    </button>
  </form>
);

export default EventForm;
