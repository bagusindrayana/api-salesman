const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Pembayaran = new Schema({
    pelanggan_id : { type: Schema.Types.ObjectId, ref: 'Pelanggan' },
    tanggal_bayar: { type: Date },
    total_bayar: { type: Number },
    keterangan: { type: String },
    waktu_dibuat: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pembayaran", Pembayaran);