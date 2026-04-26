const express = require("express");
const router = express.Router();
const { getUserById } = require("../DB/controllers/userController");
const {
  setNewAccount,
  encryptAllPasswords,
  decryptPassword,
} = require("../DB/controllers/accountController");

//create route is to create a new account for an existing user, it will receive the user id and the account details, then it will encrypt the password and save the account to the user document in the database.
/**
 * @swagger
 * /api/account/create:
 *  post:
 *    summary: יצירת חשבון חדש למשתמש קיים
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              site:
 *                type: string
 *              link:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: הצלחה
 */
router.post("/create", async (req, res) => {
  const { id, site, link, username, password } = req.body;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (
      user.accounts.some((acc) => acc.site == site && acc.username == username)
    ) {
      return res.status(400).json({ error: "Account already exists" });
    }
    const updatedAccount = await setNewAccount(
      user,
      site,
      link,
      username,
      password,
    );
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//decrypt route is to decrypt the password for a given user id and encryptedPassword, it will receive the user id, encryptedPassword and return the password decrypted.
/**
 * @swagger
 * /api/account/decrypt:
 *  get:
 *    summary: פענוח של כל הסיסמאות לאותו ID
 *    parameters:
 *    - name: id
 *      in: query
 *      required: true
 *      schema:
 *        type: string
 *    - name: encryptedPassword
 *      in: query
 *      required: true
 *      schema:
 *        type: string
 *    responses:
 *      200:
 *        description: הצלחה
 */
router.get("/decrypt", async (req, res) => {
  const { id, encryptedPassword } = req.query;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.accounts.some((acc) => acc.password == encryptedPassword)) {
      return res.status(400).json({ error: "info not match" });
    }
    const decryptedPassword = decryptPassword(id, encryptedPassword);
    res.status(200).json(decryptedPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//encrypt route is to encrypt all the passwords for a given user id, it will receive the user id and return the user document with all the passwords encrypted.
/**
 * @swagger
 * /api/account/encrypt:
 *  get:
 *    summary: הצפנה של כל הסיסמאות לאותו ID
 *    parameters:
 *    - name: id
 *      in: query
 *      required: true
 *      schema:
 *        type: string
 *    responses:
 *      200:
 *        description: הצלחה
 */
router.get("/encrypt", async (req, res) => {
  const { id } = req.query;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const encryptedAccount = encryptAllPasswords(user);
    res.status(200).json(encryptedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
