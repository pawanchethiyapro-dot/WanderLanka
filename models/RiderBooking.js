const mongoose = require('mongoose');

const riderBookingSchema = new mongoose.Schema({
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    customerName: { type: String, required: true },
    contactNumber: { type: String },
    numberOfDays: { type: Number, default: 1 },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('RiderBooking', riderBookingSchema);
