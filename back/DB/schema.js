const mongoose = require("mongoose");

// 1. הגדרת הסכמה
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please provide a first name"], // חובה + הודעת שגיאה מותאמת
      trim: true, // מנקה רווחים מיותרים מהצדדים
      minlength: 2, // אורך מינימלי
    },
    lastname: {
      type: String,
      required: [true, "Please provide a last name"], // חובה + הודעת שגיאה מותאמת
      minlength: 2, // אורך מינימלי
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // שומר הכל באותיות קטנות
    },
    password: {
      type: String,
      required: [true, "Please provide a master password"],
      minlength: 8,
    },
    accounts: {
      type: [
        {
          site: {
            type: String,
            required: true,
          },
          link: {
            type: String,
            required: true,
          },
          username: {
            type: String,
            required: true,
          },
          password: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now, // חותמת זמן ליצירה
          },
        },
      ],
      default: [], // ברירת מחדל למערך ריק
    },
  },
  {
    // 2. אפשרויות נוספות
    timestamps: true, // מוסיף אוטומטית שדות createdAt ו-updatedAt
  },
);

// 3. יצירת המודל (הכלי שבאמצעותו נבצע פקודות ב-DB)
const User = mongoose.model("User", userSchema);

// 4. ייצוא המודל
module.exports = User;
