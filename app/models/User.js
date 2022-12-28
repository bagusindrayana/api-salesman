const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String },
    password: { type: String },
    token: { type: String },
    level: { type: String }
});

module.exports = mongoose.model("User", User);