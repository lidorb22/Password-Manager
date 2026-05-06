const express = require("express");
const router = express.Router();
const {
  createNewUser,
  getUserByEmail,
  hashPassword,
  comparePassword,
} = require("../DB/controllers/userController");

const { route } = require("./accountRoutes");

const emailValidateRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * @swagger
 * /api/user/register:
 *  post:
 *    summary: Register a new user
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
 *              password:
 *                type: string
 *                description: master password (at least 8 characters)
 *    responses:
 *      200:
 *        description: User registered successfully
 *      400:
 *        description: Invalid email format or weak password
*/

router.post("/register", async (req, res) => {
  const { firstname, email, password } = req.body;
  
  if (!emailValidateRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
   if (!password || password.length != 8) {
    return res.status(400).json({ error: "Password must be at exactly 8 characters" });
  }
  try {
    /*Hash the master password before saving it to the database*/
    const hashedPassword = await hashPassword(password);
    
    const newuser = await createNewUser(firstname, email, hashedPassword);
    res.status(200).json(newuser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/user/login:
 *  post:
 *    summary: User login with email and master password
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                description: master password
 *    responses:
 *      200:
 *        description: Login successful
 *      400:
 *        description: Invalid email or password
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!emailValidateRegex.test(email))
    return res.status(400).json({ message: "Invalid email or password" });
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: "Invalid email or password" });
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});



//add user verification and autenticate with email code

module.exports = router;
