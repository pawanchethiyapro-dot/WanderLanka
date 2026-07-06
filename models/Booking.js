const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    date: Date,
    customerName: String,
    contactNumber: String,
    numberOfRooms: { type: Number, default: 1 },
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);