const express = require("express");
var cors = require("cors");
const app = express();
const port = 8000;
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var ActiveDirectory = require("activedirectory");
const dbConfig = require("../app/dbConfig/db.config");
const userController = require("../app/controllers/user.controler");
var UAParser = require("ua-parser-js");
const expressip = require("express-ip");
const rateLimit = require("express-rate-limit");

var config = {
  url: "ldap://104.40.137.0:389",
  baseDN: "dc=b3sysops,dc=lan",
  username: "Admin_Clement@b3sysops.lan",
  password: "K#W?'+Y/0!EmSM+'r`8M",
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use(cors(), expressip().getIpInfoMiddleware);
// AUTH SignIn

dbConfig.connexion();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
// dbConfig.createUser("clement.sergent", "clement.sergent@epsi.fr", "clement");

//AUTH Find if user has a granted access trough the directory
app.post("/api/check", cors(), jsonParser, (req, res) => {
  console.log("Directory requested");
  var userName = req.body.username;
  var password = req.body.password;
  var parser = new UAParser();
  var ua = req.headers["user-agent"];
  var browserName = parser.setUA(ua).getBrowser().name;
  var ad = new ActiveDirectory(config);

  ad.authenticate(userName, password, function (err, auth, username) {
    if (auth) {
      ad.findUser(userName, function (err, user) {
        if (!user) console.log("User not found in DB");
        if (err) {
          console.log("ERROR: " + JSON.stringify(err));
          return err;
        } else userController.getUserDB(userName, browserName, req, res, user);
      });
    }
    if (!auth) {
      console.log("ERROR: " + JSON.stringify(err));
      return res.status(401).json({
        message: "Identifiants incorrects",
      });
    }
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return res.status(500).json({
        message: "Connexion impossible",
      });
    }
  });
});

app.post("/api/auth/signin", cors(), jsonParser, (req, res) => {
  console.log("SignIn requested");
  userController.signin(req, res);
});
