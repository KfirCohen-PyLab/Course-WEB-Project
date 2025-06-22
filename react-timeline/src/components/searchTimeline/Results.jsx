import TimelineEvent from './TimelineEvent';
import TimelineImages from './TimelineImages';
import '../../style/componentsStyle/Results.css';

export default function Results({
  query,
  startYear,
  endYear,
  fullText,
  timelineEvents,
  images,
  getSideImages
}) {
  return (
    <div className="app-content-wrapper">
      <div className="side-column">
        <TimelineImages images={getSideImages('left')} />
      </div>
      <div className="main-column">
        {fullText ? (
          <div className="results-container">
            <h2 className="results-title">
              {`Results for "${query}"`}
              {(startYear || endYear) && (
                <> from: {startYear || '1900'} to: {endYear || '2024'}</>
              )}
            </h2>
            <details className="full-text-details">
              <summary className="full-text-summary">Show Wikipedia summary</summary>
              <p className="full-text-display">{fullText}</p>
            </details>
            {timelineEvents.length > 0 ? (
              <div className="timeline-events-container">
                {timelineEvents.map((event, index) => (
                  <TimelineEvent
                    key={index}
                    date={event.date}
                    summary={event.summary}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <p className="no-events-message">
                No specific timeline events found for "{query}" in the extract.
              </p>
            )}
          </div>
        ) : (
          <p className="no-data-message">
            No data found on Wikipedia for "{query}". Please try a different search term.
          </p>
        )}
      </div>
      <div className="side-column">
        <TimelineImages images={getSideImages('right')} />
      </div>
    </div>
  );
}