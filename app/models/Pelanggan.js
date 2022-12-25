const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Pelanggan = new Schema({
    nama_usaha: { type: String },
    nama_pemilik: { type: String },
    alamat: { type: String },
    no_telp: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    waktu_dibuat: { type: Date, default: Date.now },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },

});

module.exports = mongoose.model("Pelanggan", Pelanggan);