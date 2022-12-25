const Pelanggan = require("../models/Pelanggan");
const Tagihan = require("../models/Tagihan");
const db = require("../configs/database");
const mongoose = require("mongoose");

class StatController {
    //constructor connect mongo db
    constructor() {
        mongoose.set('strictQuery', true);
    }

    async index() {
        await mongoose.connect(db.mongo_uri());
        var total_pelanggan = 0;
        var total_tagihan = 0;

        total_pelanggan = await Pelanggan.countDocuments();

        //sum total_tagihan from Tagihan
        await Tagihan.aggregate([
            {
                $group: {
                    _id: null,
                    total_tagihan: {
                        $sum: "$total_tagihan"
                    },
                    total_bayar: {
                        $sum: "$pembayaran.total_bayar"
                    },
                    
                }
                
                
            },{
                $addFields :{

                    sisa_tagihan : { $add : [ '$total_tagihan', '$total_bayar' ] }
                  }
            },{"$unset": ["_id"]}
        ],function (e,v) {
            total_tagihan = v[0]['sisa_tagihan'];
        });


        return {
            total_pelanggan: total_pelanggan,
            total_tagihan: total_tagihan
        };

    }
        
    
}

module.exports = StatController;