const Pelanggan = require("../models/Pelanggan");
const db = require("../configs/database");
const mongoose = require("mongoose");
const Tagihan = require("../models/Tagihan");
const e = require("express");
const Pembayaran = require("../models/Pembayaran");

//make class PelangganController
class PelangganController {
    //constructor connect mongo db
    constructor() {
        mongoose.set('strictQuery', true);
    }

    //get all pelanggan
    async index() {
        
        var result = [];
        await Pelanggan.find()
            .sort({ waktu_dibuat: -1 })
            .then(function (list_pelanggan) {

                result = list_pelanggan;

            });
        return result;
    }

    //get detail pelanggan
    async detail(pelanggan_id) {
        
        return new Promise(resolve => {
            Pelanggan.aggregate([
                {
                    $match: { 
                        _id: mongoose.Types.ObjectId(pelanggan_id)
                    }
                },
                {
                    '$lookup': {
                        'from': 'tagihans',
                        'localField': '_id',
                        'foreignField': 'pelanggan_id',
                        'as': 'tagihans'
                    }
                },  {
                    '$lookup': {
                        'from': 'pembayarans',
                        'localField': '_id',
                        'foreignField': 'pelanggan_id',
                        'as': 'pembayarans'
                    }
                },{
                    '$group': {
                        '_id': '$_id',
                        'total_tagihan': {
                            '$sum': {
                                '$reduce': {
                                    'input': '$tagihans',
                                    'initialValue': 0,
                                    'in': {
                                        '$add': [
                                            '$$value', '$$this.total_tagihan'
                                        ]
                                    }
                                }
                            }
                        },
                        'total_bayar': {
                            '$sum': {
                                '$reduce': {
                                    'input': '$pembayarans',
                                    'initialValue': 0,
                                    'in': {
                                        '$add': [
                                            '$$value', '$$this.total_bayar'
                                        ]
                                    }
                                }
                            }
                        },
                        'latitude': {
                            $first: '$latitude'
                        },
                        'longitude': {
                            $first: '$longitude'
                        },
                        'nama_usaha': {
                            $first: '$nama_usaha'
                        },
                        'nama_pemilik': {
                            $first: '$nama_pemilik'
                        },
                        'alamat': {
                            $first: '$alamat'
                        },
                        'no_telp': {
                            $first: '$no_telp'
                        }
                    }
                }
            ],function(err, result) {
                resolve(result[0]);
            });
        });
        // var result = null;
        // await Pelanggan.findById(pelanggan_id)
        //     .then(function (detail_pelanggan) {

        //         result = detail_pelanggan;
        //     });
        // return result;
    }

    //create pelanggan
    async create(req, user) {
        
        var result = null;
        // Create a Pelanggan object with escaped and trimmed data.
        const pelanggan = new Pelanggan({
            nama_usaha: req.body.nama_usaha,
            nama_pemilik: req.body.nama_pemilik,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            user_id: user._id
        });
        await pelanggan.save().then((user) => {
            result = user;
        })
            .catch((error) => {
                //When there are errors We handle them here
                console.log(error);


            });



        if (req.body.tanggal_tagihan != undefined && req.body.total_tagihan != undefined) {
            var tanggal = req.body.tanggal_tagihan;
            //d-m-Y to Y-m-d
            var tanggal_tagihan = tanggal.split("-").reverse().join("-");
            const tagihan = new Tagihan({
                pelanggan_id: result._id,
                tanggal_tagihan: tanggal_tagihan,
                total_tagihan: req.body.total_tagihan,
                keterangan: req.body.keterangan,
            });
            await tagihan.save();
        }
        return result;
    }

    //update pelanggan
    async update(pelanggan_id, req) {
        

        //const pelanggan = new Pelanggan();

        var result = await Pelanggan.findByIdAndUpdate(pelanggan_id, {
            nama_usaha: req.body.nama_usaha,
            nama_pemilik: req.body.nama_pemilik,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        }, {
            new: true
        });
        return result;
    }

    //delete pelanggan
    async delete(pelanggan_id) {
        
        var result = null;
        await Pelanggan.findByIdAndRemove(pelanggan_id, function deletePelanggan(err) {
            if (err) {
                return next(err);
            }
            // Success - go to pelanggan list
            result = "success";
        });
        return result;
    }

