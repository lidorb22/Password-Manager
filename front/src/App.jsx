import { useState, useEffect } from "react";

function App() {
  const [serverData, setServerData] = useState("טוען נתונים...");

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/data");
      const data = await response.json();
      setServerData(data.message);
    } catch (error) {
      setServerData("שגיאה בחיבור לשרת");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Extension + Node.js</h1>
      <div className="card">
        <p>
          תגובה מהשרת: <strong>{serverData}</strong>
        </p>
        <button onClick={fetchData}>משוך נתונים עכשיו</button>
      </div>
    </div>
  );
}

export default App;
