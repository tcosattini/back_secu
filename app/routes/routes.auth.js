var express = require("express");
const router = express.Router();
var AuthController = require("../controllers/auth.js");
var cors = require("cors");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.post("/api/check", cors(), jsonParser, (req, res) => {
  AuthController.loginAD(req, res);
});

// router.post("/api/check", cors(), jsonParser, (req, res) => {
//   AuthController.loginAD(req, res);
// });

module.exports = router;
