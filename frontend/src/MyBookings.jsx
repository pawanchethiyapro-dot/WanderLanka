import { useState, useEffect } from 'react';
import axios from 'axios';

import { useCurrency } from './context/CurrencyContext';

function MyBookings() {
    const { convertPrice } = useCurrency();
    const [hotelBookings, setHotelBookings] = useState([]);
    const [riderBookings, setRiderBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('hotels');

    useEffect(() => {
        // Fetch Hotel Bookings
        axios.get('http://localhost:5001/api/bookings')
            .then(res => setHotelBookings(res.data))
            .catch(err => console.error('Error fetching hotel bookings:', err));

        // Fetch Rider Bookings
        axios.get('http://localhost:5001/api/rider-bookings')
            .then(res => setRiderBookings(res.data))
            .catch(err => console.error('Error fetching rider bookings:', err));
    }, []);

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--navy-blue)' }}>📋 My Bookings</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '45px', fontSize: '16px' }}>
                Keep track of your hotel stays and hired travel riders in Sri Lanka.
            </p>

            {/* Tab navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', gap: '15px' }}>
                <button 
                    onClick={() => setActiveTab('hotels')}
                    style={{
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        borderRadius: '30px',
                        border: activeTab === 'hotels' ? 'none' : '2px solid var(--primary)',
                        backgroundColor: activeTab === 'hotels' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'hotels' ? 'white' : 'var(--primary)',
                        boxShadow: activeTab === 'hotels' ? '0 4px 12px rgba(0, 177, 168, 0.25)' : 'none',
                        transition: 'all 0.3s'
                    }}
                >
                    🏨 Hotel Bookings ({hotelBookings.length})
                </button>
                <button 
                    onClick={() => setActiveTab('riders')}
                    style={{
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        borderRadius: '30px',
                        border: activeTab === 'riders' ? 'none' : '2px solid var(--primary)',
                        backgroundColor: activeTab === 'riders' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'riders' ? 'white' : 'var(--primary)',
                        boxShadow: activeTab === 'riders' ? '0 4px 12px rgba(0, 177, 168, 0.25)' : 'none',
                        transition: 'all 0.3s'
                    }}
                >
                    🚗 Rider Bookings ({riderBookings.length})
                </button>
            </div>

            {/* Bookings Display */}
            {activeTab === 'hotels' ? (
                <div>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-h)', fontSize: '22px' }}>Hotel Reservations</h2>
                    {hotelBookings.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '50px 20px', background: 'var(--bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                            <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>🏨</span>
                            <p style={{ margin: '0' }}>No hotel bookings found. Go to "View Hotels" to make a reservation!</p>
                        </div>
                    ) : (
                        <div className="card-container" style={{ padding: '0' }}>
                            {hotelBookings.map(b => (
                                <div key={b._id} className="card" style={{ padding: '24px', border: '1px solid var(--border)', textAlign: 'left', background: 'var(--social-bg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <h3 style={{ margin: '0', color: 'var(--text-h)', fontSize: '18px' }}>
                                            {b.hotelId ? b.hotelId.name : 'Unknown Hotel'}
                                        </h3>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px', 
                                            fontWeight: '700', 
                                            background: b.status === 'Pending' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(40, 167, 69, 0.15)',
                                            color: b.status === 'Pending' ? '#e65100' : '#1b5e20'
                                        }}>
                                            {b.status}
                                        </span>
                                    </div>
                                    {b.hotelId && (
                                        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                                            <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>📍 Location:</strong> {b.hotelId.location}</p>
                                            <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>💰 Price:</strong> {convertPrice(b.hotelId.price)} / Night</p>
                                        </div>
                                    )}
                                    <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>👤 Guest Name:</strong> {b.customerName}</p>
                                    <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>📅 Check-in Date:</strong> {new Date(b.checkInDate).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-h)', fontSize: '22px' }}>Rider/Vehicle Bookings</h2>
                    {riderBookings.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '50px 20px', background: 'var(--bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                            <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>🚗</span>
                            <p style={{ margin: '0' }}>No rider bookings found. Go to "View Riders" to hire a driver!</p>
                        </div>
                    ) : (
                        <div className="card-container" style={{ padding: '0' }}>
                            {riderBookings.map(b => (
                                <div key={b._id} className="card" style={{ padding: '24px', border: '1px solid var(--border)', textAlign: 'left', background: 'var(--social-bg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <h3 style={{ margin: '0', color: 'var(--text-h)', fontSize: '18px' }}>
                                            🚗 {b.riderId ? b.riderId.driverName : 'Unknown Driver'}
                                        </h3>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px', 
                                            fontWeight: '700', 
                                            background: b.status === 'Pending' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(40, 167, 69, 0.15)',
                                            color: b.status === 'Pending' ? '#e65100' : '#1b5e20'
                                        }}>
                                            {b.status}
                                        </span>
                                    </div>
                                    {b.riderId && (
                                        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                                            <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Vehicle Type:</strong> {b.riderId.vehicleType}</p>
                                            <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Plate Number:</strong> {b.riderId.plateNumber}</p>
                                            <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Contact Phone:</strong> {b.riderId.phone}</p>
                                            <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>💰 Price:</strong> {convertPrice(b.riderId.pricePerDay)} / Day</p>
                                        </div>
                                    )}
                                    <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>👤 Passenger Name:</strong> {b.customerName}</p>
                                    <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>📅 Hired Date:</strong> {new Date(b.bookingDate).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MyBookings;