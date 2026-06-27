const mongoose = require('mongoose');

// Hotel ekaka thiyenna oni visthara (Schema eka)
const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true }
});

module.exports = mongoose.model('Hotel', hotelSchema);