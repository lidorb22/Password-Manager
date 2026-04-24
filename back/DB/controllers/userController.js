const mongoose = require("mongoose");
const userSchema = require("../schema");

const createNewUser = async (firstname, lastname, email) => {
  const newUser = new userSchema({
    firstname,
    lastname,
    email,
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

module.exports = { createNewUser, getUserByEmail, getUserById };
