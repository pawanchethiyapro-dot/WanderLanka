const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    driverName: { type: String, required: true },
    nic: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    pricePerDay: { type: Number, required: true },
    status: { type: String, default: 'available' },
    licensePhoto: { type: String } // Meka thamai aluthenma damme
});

module.exports = mongoose.model('Vehicle', vehicleSchema);