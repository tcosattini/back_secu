const mongoose = require("mongoose");
const User = require("../models/users/user.model");
const bcrypt = require("bcrypt");

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
