const User = require("../models/User");
const db = require("../configs/database");
const mongoose = require("mongoose");

//make function to verifiy token from user
async function verifyToken(req) {
    var result = null;
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        //check from database
        await mongoose.connect(db.mongo_uri(), { useNewUrlParser: true, useUnifiedTopology: true });
        
        await User.findOne({
            token:
                bearerToken
        }).then(function (user) {
            if (user) {
                result = user;
            }
        });
    }

    return result;
}


module.exports = {
    verifyToken : verifyToken
}
