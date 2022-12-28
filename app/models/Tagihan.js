const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Tagihan = new Schema({
    pelanggan_id : { type: Schema.Types.ObjectId, ref: 'Pelanggan' },
    tanggal_tagihan: { type: Date },
    total_tagihan: { type: Number },
    keterangan: { type: String },
    waktu_dibuat: { type: Date, default: Date.now },
    cash : { type: Boolean, default: false },
});

module.exports = mongoose.model("Tagihan", Tagihan);