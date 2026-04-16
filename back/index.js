const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// חשוב מאוד: זה מאפשר לתוסף שלך לגשת לשרת
app.use(cors());
app.use(express.json());

// נתיב לדוגמה שהתוסף ימשוך ממנו נתונים
app.get("/api/data", (req, res) => {
  res.json({
    message: "היי מהשרת! הקשר הוקם בהצלחה",
    status: "success",
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
