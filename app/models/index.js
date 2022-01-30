const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./users/user.model");
db.role = require("./users/role.model");

db.ROLES = ["user"];

module.exports = db;
