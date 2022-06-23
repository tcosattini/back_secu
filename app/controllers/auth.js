const UAParser = require("ua-parser-js");
const ActiveDirectory = require("activedirectory");
const constants = require("../constants");
const getUserDB = require("./users");

const loginAD = async function (req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  const parser = new UAParser();
  const ua = req.headers["user-agent"];
  const browserName = parser.setUA(ua).getBrowser().name;
  const ad = new ActiveDirectory(constants.AD_CONFIG);

  ad.authenticate(userName, password, function (err, auth) {
    if (auth) {
      ad.findUser(userName, function (err, user) {
        if (!user) console.log("User not found in AD");
        if (err) {
          console.log("ERROR: " + JSON.stringify(err));
          return err;
        } else getUserDB(userName, browserName, req, res, user);
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
};

module.exports = { loginAD };
