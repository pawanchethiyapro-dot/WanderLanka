const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const Hotel = require('./models/Hotel'); 
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');
const { protect, admin } = require('./middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Database ekata lassanata connect una! 🎉'))
  .catch((err) => console.log('MongoDB connect weddi error ekak:', err));

// 1. API Route - Database eken Hotels list eka ganna (GET)
app.get('/api/hotels', async (req, res) => {
    try {
        const hotels = await Hotel.find(); 
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// AUTHENTICATION ROUTES
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'wanderlanka_super_secret', { expiresIn: '30d' });
};

app.post('/api/auth/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        
        const user = await User.create({ email, password, role });
        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        const adminExists = await User.findOne({ email: 'admin@wanderlanka.com' });
        if (!adminExists) {
            await User.create({ email: 'admin@wanderlanka.com', password: 'password123', role: 'admin' });
        }

        const sampleHotels = [
            { name: 'Galle Face Hotel', location: 'Colombo', price: 100000, lat: 6.9238, lng: 79.8457 },
            { name: 'Cinnamon Lodge', location: 'Habarana', price: 50000, lat: 8.0333, lng: 80.7500 },
            { name: 'Shangri-La', location: 'Colombo', price: 200000, lat: 6.9280, lng: 79.8441 }
        ];
        await Hotel.insertMany(sampleHotels);
        res.json({ message: "Admin and Hotels database ekata add wuna! 🎉 (Admin login: admin@wanderlanka.com / password123)" });
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

// Image save karana folder eka hadamu
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Vehicle register karana route eka (photos dekath ekka)
app.post('/api/vehicles', upload.fields([{ name: 'riderPhoto', maxCount: 1 }, { name: 'licensePhoto', maxCount: 1 }]), async (req, res) => {
    try {
        const newVehicle = new Vehicle({
            ...req.body,
            riderPhoto: req.files && req.files['riderPhoto'] ? req.files['riderPhoto'][0].path : null,
            licensePhoto: req.files && req.files['licensePhoto'] ? req.files['licensePhoto'][0].path : null
        });
        await newVehicle.save();
        res.json({ message: "Vehicle, Rider Photo, and License registered! 🎉" });
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

const Booking = require('./models/Booking');

// Booking submit karana route eka
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: "Booking successful!", booking: newBooking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const RiderBooking = require('./models/RiderBooking');

app.post('/api/rider-bookings', async (req, res) => {
    try {
        const newRiderBooking = new RiderBooking(req.body);
        await newRiderBooking.save();
        res.status(201).json({ message: 'Rider booking successful!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET route to retrieve hotel bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('hotelId');
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET route to retrieve rider bookings
app.get('/api/rider-bookings', async (req, res) => {
    try {
        const riderBookings = await RiderBooking.find().populate('riderId');
        res.status(200).json(riderBookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Panel DELETE routes
app.delete('/api/hotels/:id', protect, admin, async (req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hotel deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/vehicles/:id', protect, admin, async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/bookings/:id', protect, admin, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/rider-bookings/:id', protect, admin, async (req, res) => {
    try {
        await RiderBooking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rider booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

