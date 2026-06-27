const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Hotel = require('./models/Hotel'); // Aluth model eka api server ekata gannawa

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Database ekata lassanata connect una! 🎉'))
  .catch((err) => console.log('MongoDB connect weddi error ekak:', err));

// 1. API Route - Database eken Hotels list eka ganna (GET)
app.get('/api/hotels', async (req, res) => {
    try {
        const hotels = await Hotel.find(); // DB eken data gannawa
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. API Route - Aluth Hotel ekak DB ekata danna (POST)
app.post('/api/hotels', async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.json(savedHotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. SEED Route - Eka parak run karala lesiyenma DB ekata data danna
app.get('/api/seed', async (req, res) => {
    try {
        const sampleHotels = [
            { name: 'Galle Face Hotel', location: 'Colombo', price: '$100' },
            { name: 'Cinnamon Lodge', location: 'Habarana', price: '$150' },
            { name: 'Shangri-La', location: 'Colombo', price: '$200' } // Aluth hotel ekakuth damma
        ];
        await Hotel.insertMany(sampleHotels);
        res.json({ message: "Hotels tika database ekata add wuna! 🎉" });
    } catch (err) {
        res.status(500).json({ message: "Data daddi error ekak!", error: err.message });
    }
});

// Server eka start kireema
app.listen(PORT, () => {
    console.log(`Backend server eka weda! Port: ${PORT}`);
});