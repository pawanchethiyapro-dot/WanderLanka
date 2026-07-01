import { useState, useEffect } from 'react';
import axios from 'axios';

function MyBookings() {
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
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My Bookings</h1>

            {/* Tab navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '15px' }}>
                <button 
                    onClick={() => setActiveTab('hotels')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: '25px',
                        border: activeTab === 'hotels' ? 'none' : '2px solid var(--accent)',
                        backgroundColor: activeTab === 'hotels' ? 'var(--accent)' : 'transparent',
                        color: activeTab === 'hotels' ? 'white' : 'var(--accent)',
                        transition: 'all 0.3s'
                    }}
                >
                    🏨 Hotel Bookings ({hotelBookings.length})
                </button>
                <button 
                    onClick={() => setActiveTab('riders')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: '25px',
                        border: activeTab === 'riders' ? 'none' : '2px solid var(--accent)',
                        backgroundColor: activeTab === 'riders' ? 'var(--accent)' : 'transparent',
                        color: activeTab === 'riders' ? 'white' : 'var(--accent)',
                        transition: 'all 0.3s'
                    }}
                >
                    🚗 Rider Bookings ({riderBookings.length})
                </button>
            </div>

            {/* Bookings Display */}
            {activeTab === 'hotels' ? (
                <div>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Hotel Reservations</h2>
                    {hotelBookings.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No hotel bookings found.</p>
                    ) : (
                        <div className="card-container">
                            {hotelBookings.map(b => (
                                <div key={b._id} className="card" style={{ padding: '20px', border: '1px solid var(--border)', textAlign: 'left', background: 'var(--social-bg)' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-h)' }}>
                                        {b.hotelId ? b.hotelId.name : 'Unknown Hotel'}
                                    </h3>
                                    {b.hotelId && (
                                        <>
                                            <p style={{ margin: '5px 0' }}><strong>📍 Location:</strong> {b.hotelId.location}</p>
                                            <p style={{ margin: '5px 0' }}><strong>💰 Price:</strong> Rs. {b.hotelId.price}</p>
                                        </>
                                    )}
                                    <p style={{ margin: '5px 0' }}><strong>👤 Customer Name:</strong> {b.customerName}</p>
                                    <p style={{ margin: '5px 0' }}><strong>📅 Check-in Date:</strong> {new Date(b.checkInDate).toLocaleDateString()}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span style={{ color: b.status === 'Pending' ? '#ff9800' : '#28a745', fontWeight: 'bold' }}>{b.status}</span></p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Rider/Vehicle Bookings</h2>
                    {riderBookings.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No rider bookings found.</p>
                    ) : (
                        <div className="card-container">
                            {riderBookings.map(b => (
                                <div key={b._id} className="card" style={{ padding: '20px', border: '1px solid var(--border)', textAlign: 'left', background: 'var(--social-bg)' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-h)' }}>
                                        🚗 {b.riderId ? b.riderId.driverName : 'Unknown Driver'}
                                    </h3>
                                    {b.riderId && (
                                        <>
                                            <p style={{ margin: '5px 0' }}><strong>Vehicle:</strong> {b.riderId.vehicleType}</p>
                                            <p style={{ margin: '5px 0' }}><strong>Plate Number:</strong> {b.riderId.plateNumber}</p>
                                            <p style={{ margin: '5px 0' }}><strong>Contact Phone:</strong> {b.riderId.phone}</p>
                                            <p style={{ margin: '5px 0' }}><strong>Price:</strong> Rs. {b.riderId.pricePerDay} / Day</p>
                                        </>
                                    )}
                                    <p style={{ margin: '5px 0' }}><strong>👤 Customer Name:</strong> {b.customerName}</p>
                                    <p style={{ margin: '5px 0' }}><strong>📅 Booking Date:</strong> {new Date(b.bookingDate).toLocaleDateString()}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span style={{ color: b.status === 'Pending' ? '#ff9800' : '#28a745', fontWeight: 'bold' }}>{b.status}</span></p>
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