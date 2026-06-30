import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HotelList() {
    const [hotels, setHotels] = useState([]);
     const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5001/api/hotels')
            .then(response => response.json())
            .then(data => setHotels(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

   return (
    <div className="card-container"> 
        {hotels.map((hotel) => (
            <div key={hotel._id} className="card"> 
                {/* Me image path eka oyaage backend eke thiyena widiyata hari da balanna */}
                <img src={`http://localhost:5001/${hotel.licensePhoto}`} alt={hotel.name} />
                <h3>{hotel.name}</h3>
                <p>Location: {hotel.location}</p>
                <p>Price: {hotel.price}</p>
                <button 
    onClick={() => navigate(`/book/${hotel._id}`)}
    style={{
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }}
>
    Book Now
</button>
            </div>
        ))}
    </div>
);
}
export default HotelList;