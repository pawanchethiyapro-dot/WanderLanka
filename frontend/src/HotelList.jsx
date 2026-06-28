import { useEffect, useState } from 'react';

function HotelList() {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/hotels')
            .then(response => response.json())
            .then(data => setHotels(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="hotel-list">
            {hotels.map((hotel) => (
                <div key={hotel._id} className="hotel-card">
                    <h2>{hotel.name}</h2>
                    <p><strong>Location:</strong> {hotel.location}</p>
                    <p><strong>Price:</strong> {hotel.price}</p>
                </div>
            ))}
        </div>
    );
}
export default HotelList;