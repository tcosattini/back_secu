const User = require("../models/users/user.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    console.log(passwordIsValid);
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  });
};

const getUserDB = (username, browserName, req, res, email) => {
  User.findOne({
    username: username,
  }).exec((err, user) => {
    console.log(user.browser, browserName);

    if (user.browser !== browserName) {
      console.log(user.ip);
      return res.status(210).json({
        message: "Navigateur non habituel",
        user: user.username,
        mail: email.mail,
        ip: user.ip,
      });
    }

    return res.status(200).json({
      message: "Login success",
      user: user.username,
      mail: email.mail,
      ip: user.ip,
    });
  });
};
const createUser = (username, email, password) => {
  mongoose;
  User.estimatedDocumentCount((err, count) => {
    if (!err) {
      new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 8),
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("new user added");
      });
    }
  });
};

module.exports = { createUser, getUserDB };
