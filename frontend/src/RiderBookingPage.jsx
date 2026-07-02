import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RiderBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rider, setRider] = useState(null);
  const [booking, setBooking] = useState({ riderId: id, customerName: '' });

  useEffect(() => {
    // Retrieve the specific rider/vehicle details to display in the header
    axios.get('http://localhost:5001/api/vehicles')
        .then(res => {
            const found = res.data.find(v => v._id === id);
            if (found) setRider(found);
        })
        .catch(err => console.error(err));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/rider-bookings', booking);
      alert('Rider Booked Successfully!');
      navigate('/my-bookings');
    } catch (err) {
      console.error(err);
      alert('Error booking rider.');
    }
  };

  return (
    <div style={{ 
        padding: '60px 20px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'var(--bg)',
        minHeight: 'calc(100vh - 80px)',
        boxSizing: 'border-box'
    }}>
        <div className="card" style={{ 
            width: '100%', 
            maxWidth: '460px', 
            padding: '35px', 
            background: 'var(--social-bg)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            textAlign: 'left'
        }}>
            <h1 style={{ fontSize: '28px', margin: '0 0 10px 0', color: 'var(--navy-blue)', textAlign: 'center' }}>
                🚗 Book Rider
            </h1>
            {rider && (
                <div style={{ 
                    background: 'var(--accent-bg)', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    marginBottom: '25px', 
                    borderLeft: '4px solid var(--primary)' 
                }}>
                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-h)' }}>{rider.driverName}</h4>
                    <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-light)' }}>
                      Vehicle: {rider.vehicleType} • Price: Rs. {Number(rider.pricePerDay).toLocaleString()} / Day
                    </p>
                </div>
            )}

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-h)' }}>Your Name</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="Enter your full name" 
                        value={booking.customerName}
                        onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                </div>
                <button 
                    type="submit" 
                    style={{ 
                        padding: '14px', 
                        cursor: 'pointer',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(0, 177, 168, 0.3)',
                        marginTop: '10px'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'var(--primary-hover)'}
                    onMouseOut={(e) => e.target.style.background = 'var(--primary)'}
                >
                    Confirm Rider Booking
                </button>
            </form>
        </div>
    </div>
  );
}

export default RiderBookingPage;
