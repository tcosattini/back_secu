const mongoose = require("mongoose");
const User = require("../models/users/user.model");
const Role = require("../models/users/role.model");
var bcrypt = require("bcryptjs");
exports.connexion = () => {
  mongoose
    .connect(
      `mongodb+srv://admin:FhHtxeWv6BU0WkzO@cluster0.rk4cw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Successfully connect to MongoDB.");
    })
    .catch((err) => {
      console.error("Connection error", err);
      process.exit();
    });
};

exports.dbLoadRoles = () => {
  mongoose;
  Role.estimatedDocumentCount((err, count) => {
    if (!err) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });
    }
  });
};

exports.createUser = (username, email, password) => {
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
