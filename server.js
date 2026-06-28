const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Hotel = require('./models/Hotel'); // Aluth model eka api server ekata gannawa
const Vehicle = require('./models/Vehicle');


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
            { name: 'Galle Face Hotel', location: 'Colombo', price: '100000' },
            { name: 'Cinnamon Lodge', location: 'Habarana', price: '50000' },
            { name: 'Shangri-La', location: 'Colombo', price: '200000' } // Aluth hotel ekakuth damma
        ];
        await Hotel.insertMany(sampleHotels);
        res.json({ message: "Hotels tika database ekata add wuna! 🎉" });
    } catch (err) {
        res.status(500).json({ message: "Data daddi error ekak!", error: err.message });
    }
});


app.post('/api/hotels', async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        await newHotel.save();
        res.status(201).json({ message: "Hotel registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Server eka start kireema
app.listen(PORT, () => {
    console.log(`Backend server eka weda! Port: ${PORT}`);
});

const multer = require('multer');
const path = require('path');

// Image save karana folder eka hadamu
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Vehicle register karana route eka (photo ekath ekka)
app.post('/api/vehicles', upload.single('license'), async (req, res) => {
    try {
        const newVehicle = new Vehicle({
            ...req.body,
            licensePhoto: req.file ? req.file.path : null
        });
        await newVehicle.save();
        res.json({ message: "Vehicle and License registered! 🎉" });
    } catch (err) {
        console.error("Backend Error:", err); // Meka damma gaman terminal eke error eka penawa
        res.status(500).json({ error: err.message || "Something went wrong!" });
    }
});
// Vehicles tika ganna GET route eka
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find(); // Vehicle model eka use karala database eken data ganna
        res.status(200).json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Hotels tika ganna GET route eka (oyata one nam)
app.get('/api/hotels', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});