import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import HotelList from './HotelList';
import AddHotel from './AddHotel';
import RiderList from './RiderList';
import AddVehicle from './AddVehicle';
import BookingPage from './BookingPage';
import { useState, useEffect } from 'react';
import MyBookings from './MyBookings';
import RiderBookingPage from './RiderBookingPage';

function App() {
  const [hotels, setHotels] = useState([]);

  // Backend eken data genna ganna hook eka
  useEffect(() => {
    fetch('http://localhost:5001/api/hotels')
      .then((response) => response.json())
      .then((data) => setHotels(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <Router>
      <nav style={{ padding: '20px', background: '#222', display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/hotels" style={{ color: 'white', textDecoration: 'none' }}>View Hotels</Link>
        <Link to="/register-hotel" style={{ color: 'white', textDecoration: 'none' }}>Register Hotel</Link>
        <Link to="/riders" style={{ color: 'white', textDecoration: 'none' }}>View Riders</Link>
        <Link to="/register-rider" style={{ color: 'white', textDecoration: 'none' }}>Register Rider</Link>
        <Link to="/my-bookings" style={{ color: 'white', textDecoration: 'none' }}>My Bookings</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/register-hotel" element={<AddHotel />} />
        <Route path="/riders" element={<RiderList />} />
        <Route path="/register-rider" element={<AddVehicle />} />
        <Route path="/book/:id" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/book-rider/:id" element={<RiderBookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;