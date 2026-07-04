const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    driverName: { type: String, required: true },
    nic: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    pricePerDay: { type: Number, required: true },
    status: { type: String, default: 'available' },
    licensePhoto: { type: String }, // For Driving License
    riderPhoto: { type: String },    // For Rider Profile Picture
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);