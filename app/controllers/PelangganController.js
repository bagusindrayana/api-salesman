const Pelanggan = require("../models/Pelanggan");
const db = require("../configs/database");
const mongoose = require("mongoose");
const Tagihan = require("../models/Tagihan");

//make class PelangganController
class PelangganController {
    //constructor connect mongo db
    constructor() {
        mongoose.set('strictQuery', true);
    }

    //get all pelanggan
    async index()  {
        await mongoose.connect(db.mongo_uri());
        var result = [];
        await Pelanggan.find()
            .then(function ( list_pelanggan) {
                
                result = list_pelanggan;
               
            });
        return result;
    }

    //get detail pelanggan
    async detail(pelanggan_id) {
        await mongoose.connect(db.mongo_uri());
        var result = null;
        await Pelanggan.findById(pelanggan_id)
            .then(function(detail_pelanggan) {
                
                result = detail_pelanggan;
            });
        return result;
    }

    //create pelanggan
    async create(req,user) {
        await mongoose.connect(db.mongo_uri());
        var result = null;
        // Create a Pelanggan object with escaped and trimmed data.
        const pelanggan = new Pelanggan({
            nama_usaha: req.body.nama_usaha,
            nama_pemilik: req.body.nama_pemilik,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            user_id : user._id
        });
        await pelanggan.save().then((user) => {
            result = user;
        })
        .catch((error) => {
            //When there are errors We handle them here
            console.log(error);

    
        });
 
        

        if(req.body.tanggal_tagihan != undefined && req.body.total_tagihan != undefined){
            var tanggal = req.body.tanggal_tagihan;
            //d-m-Y to Y-m-d
            var tanggal_tagihan = tanggal.split("-").reverse().join("-");
            const tagihan = new Tagihan({
                pelanggan_id:   result._id,
                tanggal_tagihan: tanggal_tagihan,
                total_tagihan: req.body.total_tagihan,
                keterangan: req.body.keterangan,
            });
            await tagihan.save();
        }
        return result;
    }

    //update pelanggan
    async update(req) {
        await mongoose.connect(db.mongo_uri());
        var result = null;
        const pelanggan = new Pelanggan({
            nama_usaha: req.body.nama_usaha,
            nama_pemilik: req.body.nama_pemilik,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        });

        await Pelanggan.findByIdAndUpdate(req.params.id, pelanggan, {}, function (err, thepelanggan) {
            if (err) {
                return next(err);
            }
            // Successful - redirect to pelanggan detail page.
            result = thepelanggan;
        });
        return result;
    }

    //delete pelanggan
    async delete(pelanggan_id) {
        await mongoose.connect(db.mongo_uri());
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

}

module.exports = PelangganController;