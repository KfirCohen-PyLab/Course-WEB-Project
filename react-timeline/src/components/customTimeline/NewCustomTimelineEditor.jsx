
import React from 'react';
import EventForm from './EventMakerCustomTimeLine';
import TimelineView from './CustomTimelineView';

const NewTimelineEditor = ({
  timelineName,
  newEvent,
  events,
  onTimelineNameChange,
  onChangeNewEvent,
  onAddEvent,
  onSave,
}) => (
  <>
    <EventForm
      eventData={newEvent}
      onChange={onChangeNewEvent}
      onSubmit={onAddEvent}
      timelineName={timelineName}
      onTimelineNameChange={onTimelineNameChange}
      isEditing={false}
    />
    <button onClick={onSave} className="general-button">
      Save Timeline
    </button>
    <TimelineView events={events} />
  </>
);

export default NewTimelineEditor;
