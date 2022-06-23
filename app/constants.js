const rateLimit = require("express-rate-limit");

exports.DB_CONNECTION =
  "mongodb+srv://admin:FhHtxeWv6BU0WkzO@cluster0.rk4cw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

exports.AD_CONFIG = {
  url: "ldap://15.237.122.218:389",
  baseDN: "dc=epsidev, dc=lan",
  username: "Charly",
  password: "Azerty-77",
};

exports.BRUTEFORCE_CONFIG = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

exports.PORT = 8000;
