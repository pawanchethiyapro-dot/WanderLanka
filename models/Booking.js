const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    checkInDate: Date,
    customerName: String,
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);