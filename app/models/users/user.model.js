const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    browser: String,
    ip: Number,
  })
);

module.exports = User;
