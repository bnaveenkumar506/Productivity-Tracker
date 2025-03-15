import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const userId = "exampleUserId"; // Replace with actual user ID
    axios.get(`http://localhost:5000/api/report/${userId}`).then((response) => {
      setReport(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Daily Productivity Report</h1>
      <ul>
        {report.map((log, index) => (
          <li key={index}>
            {log.domain}: {Math.round(log.timeSpent / 60000)} minutes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;