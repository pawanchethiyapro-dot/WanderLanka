import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import HotelList from './HotelList';
import AddHotel from './AddHotel';
import RiderList from './RiderList';
import AddVehicle from './AddVehicle';
import BookingPage from './BookingPage';
import { useState, useEffect } from 'react';
import MyBookings from './MyBookings';
import RiderBookingPage from './RiderBookingPage';
import AdminPanel from './AdminPanel';
import Partner from './Partner';
import Login from './Login';
import Settings from './Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import ItineraryPlanner from './ItineraryPlanner';

const PrivateRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

const Navigation = () => {
    const { user, logout } = useAuth();

    return (
      <nav style={{ 
        padding: '16px 28px', 
        background: 'var(--navy-blue)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
          <Link to="/" className="nav-link" style={navLinkStyle}>Home</Link>
          <Link to="/hotels" className="nav-link" style={navLinkStyle}>View Hotels</Link>
          <Link to="/riders" className="nav-link" style={navLinkStyle}>View Riders</Link>
          <Link to="/itinerary" className="nav-link" style={navLinkStyle}>Route Planner</Link>
          {!user && <Link to="/partner" className="nav-link" style={navLinkStyle}>Partner With Us</Link>}
          
          {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link" style={navLinkStyle}>Admin</Link>
          )}

          {user && (
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
          )}

          {!user ? (
            <Link to="/login" style={navLinkStyle}>Login</Link>
          ) : (
            <>
              <Link to="/settings" style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SettingsIcon size={16} /> Settings
              </Link>
              <button onClick={logout} style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
                  <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </nav>
    );
};

const navLinkStyle = { color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '15px', transition: 'color 0.2s' };

function App() {
  return (
    <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/hotels" element={<HotelList />} />
            <Route path="/itinerary" element={<ItineraryPlanner />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/register-hotel" element={<AddHotel />} />
            <Route path="/riders" element={<RiderList />} />
            <Route path="/register-rider" element={<AddVehicle />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/my-bookings" element={
                <PrivateRoute>
                    <MyBookings />
                </PrivateRoute>
            } />
            <Route path="/book-rider/:id" element={<RiderBookingPage />} />
            <Route path="/settings" element={
                <PrivateRoute>
                    <Settings />
                </PrivateRoute>
            } />
            <Route path="/admin" element={
                <PrivateRoute role="admin">
                    <AdminPanel />
                </PrivateRoute>
            } />
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;