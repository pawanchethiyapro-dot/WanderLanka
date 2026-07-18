import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Building2, Bike, CalendarDays, ContactRound, Edit, Plus, X } from 'lucide-react';

function AdminPanel() {
    const [activeTab, setActiveTab] = useState('hotels');
    const [hotels, setHotels] = useState([]);
    const [riders, setRiders] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [riderBookings, setRiderBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [bookingType, setBookingType] = useState('hotel'); // 'hotel' or 'rider'
    const [currentBooking, setCurrentBooking] = useState({});

    // Bulk Actions State
    const [selectedIds, setSelectedIds] = useState([]);

    const getActiveList = () => {
        if (activeTab === 'hotels') return hotels;
        if (activeTab === 'riders') return riders;
        if (activeTab === 'hotelBookings') return hotelBookings;
        return riderBookings;
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSelectedIds([]);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected records?`)) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const endpoint = activeTab === 'hotels' ? 'hotels' :
                                 activeTab === 'riders' ? 'vehicles' :
                                 activeTab === 'hotelBookings' ? 'bookings' : 'rider-bookings';

                setLoading(true);
                await Promise.all(selectedIds.map(id => 
                    axios.delete(`http://localhost:5001/api/${endpoint}/${id}`, config)
                ));
                
                alert(`Successfully deleted ${selectedIds.length} records, machan!`);
                setSelectedIds([]);
                fetchData();
            } catch (error) {
                alert('Error performing bulk deletion');
                console.error(error);
                fetchData();
            }
        }
    };

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
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo?.token;
                await axios.delete(`http://localhost:5001/api/${endpoint}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData(); // Refresh data after deletion
            } catch (error) {
                alert('Error deleting record');
                console.error(error);
            }
        }
    };

    const openModal = (type, mode, booking = null) => {
        setBookingType(type);
        setModalType(mode);
        if (mode === 'edit' && booking) {
            // Pre-fill the form with existing data
            setCurrentBooking({
                ...booking,
                // Make sure we extract the correct ID if it's populated
                hotelId: booking.hotelId?._id || booking.hotelId || '',
                riderId: booking.riderId?._id || booking.riderId || '',
                date: booking.date ? new Date(booking.date).toISOString().split('T')[0] : '',
                bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toISOString().split('T')[0] : ''
            });
        } else {
            // Reset for new
            setCurrentBooking({
                customerName: '',
                contactNumber: '',
                status: 'Pending',
                hotelId: '',
                riderId: '',
                date: '',
                bookingDate: '',
                numberOfRooms: 1,
                numberOfDays: 1
            });
        }
        setShowModal(true);
    };

    const handleSaveBooking = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const endpoint = bookingType === 'hotel' ? 'bookings' : 'rider-bookings';
            
            if (modalType === 'add') {
                await axios.post(`http://localhost:5001/api/${endpoint}`, currentBooking, config);
            } else {
                await axios.put(`http://localhost:5001/api/${endpoint}/${currentBooking._id}`, currentBooking, config);
            }
            
            setShowModal(false);
            fetchData();
        } catch (error) {
            alert('Error saving booking');
            console.error(error);
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => handleTabChange(id)}
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
                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        marginBottom: '0.5rem', 
                        background: 'linear-gradient(to right, var(--primary), #3b82f6)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        fontFamily: 'var(--heading)'
                    }}>Admin Dashboard</h1>
                    <p style={{ color: '#a1a1aa' }}>Manage all platform records centrally.</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <TabButton id="hotels" label="Hotels" icon={Building2} />
                        <TabButton id="riders" label="Riders" icon={Bike} />
                        <TabButton id="hotelBookings" label="Hotel Bookings" icon={CalendarDays} />
                        <TabButton id="riderBookings" label="Rider Bookings" icon={ContactRound} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {selectedIds.length > 0 && (
                            <button 
                                onClick={handleBulkDelete}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    padding: '12px 20px',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.target.style.transform = 'none'}
                            >
                                <Trash2 size={18} /> Delete Selected ({selectedIds.length})
                            </button>
                        )}
                        {activeTab === 'hotelBookings' && (
                            <button className="btn-primary" onClick={() => openModal('hotel', 'add')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Plus size={18} /> Add Hotel Booking
                            </button>
                        )}
                        {activeTab === 'riderBookings' && (
                            <button className="btn-primary" onClick={() => openModal('rider', 'add')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Plus size={18} /> Add Rider Booking
                            </button>
                        )}
                    </div>
                </div>

                <div className="form-card" style={{ padding: '0', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>Loading data...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                                        <th style={{ ...thStyle, width: '40px', padding: '16px 12px 16px 24px', textAlign: 'center' }}>
                                            <input 
                                                type="checkbox"
                                                checked={getActiveList().length > 0 && selectedIds.length === getActiveList().length}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIds(getActiveList().map(item => item._id));
                                                    } else {
                                                        setSelectedIds([]);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                            />
                                        </th>
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
                                    {activeTab === 'hotels' && hotels.map(hotel => {
                                        const isSelected = selectedIds.includes(hotel._id);
                                        return (
                                            <tr key={hotel._id} style={{ ...trStyle, background: isSelected ? 'rgba(14, 165, 233, 0.08)' : 'transparent' }}>
                                                <td style={{ ...tdStyle, width: '40px', padding: '16px 12px 16px 24px', textAlign: 'center' }}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (isSelected) {
                                                                setSelectedIds(selectedIds.filter(id => id !== hotel._id));
                                                            } else {
                                                                setSelectedIds([...selectedIds, hotel._id]);
                                                            }
                                                        }}
                                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                                    />
                                                </td>
                                                <td style={tdStyle}>{hotel.name}</td>
                                                <td style={tdStyle}>{hotel.location}</td>
                                                <td style={tdStyle}>{hotel.price}</td>
                                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                    <button className="action-btn delete-btn" onClick={() => handleDelete('hotels', hotel._id)}><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {activeTab === 'riders' && riders.map(rider => {
                                        const isSelected = selectedIds.includes(rider._id);
                                        return (
                                            <tr key={rider._id} style={{ ...trStyle, background: isSelected ? 'rgba(14, 165, 233, 0.08)' : 'transparent' }}>
                                                <td style={{ ...tdStyle, width: '40px', padding: '16px 12px 16px 24px', textAlign: 'center' }}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (isSelected) {
                                                                setSelectedIds(selectedIds.filter(id => id !== rider._id));
                                                            } else {
                                                                setSelectedIds([...selectedIds, rider._id]);
                                                            }
                                                        }}
                                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                                    />
                                                </td>
                                                <td style={tdStyle}>{rider.driverName}</td>
                                                <td style={tdStyle}>{rider.vehicleType}</td>
                                                <td style={tdStyle}>{rider.plateNumber}</td>
                                                <td style={tdStyle}>{rider.phone}</td>
                                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                    <button className="action-btn delete-btn" onClick={() => handleDelete('vehicles', rider._id)}><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {activeTab === 'hotelBookings' && hotelBookings.map(booking => {
                                        const isSelected = selectedIds.includes(booking._id);
                                        return (
                                            <tr key={booking._id} style={{ ...trStyle, background: isSelected ? 'rgba(14, 165, 233, 0.08)' : 'transparent' }}>
                                                <td style={{ ...tdStyle, width: '40px', padding: '16px 12px 16px 24px', textAlign: 'center' }}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (isSelected) {
                                                                setSelectedIds(selectedIds.filter(id => id !== booking._id));
                                                            } else {
                                                                setSelectedIds([...selectedIds, booking._id]);
                                                            }
                                                        }}
                                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                                    />
                                                </td>
                                                <td style={tdStyle}>{booking.customerName} <br/><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{booking.contactNumber}</span></td>
                                                <td style={tdStyle}>{booking.hotelId?.name || 'Unknown Hotel'}</td>
                                                <td style={tdStyle}>{new Date(booking.date).toLocaleDateString()}</td>
                                                <td style={tdStyle}>{booking.numberOfRooms}</td>
                                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                    <button className="action-btn edit-btn" style={{ marginRight: '8px' }} onClick={() => openModal('hotel', 'edit', booking)}><Edit size={16} /></button>
                                                    <button className="action-btn delete-btn" onClick={() => handleDelete('bookings', booking._id)}><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {activeTab === 'riderBookings' && riderBookings.map(booking => {
                                        const isSelected = selectedIds.includes(booking._id);
                                        return (
                                            <tr key={booking._id} style={{ ...trStyle, background: isSelected ? 'rgba(14, 165, 233, 0.08)' : 'transparent' }}>
                                                <td style={{ ...tdStyle, width: '40px', padding: '16px 12px 16px 24px', textAlign: 'center' }}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (isSelected) {
                                                                setSelectedIds(selectedIds.filter(id => id !== booking._id));
                                                            } else {
                                                                setSelectedIds([...selectedIds, booking._id]);
                                                            }
                                                        }}
                                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                                    />
                                                </td>
                                                <td style={tdStyle}>{booking.customerName} <br/><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{booking.contactNumber}</span></td>
                                                <td style={tdStyle}>{booking.riderId?.driverName || 'Unknown Rider'}</td>
                                                <td style={tdStyle}>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                                <td style={tdStyle}>{booking.numberOfDays} days</td>
                                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                    <button className="action-btn edit-btn" style={{ marginRight: '8px' }} onClick={() => openModal('rider', 'edit', booking)}><Edit size={16} /></button>
                                                    <button className="action-btn delete-btn" onClick={() => handleDelete('rider-bookings', booking._id)}><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
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
            
            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="form-card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}><X size={24} /></button>
                        <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>{modalType === 'add' ? 'Add' : 'Edit'} {bookingType === 'hotel' ? 'Hotel' : 'Rider'} Booking</h2>
                        <form onSubmit={handleSaveBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {bookingType === 'hotel' ? (
                                <div className="input-group">
                                    <label className="input-label">Select Hotel</label>
                                    <select className="form-input" value={currentBooking.hotelId} onChange={(e) => setCurrentBooking({...currentBooking, hotelId: e.target.value})} required>
                                        <option value="">-- Select Hotel --</option>
                                        {hotels.map(h => <option key={h._id} value={h._id}>{h.name} - {h.location}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className="input-group">
                                    <label className="input-label">Select Rider</label>
                                    <select className="form-input" value={currentBooking.riderId} onChange={(e) => setCurrentBooking({...currentBooking, riderId: e.target.value})} required>
                                        <option value="">-- Select Rider --</option>
                                        {riders.map(r => <option key={r._id} value={r._id}>{r.driverName} - {r.vehicleType}</option>)}
                                    </select>
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Customer Name</label>
                                <input type="text" className="form-input" value={currentBooking.customerName} onChange={(e) => setCurrentBooking({...currentBooking, customerName: e.target.value})} required />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Contact Number</label>
                                <input type="text" className="form-input" value={currentBooking.contactNumber} onChange={(e) => setCurrentBooking({...currentBooking, contactNumber: e.target.value})} required />
                            </div>

                            {bookingType === 'hotel' ? (
                                <>
                                    <div className="input-group">
                                        <label className="input-label">Check-in Date</label>
                                        <input type="date" className="form-input" value={currentBooking.date} onChange={(e) => setCurrentBooking({...currentBooking, date: e.target.value})} required />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Number of Rooms</label>
                                        <input type="number" min="1" className="form-input" value={currentBooking.numberOfRooms} onChange={(e) => setCurrentBooking({...currentBooking, numberOfRooms: e.target.value})} required />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="input-group">
                                        <label className="input-label">Booking Date</label>
                                        <input type="date" className="form-input" value={currentBooking.bookingDate} onChange={(e) => setCurrentBooking({...currentBooking, bookingDate: e.target.value})} required />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Number of Days</label>
                                        <input type="number" min="1" className="form-input" value={currentBooking.numberOfDays} onChange={(e) => setCurrentBooking({...currentBooking, numberOfDays: e.target.value})} required />
                                    </div>
                                </>
                            )}

                            <div className="input-group">
                                <label className="input-label">Status</label>
                                <select className="form-input" value={currentBooking.status} onChange={(e) => setCurrentBooking({...currentBooking, status: e.target.value})} required>
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Save Booking</button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .action-btn {
                    width: 32px !important;
                    height: 32px !important;
                    padding: 0 !important;
                    border-radius: 8px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    transition: all 0.2s !important;
                    border: 1px solid transparent !important;
                    background-image: none !important;
                    box-shadow: none !important;
                }
                .edit-btn {
                    color: #3b82f6 !important;
                    border-color: rgba(59, 130, 246, 0.3) !important;
                    background: rgba(59, 130, 246, 0.1) !important;
                }
                .edit-btn:hover {
                    background: rgba(59, 130, 246, 0.25);
                    border-color: rgba(59, 130, 246, 0.5);
                    transform: translateY(-2px);
                }
                .delete-btn {
                    color: #ef4444 !important;
                    border-color: rgba(239, 68, 68, 0.3) !important;
                    background: rgba(239, 68, 68, 0.1) !important;
                }
                .delete-btn:hover {
                    background: rgba(239, 68, 68, 0.25);
                    border-color: rgba(239, 68, 68, 0.5);
                    transform: translateY(-2px);
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
