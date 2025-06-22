import React, { useState } from 'react';
import '../../style/componentsStyle/TimelineEvent.css';

const TimelineEvent = ({ date, summary, index }) => {
  const [showSummary, setShowSummary] = useState(false);
  const side = index % 2 === 0 ? 'left' : 'right';

  return (
    <div className={`timeline-event ${side}`}>
      <button className="date-button" onClick={() => setShowSummary(!showSummary)}>
        {date}
      </button>
      {showSummary && <div className="summary-box">{summary}</div>}
    </div>
  );
};

export default TimelineEvent;
