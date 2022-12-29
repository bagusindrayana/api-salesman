//TagihanController with model from models/Tagihan
const Tagihan = require("../models/Tagihan");
const db = require("../configs/database");
const mongoose = require("mongoose");

//make class TagihanController
class TagihanController {
  //constructor connect mongo db
  constructor() {
    mongoose.set('strictQuery', true);


  }
  //get all tagihan
  async index(user) {

    var aggregate = [
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
      }, {
        '$addFields': {
          'sisa_tagihan': {
            '$subtract': [
              '$total_tagihan', '$total_bayar'
            ]
          }
        }
      },
      {
        '$lookup': {
          'from': 'pelanggans',
          'localField': 'pelanggan_id',
          'foreignField': '_id',
          'as': 'pelanggan'
        }
      },
      {
        '$unwind': '$pelanggan'
      },
      { '$sort': { 'waktu_dibuat': -1 } }
    ];
    if (user.level != "admin") {
      aggregate.push({
        '$match': {
          'pelanggan.user_id': user._id
        }
      });
    }
    return new Promise(resolve => {

      Tagihan.aggregate(aggregate, function (e, r) {
        resolve(r);
      });
    });

    return result;
  }

  //get detail tagihan
  async detail(tagihan_id) {

    var result = null;
    Tagihan.findById(tagihan_id)
      .populate("pelanggan_id")
      .then(function (detail_tagihan) {

        result = detail_tagihan;
      });
    return result;
  }

  //create tagihan
  async create(req) {

    var result = null;
    // Create a Tagihan object with escaped and trimmed data.
    const tagihan = new Tagihan({
      pelanggan_id: mongoose.Types.ObjectId(`${req.body.pelanggan_id}`),//Types.ObjectId
      tanggal_tagihan: req.body.tanggal_tagihan.split("-").reverse().join("-"),
      total_tagihan: req.body.total_tagihan,
      keterangan: req.body.keterangan,
      cash: req.body.cash,
    });

    await tagihan.save().then((user) => {
      result = user;
    })
      .catch((error) => {
        //When there are errors We handle them here
        console.log(error);


      })
    return result;
  }

  //update tagihan
  async update(tagihan_id, req) {


    var result = await Tagihan
      .findByIdAndUpdate(tagihan_id, {
        tanggal_tagihan: req.body.tanggal_tagihan,
        total_tagihan: req.body.total_tagihan,
        keterangan: req.body.keterangan,
        cash: req.body.cash
      }, {
        new: true
      });
    return result;
  }

  //delete tagihan
  async delete(tagihan_id) {

    await Tagihan.findByIdAndRemove(tagihan_id);


    return { berhasil: true };
  }

  //get all tagihan after tanggal_tagihan past 7 days
  async getTagihan7Hari() {


    return new Promise(resolve => {
      var result = [];
      Tagihan.aggregate([
        {
          '$group': {
            '_id': '$_id',
            'pembayaran': {
              '$first': '$pembayaran'
            },
            'total_bayar': {
              '$sum': {
                '$reduce': {
                  'input': "$pembayaran",
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
        }, {
          '$addFields': {
            'sisa_tagihan': {
              '$subtract': [
                '$total_tagihan', '$total_bayar'
              ]
            }
          }
        },
        {
          '$lookup': {
            'from': 'pelanggans',
            'localField': 'pelanggan_id',
            'foreignField': '_id',
            'as': 'pelanggan'
          }
        },
        {
          '$unwind': '$pelanggan'
        },
        { '$sort': { 'waktu_dibuat': -1 } }
      ], function (e, list_tagihan) {
        var today = new Date();
        list_tagihan.forEach(function (tagihan) {
          var todayPlus7 = new Date(tagihan.tanggal_tagihan);
          todayPlus7.setDate(todayPlus7.getDate() + 7);

          if (today >= todayPlus7 && tagihan.sisa_tagihan > 0) {
            result.push(tagihan);
          }
        });
        resolve(result);
      })
    });

  }

  async getTagihanByPelanggan(pelanggan_id) {


    return new Promise(resolve => {
      Tagihan.aggregate([
        {
          '$match': {
            'pelanggan_id': new mongoose.Types.ObjectId(`${pelanggan_id}`)
          }
        }, {
          '$group': {
            '_id': '$_id',

            'total_bayar': {
              '$sum': {
                '$reduce': {
                  'input': "$pembayaran",
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
        }, {
          '$addFields': {
            'sisa_tagihan': {
              '$subtract': [
                '$total_tagihan', '$total_bayar'
              ]
            }
          }
        },
        {
          '$lookup': {
            'from': 'pelanggans',
            'localField': 'pelanggan_id',
            'foreignField': '_id',
            'as': 'pelanggan'
          }
        },
        {
          '$unwind': '$pelanggan'
        },
        { $sort: { waktu_dibuat: -1 } }
      ], function (e, r) {
        resolve(r);
      })
    });
    await Tagihan.aggregate([
      {
        '$match': {
          'pelanggan_id': new mongoose.Types.ObjectId(`${pelanggan_id}`)
        }
      }, {
        '$group': {
          '_id': '$_id',

          'total_bayar': {
            '$sum': {
              '$reduce': {
                'input': "$pembayaran",
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
          }
        }
      }, {
        '$addFields': {
          'sisa_tagihan': {
            '$add': [
              '$total_tagihan', '$total_bayar'
            ]
          }
        }
      }
    ], function (e, r) {
      result = r;
    });
    return result;
  }

  async bayarTagihan(tagihan_id, req) {

    var result = null;
    await Tagihan.findOneAndUpdate({ _id: mongoose.Types.ObjectId(tagihan_id) },
      { $push: { "pembayaran": { "total_bayar": parseInt(req.body.total_bayar), "tanggal_bayar": req.body.tanggal_bayar, "keterangan": req.body.keterangan } } })
      .then(function (detail_tagihan) {

        result = detail_tagihan;
      });
    return result;
  }
}

module.exports = TagihanController;