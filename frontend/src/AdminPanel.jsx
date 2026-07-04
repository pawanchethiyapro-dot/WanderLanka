import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Building2, Bike, CalendarDays, ContactRound } from 'lucide-react';

function AdminPanel() {
    const [activeTab, setActiveTab] = useState('hotels');
    const [hotels, setHotels] = useState([]);
    const [riders, setRiders] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [riderBookings, setRiderBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [hotelsRes, ridersRes, hotelBookingsRes, riderBookingsRes] = await Promise.all([
                axios.get('http://localhost:5001/api/hotels'),
                axios.get('http://localhost:5001/api/vehicles'),
                axios.get('http://localhost:5001/api/bookings'),
                axios.get('http://localhost:5001/api/rider-bookings')
            ]);
            setHotels(hotelsRes.data);
            setRiders(ridersRes.data);
            setHotelBookings(hotelBookingsRes.data);
            setRiderBookings(riderBookingsRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (endpoint, id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await axios.delete(`http://localhost:5001/api/${endpoint}/${id}`);
                fetchData(); // Refresh data after deletion
            } catch (error) {
                alert('Error deleting record');
                console.error(error);
            }
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: activeTab === id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === id ? 'white' : '#a1a1aa',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: activeTab === id ? '0 4px 12px rgba(0, 177, 168, 0.3)' : 'none'
            }}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <div className="page-container" style={{ padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Dashboard</h1>
                    <p style={{ color: '#a1a1aa' }}>Manage all platform records centrally.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <TabButton id="hotels" label="Hotels" icon={Building2} />
                    <TabButton id="riders" label="Riders" icon={Bike} />
                    <TabButton id="hotelBookings" label="Hotel Bookings" icon={CalendarDays} />
                    <TabButton id="riderBookings" label="Rider Bookings" icon={ContactRound} />
                </div>

                <div className="form-card" style={{ padding: '0', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>Loading data...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                                        {activeTab === 'hotels' && (
                                            <>
                                                <th style={thStyle}>Hotel Name</th>
                                                <th style={thStyle}>Location</th>
                                                <th style={thStyle}>Price (LKR)</th>
                                                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                                            </>
                                        )}
                                        {activeTab === 'riders' && (
                                            <>
                                                <th style={thStyle}>Driver Name</th>
                                                <th style={thStyle}>Vehicle Type</th>
                                                <th style={thStyle}>Plate Number</th>
                                                <th style={thStyle}>Phone</th>
                                                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                                            </>
                                        )}
                                        {activeTab === 'hotelBookings' && (
                                            <>
                                                <th style={thStyle}>Customer</th>
                                                <th style={thStyle}>Hotel</th>
                                                <th style={thStyle}>Date</th>
                                                <th style={thStyle}>Rooms</th>
                                                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                                            </>
                                        )}
                                        {activeTab === 'riderBookings' && (
                                            <>
                                                <th style={thStyle}>Customer</th>
                                                <th style={thStyle}>Rider (Vehicle)</th>
                                                <th style={thStyle}>Date</th>
                                                <th style={thStyle}>Duration</th>
                                                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTab === 'hotels' && hotels.map(hotel => (
                                        <tr key={hotel._id} style={trStyle}>
                                            <td style={tdStyle}>{hotel.name}</td>
                                            <td style={tdStyle}>{hotel.location}</td>
                                            <td style={tdStyle}>{hotel.price}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <button className="action-btn delete-btn" onClick={() => handleDelete('hotels', hotel._id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'riders' && riders.map(rider => (
                                        <tr key={rider._id} style={trStyle}>
                                            <td style={tdStyle}>{rider.driverName}</td>
                                            <td style={tdStyle}>{rider.vehicleType}</td>
                                            <td style={tdStyle}>{rider.plateNumber}</td>
                                            <td style={tdStyle}>{rider.phone}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <button className="action-btn delete-btn" onClick={() => handleDelete('vehicles', rider._id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'hotelBookings' && hotelBookings.map(booking => (
                                        <tr key={booking._id} style={trStyle}>
                                            <td style={tdStyle}>{booking.customerName} <br/><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{booking.contactNumber}</span></td>
                                            <td style={tdStyle}>{booking.hotelId?.name || 'Unknown Hotel'}</td>
                                            <td style={tdStyle}>{new Date(booking.date).toLocaleDateString()}</td>
                                            <td style={tdStyle}>{booking.numberOfRooms}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <button className="action-btn delete-btn" onClick={() => handleDelete('bookings', booking._id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'riderBookings' && riderBookings.map(booking => (
                                        <tr key={booking._id} style={trStyle}>
                                            <td style={tdStyle}>{booking.customerName} <br/><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{booking.contactNumber}</span></td>
                                            <td style={tdStyle}>{booking.riderId?.driverName || 'Unknown Rider'}</td>
                                            <td style={tdStyle}>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                            <td style={tdStyle}>{booking.numberOfDays} days</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <button className="action-btn delete-btn" onClick={() => handleDelete('rider-bookings', booking._id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {((activeTab === 'hotels' && hotels.length === 0) ||
                              (activeTab === 'riders' && riders.length === 0) ||
                              (activeTab === 'hotelBookings' && hotelBookings.length === 0) ||
                              (activeTab === 'riderBookings' && riderBookings.length === 0)) && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                    No records found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .action-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-btn:hover {
                    background: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                }
                .delete-btn:hover {
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.3);
                    background: rgba(239, 68, 68, 0.1);
                }
            `}</style>
        </div>
    );
}

const thStyle = {
    padding: '16px 24px',
    fontWeight: '600',
    fontSize: '0.9rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
};

const tdStyle = {
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#f8fafc',
    fontSize: '0.95rem'
};

const trStyle = {
    transition: 'background 0.2s'
};

export default AdminPanel;
