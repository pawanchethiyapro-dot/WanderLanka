const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    itemType: { type: String, required: true, enum: ['Hotel', 'Vehicle'] },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
