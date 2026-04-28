const mongoose = require("mongoose");
const userSchema = require("../schema");
const bcrypt = require("bcrypt");

/* Hashes the master password before saving it to the database.*/
const hashPassword = async (password) => {
  const saltRounds = 10;                      /*Number of rounds for the encryption*/
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

/*Compares a plain password with the hashed password during login*/
const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const createNewUser = async (firstname, lastname, email, password) => {
  const newUser = new userSchema({
    firstname,
    lastname,
    email,
    password,
  });
  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.log(error);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await userSchema.findOne({ email }).exec();
    return user;
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (id) => {
  try {
    const user = await userSchema.findById(id).exec();
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createNewUser, getUserByEmail, getUserById, hashPassword, comparePassword };
