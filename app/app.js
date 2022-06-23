const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var ActiveDirectory = require("activedirectory");
const dbConfig = require("../app/dbConfig/db.config");
const userController = require("../app/controllers/user.controler");
var UAParser = require("ua-parser-js");
const expressip = require("express-ip");
const rateLimit = require("express-rate-limit");
const https = require("https");
const http = require("http");
const fs = require("fs");
var app = express();

const credentials = {
  key: fs.readFileSync("./certificat/privateKey.key"),
  cert: fs.readFileSync("./certificat/certificate.crt"),
};

var config = {
  url: "ldap://15.237.122.218:389",
  baseDN: "dc=epsidev, dc=lan",
  username: "Charly",
  password: "Azerty-77",
};
app.use(cors(), expressip().getIpInfoMiddleware);
app.listen(8080);

// var httpsServer = https.createServer(credentials, app);

// httpsServer.listen(8080);

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
app.post("/api/check", jsonParser, (req, res) => {
  console.log("Directory requested");
  var userName = req.body.username;
  var password = req.body.password;
  var parser = new UAParser();
  var ua = req.headers["user-agent"];
  var browserName = parser.setUA(ua).getBrowser().name;
  var ad = new ActiveDirectory(config);
  var query = "cn=*" + userName + "*";

  ad.authenticate(userName, password, function (err, auth, username) {
    if (auth) {
      ad.findUsers(query, function (err, user) {
        console.log(user[0].mail);

        if (!user) console.log("User not found in AD");
        if (err) {
          console.log("ERROR: " + JSON.stringify(err));
          return err;
        } else console.log(user[0]), userController.getUserDB(userName, browserName, req, res, user[0].mail);
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
