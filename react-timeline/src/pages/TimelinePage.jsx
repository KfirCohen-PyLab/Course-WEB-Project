// TimelinePage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "../style/pagestyle/TimelinePage.css";
import { useNavigate } from 'react-router-dom';


const TimelinePage = () => {
  const [topic, setTopic] = useState(null);
  const [type, setType] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [color, setColor] = useState("#2563eb");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    const storedType = localStorage.getItem("selectedType");

    if (!storedTopic || !storedType) {
      alert("No topic or type selected! Redirecting to topics page.");
      window.location.href = "/"; 
      return;
    }

    setTopic(storedTopic);
    setType(storedType);

    setLoading(true);

    fetch(`http://localhost:4000/api/dataset?topic=${encodeURIComponent(storedTopic)}&type=${encodeURIComponent(storedType)}`)

      .then((res) => {
        if (!res.ok) {
          console.error("Server responded with an error:", res.statusText);
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTimeline(data);
      })
      .catch((error) => {
        console.error("Failed to fetch timeline data:", error);
        setTimeline([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSort = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  const handleColorChange = (e) => setColor(e.target.value);
  const handleExportPDF = () => {
    alert("Export to PDF not implemented yet.");
  };

  const sortedTimeline = [...timeline].sort((a, b) => {
    const aDate = new Date(`${a.Month || "January"} ${a.Date || 1}, ${a.Year}`);
    const bDate = new Date(`${b.Month || "January"} ${b.Date || 1}, ${b.Year}`);
    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
  });

  if (!topic || !type) {
    return <div className="text-center p-6">Loading...</div>;
  }

  const generateOnThisDayLink = (event) => {
  const day = event.Date?.toString().trim().toLowerCase();
  const month = event.Month?.toString().trim().toLowerCase();
  const year = event.Year?.toString().trim();

  const validMonths = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  const isValidMonth = month && validMonths.includes(month);

  const isValidDay = day && !isNaN(day) && Number(day) >= 1 && Number(day) <= 31;

    if (year && isValidMonth && isValidDay) {
      // year+month+day
      return `https://www.onthisday.com/date/${year}/${month}/${day}`;
    } else if (year && isValidMonth) {
      // year+month
      return `https://www.onthisday.com/date/${year}/${month}`;
    } else if (year) {
      // year only
      return `https://www.onthisday.com/date/${year}`;
    } else if (isValidMonth && isValidDay) {
      // month+day
      return `https://www.onthisday.com/day/${month}/${day}`;
    } else {
      // default to the main page
      return "https://www.onthisday.com";
    }
  };



  return (
    <div className="timeline-page">
      <Header /> 
      <div className="timeline-Container" > 
      <div class="container-wrapper"></div> 
        <h1 className="app-title"> {topic} Timeline </h1>

      {/* Controls */}
      <div className="button-container">
        <button onClick={handleSort} className="btn">
          {sortOrder === "asc" ? "Past → Future" : "Future → Past"}
        </button>
        <button onClick={handleExportPDF} className="btn">
          Export to PDF
        </button>
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          title="Pick timeline color"
        />
        
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="timeline-horizontal">
          {sortedTimeline.map((event, idx) => (
            <div
              key={idx}
              className="timeline-card"
              style={{ borderColor: color }}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="timeline-date">{[
                  event.Month,
                  event.Year
                ]
                  .filter(val => val !== "Unknown" && val !== "לא ידוע")
                  .join(" ")}
              </div>
              <div className="timeline-title">{event["Name of Incident"]}</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div className="timeline-modal" onClick={() => setSelectedEvent(null)}>
          <div className="timeline-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent["Name of Incident"]}</h2>
            <p>
              <strong>Date:</strong>{" "}
              {[
                selectedEvent.Date,
                selectedEvent.Month,
                selectedEvent.Year
              ]
                .filter(val => val !== "Unknown")
                .join(" ") || "Unknown"}
            </p>
            <p><strong>Country:</strong> {selectedEvent.Country}</p>
            <p><strong>Place:</strong> {selectedEvent["Place Name"]}</p>
            <p><strong>Impact:</strong> {selectedEvent.Impact}</p>
            <p><strong>Affected Population:</strong> {selectedEvent["Affected Population"]}</p>
            <p><strong>Important Person/Group Responsible:</strong> {selectedEvent["Important Person/Group Responsible"]}</p>
            <p><strong>Outcome:</strong> {selectedEvent.Outcome}</p>
            <button onClick={() => setSelectedEvent(null)} className="btn">Close</button>
            {(selectedEvent.Year || selectedEvent.Month || selectedEvent.Date) && (
              <a
                href={generateOnThisDayLink(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn no-underline"
              >
                View on OnThisDate
              </a>
            )}
            <button
              className="btn"
              onClick={() =>
                navigate(`/search?query=${encodeURIComponent(selectedEvent["Name of Incident"])}`)
              }
            >
              Search for more
            </button>
              
          </div>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default TimelinePage;
