import React from 'react';
import EventForm from './EventMakerCustomTimeLine';
import TimelineView from './CustomTimelineView';

const TimelineEditor = ({
  selectedTimeline,
  newEvent,
  onAddEvent,
  onEditTimelineName,
  onChangeNewEvent,
  onSave,
  onCancel,
}) => (
  <>
    <TimelineView events={selectedTimeline.events} />
    <EventForm
      eventData={newEvent}
      onChange={onChangeNewEvent}
      onSubmit={onAddEvent}
      timelineName={selectedTimeline.title}
      onTimelineNameChange={onEditTimelineName}
      isEditing={true}
    />
    <div className='button-group'>
      <button type="submit" onClick={onSave} className="general-button">
        Save Changes
      </button>
      <button type="button" onClick={onCancel} className="general-button">
        Cancel
      </button>
    </div>
  </>
);

export default TimelineEditor;
