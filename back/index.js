const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;

// קריאה לפונקציית החיבור
const connectDB = require("./DB/connection");
connectDB();

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc"); // ודא שזה מיובא

// 1. הגדרת האפשרויות במקום קובץ JSON חיצוני
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Docs",
      version: "1.0.0",
      description: "תיעוד ה-API שלי",
    },
  },
  // כאן אתה אומר ל-Swagger איפה לחפש את התיעוד (בתיקיית הראוטים שלך)
  apis: ["./routes/*.js"],
};

// 2. יצירת התיעוד מהאפשרויות
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// 3. חיבור הראוט של Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// חשוב מאוד: זה מאפשר לתוסף שלך לגשת לשרת
app.use(cors());
app.use(express.json());
// שימוש בראוט של חשבון
const userRouter = require("./routes/userRoutes");
app.use("/api/user", userRouter);

const accountRoutes = require("./routes/accountRoutes");
app.use("/api/account", accountRoutes);

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
