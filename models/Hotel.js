const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    ownerName: { type: String },
    commissionRate: { type: Number, default: 10 },
    lat: { type: Number },
    lng: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hotelPhoto: { type: String },
    starRating: { type: Number, min: 1, max: 5 },
    website: { type: String }
});

module.exports = mongoose.model('Hotel', hotelSchema);