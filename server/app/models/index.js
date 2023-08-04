const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.process = require("./process.model");

db.ROLES = ["student", "admin", "faculty", "leader","moderator","user"];

module.exports = db;