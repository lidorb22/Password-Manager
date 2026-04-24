const express = require("express");
const router = express.Router();
const {
  createNewUser,
  getUserByEmail,
} = require("../DB/controllers/userController");
const { route } = require("./accountRoutes");

const emailValidateRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * @swagger
 * /api/user/register:
 *  post:
 *    summary: רישום משתמש חדש
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstname:
 *                type: string
 *              lastname:
 *                type: string
 *              email:
 *                type: string
 *    responses:
 *      201:
 *        description: הצלחה
 */
router.post("/register", async (req, res) => {
  const { firstname, lastname, email } = req.body;
  if (!emailValidateRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  try {
    const newuser = await createNewUser(firstname, lastname, email);
    res.status(200).json(newuser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/user/login:
 *  get:
 *    summary: קבלת משתמש על פי אימייל
 *    parameters:
 *    - name: email
 *      in: query
 *      required: true
 *      schema:
 *        type: string
 *        format: email
 *    responses:
 *      200:
 *        description: הצלחה
 */
router.get("/login", async (req, res) => {
  const { email } = req.query;
  if (!emailValidateRegex.test(email))
    return res.status(400).json({ message: "invalid email" });
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: "the email is not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//add user verification and autenticate with email code

module.exports = router;
