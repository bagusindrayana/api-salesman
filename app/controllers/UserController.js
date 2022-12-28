const User = require("../models/User");
const db = require("../configs/database");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

//make class UserController
class UserController {
    //constructor connect mongo db
    constructor() {
        mongoose.set('strictQuery', true);
    }

    //get all User
    async index()  {
        
        var result = [];
        await User.find()
            .then(function ( list_User) {
                
                result = list_User;
               
            });
        return result;
    }

    //get detail User
    async detail(user_id) {
        
        var result = null;
        await User.findById(user_id)
            .then(function(detail_User) {
                
                result = detail_User;
            });
        return result;
    }

    //create User
    async create(req) {
        
        // Create a User object with escaped and trimmed data.
        var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return new Promise(function(resolve, reject) {
            const user = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 16),
                token:token,
                level: req.body.level
            });
            user.save(function (err) {
                if (err) {
                    reject(err);
                }
                resolve(user);
            });
        });

        
    
    }

    //update User
    async update(req) {
        
        var result = null;
        const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 16)
        });

        await user.findByIdAndUpdate(req.params.id, user, {}, function (err, theUser) {
            if (err) {
                return next(err);
            }
        }).then(function (user) {
            result = user;
        });
        return result;
    }

    //delete User
    async delete(user_id) {
        
        var result = null;
        await user.findByIdAndRemove(user_id, function deleteUser(err) {
            if (err) {
                return next(err);
            }
            // Success - go to User list
            result = "success";
        });
        return result;
    } 

}

module.exports = UserController;