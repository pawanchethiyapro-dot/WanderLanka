import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RiderBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState({ riderId: id, customerName: '' });

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/rider-bookings', booking);
      alert('Rider Booked Successfully!');
      navigate('/');
    } catch (err) {
      alert('Error booking rider.');
    }
  };

  return (
    <form onSubmit={handleBooking}>
      <h1>Book Your Rider</h1>
      <input
        type="text"
        placeholder="Your Name"
        value={booking.customerName}
        onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
      />
      <button type="submit">Confirm Rider</button>
    </form>
  );
}

export default RiderBookingPage;
