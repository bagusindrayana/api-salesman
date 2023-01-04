const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

//make class KurirController
class KurirController {
    //constructor connect mongo db
    constructor() {
        mongoose.set('strictQuery', true);
    }

    //get all User
    async index()  {
        
        var result = [];
        await User.find({level:"kurir"})
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
                nama: req.body.nama,
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 16),
                token:token,
                level: "kurir"
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
    async update(user_id,req) {
       
        var data = {
            username: req.body.username,
            nama: req.body.nama
        };

        if(req.body.password != null && req.body.password.trim() != ""){
            data.password = bcrypt.hashSync(req.body.password, 16);
        }
        var result = await User.findByIdAndUpdate(user_id, data, {
            new: true
        });
        return result;
        
    }

    //delete User
    async delete(user_id) {
        
        var result = await User.findByIdAndRemove(user_id);
        if(result){
            return {berhasil:true};
        }
        return {berhasil:false};
    } 


}

module.exports = KurirController;