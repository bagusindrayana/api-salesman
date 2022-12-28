const Pembayaran = require("../models/Pembayaran");
const db = require("../configs/database");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

//make class PembayaranController
class PembayaranController {
    //constructor connect mongo db
    constructor() {
        mongoose.set('strictQuery', true);
    }

    //get all Pembayaran
    async index()  {
        
        var result = [];
        await Pembayaran.find()
            .then(function ( list_Pembayaran) {
                
                result = list_Pembayaran;
               
            });
        return result;
    }

    //get detail Pembayaran
    async detail(pembayaran_id) {
        
        var result = null;
        await Pembayaran.findById(pembayaran_id)
            .then(function(detail_Pembayaran) {
                
                result = detail_Pembayaran;
            });
        return result;
    }

    //create Pembayaran
    async create(req) {
        
        // Create a Pembayaran object with escaped and trimmed data.
        var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const pembayaran = new Pembayaran({
            pembayaranname: req.body.pembayaranname,
            password: bcrypt.hashSync(req.body.password, 16),
            token:token
        });

        return new Promise(pembayaran.save());
    
    }

    //update Pembayaran
    async update(req) {
        
        var result = null;
        const pembayaran = new Pembayaran({
            pembayaranname: req.body.pembayaranname,
            password: bcrypt.hashSync(req.body.password, 16)
        });

        await pembayaran.findByIdAndUpdate(req.params.id, pembayaran, {}, function (err, thePembayaran) {
            if (err) {
                return next(err);
            }
        }).then(function (pembayaran) {
            result = pembayaran;
        });
        return result;
    }

    //delete Pembayaran
    async delete(pembayaran_id) {
        
        var result = null;
        await pembayaran.findByIdAndRemove(pembayaran_id, function deletePembayaran(err) {
            if (err) {
                return next(err);
            }
            // Success - go to Pembayaran list
            result = "success";
        });
        return result;
    } 

}

module.exports = PembayaranController;