import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import ReusableTableContent from "../CommonComponent/ReusableTabelContent";

const TabBox = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabLabels = ["Circulars", "Notifications", "Tenders", "Downloads"];

  useEffect(() => {
    // Any setup logic can go here, if needed.
  }, []);

  return (
    <Card className="noticeboardCard border-0">
      <Card.Header className="announcmentHeader d-flex justify-content-between align-items-center">
        <h5 className="my-2">{tabLabels[activeTab]}</h5>
        <button
          className="btn btn-info btn-sm px-2 h-auto"
          onClick={() => {
            const routeMap = {
              0: "/circulars",
              1: "/notifications",
              2: "/tenders",
              3: "/downloads",
            };
            window.location.href = routeMap[activeTab];
          }}
        >
          View More
        </button>
      </Card.Header>

      <div className="tab-list">
        {tabLabels.map((label, index) => (
          <button
            key={index}
            className={`text-white btn ${activeTab === index ? "btn-info border-white" : "btn-grey border-white"}`}
            onClick={() => setActiveTab(index)}
          >
            {label}
          </button>
        ))}
      </div>

      <Card.Body className="mt-1 p-2">
        {/* Pass type and title to the ReusableTableContent component */}
        <ReusableTableContent type={activeTab + 1} />
      </Card.Body>
    </Card>
  );
};

export default TabBox;
