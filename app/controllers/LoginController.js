const User = require("../models/User");
const db = require("../configs/database");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

//make class LoginController
class LoginController {
    //constructor connect mongo db
    constructor() {
        mongoose.set('strictQuery', true);
    }

    //login and return random token
    async login(req) {
        await mongoose.connect(db.mongo_uri(), { useNewUrlParser: true, useUnifiedTopology: true });
        var result = null;
        await User.findOne({ username: req.body.username })
            .then(function (user) {
                if (user) {
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                        result = user;
                    }
                }
            });
        //update user token
        if (result) {
            var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            await User.findByIdAndUpdate(result._id, { token: token }).then(function (user) {
                result.token = token;
            });
        }
        return result;
    }


}

module.exports = LoginController;