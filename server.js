const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data (Passe api meka MongoDB walata connect karamu)
const hotels = [
    { id: 1, name: 'Galle Face Hotel', location: 'Colombo', price: '$100' },
    { id: 2, name: 'Cinnamon Lodge', location: 'Habarana', price: '$150' }
];

// API Route - Hotels list eka ganna
app.get('/api/hotels', (req, res) => {
    res.json(hotels);
});

// Server eka start kireema
app.listen(PORT, () => {
    console.log(`Backend server eka weda! Port: ${PORT}`);
});