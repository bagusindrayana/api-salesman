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
        
        var total_pelanggan = 0;
        var total_tagihan = 0;

    
        //sum total_tagihan from Tagihan
        await Tagihan.aggregate([
          {
            '$lookup': {
                'from': 'pembayarans',
                'localField': 'pelanggan_id',
                'foreignField': 'pelanggan_id',
                'as': 'pembayarans'
            }
        },
            {
                '$group': {
                    '_id': '$_id',
        
                    'total_bayar': {
                      '$sum': {
                        '$reduce': {
                          'input': "$pembayarans",
                          'initialValue': 0,
                          'in': { '$add': ["$$value", "$$this.total_bayar"] }
                        }
                      }
                    },
                    'total_tagihan': {
                      '$first': '$total_tagihan'
                    },
                    'tanggal_tagihan': {
                      '$first': '$tanggal_tagihan'
                    },
                    'keterangan': {
                      '$first': '$keterangan'
                    },
                    'pembayaran': {
                      '$first': '$pembayaran'
                    },
                    'pelanggan_id': {
                      '$first': '$pelanggan_id'
                    }
                  }
                
                
            },{
                '$addFields': {
                  'sisa_tagihan': {
                    '$subtract': [
                      '$total_tagihan', '$total_bayar'
                    ]
                  }
                }
              },{"$unset": ["_id"]},
              { $sort : { tanggal_tagihan : -1 } }
        ],function (e,v) {
            for (let index = 0; index < v.length; index++) {
                const element = v[index];
                total_tagihan += element['sisa_tagihan'];
                
            }
        });

        total_pelanggan = await Pelanggan.countDocuments();

        return {
            total_pelanggan: total_pelanggan,
            total_tagihan: total_tagihan
        };

    }
        
    
}

module.exports = StatController;