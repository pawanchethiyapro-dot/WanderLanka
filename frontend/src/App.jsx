import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import HotelList from './HotelList';
import AddHotel from './AddHotel';
import RiderList from './RiderList';
import AddVehicle from './AddVehicle';

function App() {
  return (
    <Router>
      <nav style={{ padding: '20px', background: '#222', display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/hotels" style={{ color: 'white', textDecoration: 'none' }}>View Hotels</Link>
        <Link to="/register-hotel" style={{ color: 'white', textDecoration: 'none' }}>Register Hotel</Link>
        <Link to="/riders" style={{ color: 'white', textDecoration: 'none' }}>View Riders</Link>
        <Link to="/register-rider" style={{ color: 'white', textDecoration: 'none' }}>Register Rider</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/register-hotel" element={<AddHotel />} />
        <Route path="/riders" element={<RiderList />} />
        <Route path="/register-rider" element={<AddVehicle />} />
      </Routes>
    </Router>
  );
}

export default App;