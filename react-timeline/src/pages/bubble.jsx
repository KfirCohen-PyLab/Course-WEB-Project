// BubblePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import topicsData from "../data/topics.json";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "../style/pagestyle/bubble.css";

const BubblePage = () => {
  const [filteredTopics, setFilteredTopics] = useState([]);
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const bubbles = document.querySelectorAll(".bubble");
    bubbles.forEach((bubble) => {
      const x = bubble.getAttribute("data-x");
      const y = bubble.getAttribute("data-y");
      const delay = bubble.getAttribute("data-delay");

      bubble.style.setProperty("--x", x);
      bubble.style.setProperty("--y", y);
      bubble.style.setProperty("--delay", delay);
    });
  }, [filteredTopics]);

  const handleBubbleClick = (topicName, topicType) => {
    localStorage.setItem("selectedTopic", topicName);
    localStorage.setItem("selectedType", topicType);
    navigate("/timeline");
  };

  useEffect(() => {
  const filtered = topicsData.filter((topic) => {
    if (filterType === "All") return true;
    if (filterType === "Year") return topic.type === "Year"; 
    if (filterType === "Events") return topic.type === "Type of Event";
    if (filterType === "Country") return topic.type === "Country"; 
    return true;
  });
  setFilteredTopics(filtered);
}, [filterType]);

  return (
    <div className="bubble-page">
      <Header />
      <div className="filter-bar">
        {["All", "Year", "Events", "Country"].map((type) => (
          <button
            key={type}
            className={`filter-button ${filterType === type ? "active" : ""}`}
            onClick={() => setFilterType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="bubble-container">
        {filteredTopics.map((topic, idx) => {
          const x = Math.random() * 90;
          const y = Math.random() * 70;
          const delay = Math.random() * 5;

          return (
            <button
              key={idx}
              className="bubble"
              data-x={x}
              data-y={y}
              data-delay={delay}
              onClick={() => handleBubbleClick(topic.name, topic.type)}
              style={{
                backgroundColor: topic.image ? "transparent" : topic.color,
                backgroundImage: topic.image ? `url(${topic.image})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            </button>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default BubblePage;
