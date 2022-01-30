const express = require("express");
var cors = require("cors");
const app = express();
const port = 8000;
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var ActiveDirectory = require("activedirectory");
const dbConfig = require("../app/dbConfig/db.config");
const userController = require("../app/controllers/user.controler");
const { getMaxListeners } = require("./models/users/user.model");
var config = {
  url: "ldap://176.31.104.101:389",
  baseDN: "dc=active_directory,dc=local",
  username: "admin@active_directory.local",
  password: "Admin23%",
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use(cors());
// AUTH SignIn

dbConfig.connexion();
dbConfig.createUser("toto", "t.cosattini@gmail.com", "toto");

//AUTH Find if user has a granted access trough the directory
app.post("/api/check", cors(), jsonParser, (req, res) => {
  console.log("Directory requested");
  var userName = req.body.username;
  var ad = new ActiveDirectory(config);
  ad.findUser(userName, function (err, user) {
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return res.status(500).json({
        message: "Server error !",
      });
    }
    if (!user) {
      console.log(userName);
      return res.status(403).json({
        message: "User" + userName + " not found ! ",
      });
    } else {
      console.log("Authorized access for " + console.log(req.body));
      return res.status(200).json({
        message: "User" + userName + "found ! ",
      });
    }
  });
});

app.post("/api/auth/signin", cors(), jsonParser, (req, res) => {
  console.log("SignIn requested");
  userController.signin(req, res);
});
