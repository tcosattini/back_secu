const mongoose = require("mongoose");
const User = require("../models/users/user.model");
const bcrypt = require("bcrypt");
const ipService = require("../services/Ip.service");
var geoip = require("geoip-lite");

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

exports.checkIp = (username, requestIp, browserName, req, res, email) => {
  // 1 : Find User
  // 2 : If user found => check IP request with DB IP
  // 3 : If IP request != IP DB => Check IP origin ;  else => OK 200
  // 4 : If IP is FR send an WARING e-mail => OK 200 ; If IP != FR => Send e-mail, block connexion => 403

  //1
  var user = User.findOne({
    username: username,
  }).exec((err, user) => {
    const ipLocation = geoip.lookup("90.11.35.136");

    console.log(user.browser, browserName);

    if (user.browser !== browserName) {
      return res.status(210).json({
        message: "Navigateur non habituel",
        email: user.mail,
      });
    }

    // Compare if the DB IP is != request IP
    if (user.ip !== requestIp) {
      console.log(
        "\x1b[33m",
        "WARNING  " +
          user.username +
          "  is trying to connect with a new IP =>  " +
          requestIp +
          "  from : " +
          geoip.lookup("90.11.35.136").country
      );

      if (ipLocation.country !== "FR") {
        return res.status(403).json({
          message: "Connexion impossible depuis cette zone Géographique",
        });
      } // send EMAIL
      return res.status(210).json({
        message: "Login success",
        userName: user.username,
        mail: email.mail,
        ip: user.ip,
      });
    }
    return res.status(200).json({
      message: "Ok",
    });
  });
};
