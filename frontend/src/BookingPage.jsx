import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingPage() {
    const { id } = useParams(); // URL eke thiyena hotel id eka ganna
    const navigate = useNavigate();
    const [booking, setBooking] = useState({ 
        hotelId: id, 
        checkInDate: '', 
        customerName: '' 
    });

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/bookings', booking);
            alert('Booking saved to database!');
            navigate('/'); 
        } catch (err) {
            console.error(err); // Error eka mokakda balanna
            alert('Error saving booking.');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Book Your Hotel</h1>
            <form onSubmit={handleBooking}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Check-in Date:</label>
                    <input 
                        type="date" 
                        required 
                        onChange={(e) => setBooking({...booking, checkInDate: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Your Name:</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="Enter your name" 
                        onChange={(e) => setBooking({...booking, customerName: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Confirm Booking
                </button>
            </form>
        </div>
    );
}

export default BookingPage;