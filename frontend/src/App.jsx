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
      <nav style={{ 
        padding: '16px 28px', 
        background: 'var(--navy-blue)', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '3px solid var(--primary)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: '0',
        zIndex: '1000'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '24px', 
            fontWeight: '800', 
            letterSpacing: '0.5px',
            fontFamily: 'var(--heading)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '28px' }}>🌴</span> Wander<span style={{ color: 'var(--primary)' }}>Lanka</span>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Home</Link>
          <Link to="/hotels" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>View Hotels</Link>
          <Link to="/register-hotel" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Register Hotel</Link>
          <Link to="/riders" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>View Riders</Link>
          <Link to="/register-rider" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Register Rider</Link>
          <Link to="/my-bookings" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontWeight: '700', 
            fontSize: '15px', 
            background: 'var(--primary)',
            padding: '8px 18px',
            borderRadius: '30px',
            boxShadow: '0 4px 10px rgba(0, 177, 168, 0.3)',
            transition: 'all 0.2s' 
          }} onMouseOver={(e) => { e.target.style.background = 'var(--primary-hover)'; e.target.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.transform = 'none'; }}>My Bookings</Link>
        </div>
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