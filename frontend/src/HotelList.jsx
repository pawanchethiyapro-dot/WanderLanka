import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelMap from './HotelMap';

function HotelList() {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5001/api/hotels')
            .then(response => response.json())
            .then(data => setHotels(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Placeholder image in case hotel doesn't have a valid one
    const getHotelImage = (hotel) => {
        if (hotel.licensePhoto) {
            return `http://localhost:5001/${hotel.licensePhoto}`;
        }
        return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"; // Premium hotel placeholder
    };

    return (
        <div style={{ padding: '40px 20px' }}>
            <h1 style={{ 
                textAlign: 'center', 
                marginBottom: '10px', 
                background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'var(--heading)'
            }}>🏨 Premium Stays</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '40px', fontSize: '16px' }}>
                Handpicked hotels and resorts across Sri Lanka for your comfort.
            </p>

            <HotelMap hotels={hotels} />

            <div className="card-container"> 
                {hotels.map((hotel) => (
                    <div key={hotel._id} className="card"> 
                        <img 
                            src={getHotelImage(hotel)} 
                            alt={hotel.name} 
                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80";
                            }}
                        />
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: 'var(--text-h)' }}>{hotel.name}</h3>
                            <p style={{ margin: '0 0 8px 0', color: 'var(--text-light)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>📍</span> {hotel.location}
                            </p>
                            <p style={{ margin: '0 0 20px 0', color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>
                                Rs. {hotel.price ? Number(hotel.price).toLocaleString() : 'N/A'} <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-light)' }}>/ night</span>
                            </p>
                            <button 
                                onClick={() => navigate(`/book/${hotel._id}`)}
                                className="btn-primary"
                                style={{ marginTop: 'auto', width: '100%' }}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HotelList;