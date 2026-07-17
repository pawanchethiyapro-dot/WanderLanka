import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewSection from './ReviewSection';
import { useCurrency } from './context/CurrencyContext';
import { Hotel } from 'lucide-react';
import PaymentModal from './PaymentModal';

function BookingPage() {
    const { convertPrice } = useCurrency();
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [booking, setBooking] = useState({ 
        hotelId: id, 
        checkInDate: '', 
        customerName: '' 
    });
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        // Retrieve the specific hotel details to display in the header
        axios.get('http://localhost:5001/api/hotels')
            .then(res => {
                const found = res.data.find(h => h._id === id);
                if (found) setHotel(found);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleBooking = (e) => {
        e.preventDefault();
        setShowPayment(true);
    };

    const completeBookingProcess = async () => {
        try {
            await axios.post('http://localhost:5001/api/bookings', booking);
            setShowPayment(false);
            alert('Booking payment successful and registered, machan!');
            navigate('/my-bookings'); 
        } catch (err) {
            console.error(err);
            alert('Error registering booking details after payment.');
        }
    };

    return (
        <div style={{ 
            padding: '60px 20px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            background: 'var(--bg)',
            minHeight: 'calc(100vh - 80px)',
            boxSizing: 'border-box',
            gap: '30px'
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
                <h1 style={{ fontSize: '28px', margin: '0 0 10px 0', color: 'var(--navy-blue)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Hotel size={28} style={{ color: 'var(--primary)' }} /> Book Hotel
                </h1>
                {hotel && (
                    <div style={{ 
                        background: 'var(--accent-bg)', 
                        padding: '16px 20px', 
                        borderRadius: '8px', 
                        marginBottom: '25px', 
                        borderLeft: '4px solid var(--primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, color: 'var(--text-h)', fontSize: '18px' }}>{hotel.name}</h4>
                            <div style={{ fontSize: '12px', color: 'var(--accent-amber)', letterSpacing: '1px', fontWeight: '700' }}>
                                {Array.from({ length: Number(hotel.starRating) || 5 }, (_, i) => '★').join('')} Class
                            </div>
                        </div>
                        <p style={{ margin: '0', fontSize: '14px', color: 'var(--text)' }}>📍 {hotel.location}</p>
                        {hotel.website && (
                            <a 
                                href={hotel.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                    color: 'var(--primary)', 
                                    textDecoration: 'none', 
                                    fontSize: '13px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '4px',
                                    fontWeight: '600'
                                }}
                            >
                                🌐 Visit Website
                            </a>
                        )}
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                            {convertPrice(hotel.price)} <span style={{ fontWeight: 'normal', color: 'var(--text-light)', fontSize: '13px' }}>/ night</span>
                        </p>
                    </div>
                )}

                <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-h)' }}>Check-in Date</label>
                        <input 
                            type="date" 
                            required 
                            onChange={(e) => setBooking({...booking, checkInDate: e.target.value})} 
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-h)' }}>Your Name</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Enter your full name" 
                            onChange={(e) => setBooking({...booking, customerName: e.target.value})} 
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
                        Confirm Hotel Booking
                    </button>
                </form>
            </div>

            <div style={{ width: '100%', maxWidth: '600px' }}>
                <ReviewSection itemType="Hotel" itemId={id} />
            </div>

            {showPayment && hotel && (
                <PaymentModal 
                    amount={hotel.price} 
                    itemName={hotel.name} 
                    description={`Stay Reservation at ${hotel.location}`} 
                    onSuccess={completeBookingProcess} 
                    onCancel={() => setShowPayment(false)} 
                />
            )}
        </div>
    );
}

export default BookingPage;