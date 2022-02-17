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
const requestIp = require("request-ip");
var UAParser = require("ua-parser-js");

var config = {
  url: "ldap://104.40.137.0:389",
  baseDN: "dc=b3sysops,dc=lan",
  username: "Admin_Clement@b3sysops.lan",
  password: "K#W?'+Y/0!EmSM+'r`8M",
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use(cors());
// AUTH SignIn

dbConfig.connexion();
// dbConfig.createUser("clement.sergent", "clement.sergent@epsi.fr", "clement");

//AUTH Find if user has a granted access trough the directory
app.post("/api/check", cors(), jsonParser, (req, res) => {
  console.log("Directory requested");
  var userName = req.body.username;
  var password = req.body.password;
  //Headers's request IP without subnet prefix
  var requestIp = req.socket.localAddress.toString().replace("::ffff:", "");
  var parser = new UAParser();
  var ua = req.headers["user-agent"];
  var browserName = parser.setUA(ua).getBrowser().name;
  var ad = new ActiveDirectory(config);
  console.log(userName);

  ad.authenticate(userName, password, function (err, auth, username) {
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return res.status(500).json({
        message: "Server error !",
      });
    }

    if (auth) {
      console.log("AD access for  =>  " + userName);
      console.log(
        userController.checkIp(userName, requestIp, browserName, req, res)
      );
      console.log("Browser: " + browserName);
      // return res.status(200).json({
      //   message: "User" + userName + "found ! ",
      // });
    }
  });
});

app.post("/api/auth/signin", cors(), jsonParser, (req, res) => {
  console.log("SignIn requested");
  userController.signin(req, res);
});
