const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const ivLength = 16;
const { getUserById } = require("./userController");

function encrypt(key, text) {
  // יצירת מפתח קבוע של 32 בתים מהמחרוזת שהתקבלה
  const hashedKey = crypto.createHash("sha256").update(key).digest();

  // יצירת IV רנדומלי עבור כל הצפנה
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(algorithm, hashedKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // מחזירים את ה-IV יחד עם הטקסט המוצפן (מופרדים בנקודתיים) כדי שנוכל לפענח אחר כך
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(key, encryptedData) {
  const hashedKey = crypto.createHash("sha256").update(key).digest();

  // פירוק המחרוזת ל-IV ולטקסט המוצפן
  const parts = encryptedData.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");

  const decipher = crypto.createDecipheriv(algorithm, hashedKey, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

const decryptPassword = (id, password) => {
  decryptedPassword = decrypt(id.toString(), password);
  return decryptedPassword;
};

const decryptAllPasswords = (account) => {
  account.accounts.forEach((acc) => {
    acc.password = decrypt(account._id.toString(), acc.password);
  });
  return account;
};

//make sure to change the keys in the fuction to a environment variable before deploy + user id
const encryptAllPasswords = (account) => {
  account.accounts.forEach((acc) => {
    acc.password = encrypt(account._id.toString(), acc.password);
  });
  return account;
};

const setNewAccount = async (user, site, link, username, password) => {
  try {
    const encryptedPassword = encrypt(user._id.toString(), password);
    user.accounts.push({ site, link, username, password: encryptedPassword });
    await user.save();
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  decryptAllPasswords,
  encryptAllPasswords,
  setNewAccount,
  decryptPassword,
};
