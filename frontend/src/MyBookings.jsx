import { useState, useEffect } from 'react';
import axios from 'axios';

function MyBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/bookings')
            .then(res => setBookings(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>My Bookings</h1>
            {bookings.map(b => (
                <div key={b._id} className="card">
                    <p>Hotel ID: {b.hotelId}</p>
                    <p>Name: {b.customerName}</p>
                    <p>Date: {new Date(b.checkInDate).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}
export default MyBookings;