    async tagihanPelanggan7hari() {
        

        return new Promise(resolve => {
            var result = [];
            Pelanggan.aggregate([
   
                    {
                        '$lookup': {
                            'from': 'tagihans',
                            'localField': '_id',
                            'foreignField': 'pelanggan_id',
                            'as': 'tagihans'
                        }
                    },  {
                        '$lookup': {
                            'from': 'pembayarans',
                            'localField': '_id',
                            'foreignField': 'pelanggan_id',
                            'as': 'pembayarans'
                        }
                    },{
                        '$group': {
                            '_id': '$_id',
                            'total_tagihan': {
                                '$sum': {
                                    '$reduce': {
                                        'input': '$tagihans',
                                        'initialValue': 0,
                                        'in': {
                                            '$add': [
                                                '$$value', '$$this.total_tagihan'
                                            ]
                                        }
                                    }
                                }
                            },
                            'total_bayar': {
                                '$sum': {
                                    '$reduce': {
                                        'input': '$pembayarans',
                                        'initialValue': 0,
                                        'in': {
                                            '$add': [
                                                '$$value', '$$this.total_bayar'
                                            ]
                                        }
                                    }
                                }
                            },
                            'latitude': {
                                $first: '$latitude'
                            },
                            'longitude': {
                                $first: '$longitude'
                            },
                            'nama_usaha': {
                                $first: '$nama_usaha'
                            },
                            'alamat': {
                                $first: '$alamat'
                            },
                            'no_telp': {
                                $first: '$no_telp'
                            }
                        }
                    }, {
                        '$lookup': {
                            'from': 'tagihans',
                            'let': {
                                'pelanggan_id': '$_id'
                            },
                            'localField': '_id',
                            'foreignField': 'pelanggan_id',
                            'as': 'tagihan_terbaru',
                            'pipeline': [
                                {
                                    '$match': {
                                        '$expr': {
                                            '$eq': [
                                                '$pelanggan_id', '$$pelanggan_id'
                                            ]
                                        }
                                    }
                                }, {
                                    '$sort': {
                                        'tanggal_tagihan': -1
                                    }
                                }, {
                                    '$limit': 1
                                }
                            ]
                        }
                    }, {
                        '$unwind': {
                            'path': '$tagihan_terbaru',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$addFields': {
                            'sisa_tagihan': {
                                '$subtract': [
                                    '$total_tagihan', '$total_bayar'
                                ]
                            }
                        }
                    }
                ]
            , function (e, list_tagihan) {
                var today = new Date();
                list_tagihan.forEach(function (tagihan) {
                    
                    var todayPlus7 = new Date(tagihan.tagihan_terbaru.tanggal_tagihan);
                    todayPlus7.setDate(todayPlus7.getDate() + 7);

                    if (today >= todayPlus7 && tagihan.sisa_tagihan > 0) {
                        result.push(tagihan);
                    }
                });
                resolve(result);
            })
        });
    }

    async tambahPembayaran(pelanggan_id, req) {
        

        var result = null;
       
        const pembayaran = new Pembayaran({
          pelanggan_id: mongoose.Types.ObjectId(`${pelanggan_id}`),//Types.ObjectId
          tanggal_bayar: req.body.tanggal_bayar.split("-").reverse().join("-"),
          total_bayar: req.body.total_bayar,
          keterangan: req.body.keterangan,
        });
    
        await pembayaran.save().then((pembayaran) => {
          result = pembayaran;
        })
          .catch((error) => {
            //When there are errors We handle them here
            console.log(error);
    
    
          })
        return result;

    }

    async getRiwayatPembayaran(pelanggan_id) {
        
    
        return new Promise(resolve => {
          Pembayaran.aggregate([
            {
              '$match': {
                'pelanggan_id': new mongoose.Types.ObjectId(`${pelanggan_id}`)
              }
            },
            { $sort : { tanggal_bayar : -1 } }
          ], function (e, r) {
            resolve(r);
          })
        });
    }

}

module.exports = PelangganController;