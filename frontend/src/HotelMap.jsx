import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix for default Leaflet marker icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function HotelMap({ hotels }) {
    const navigate = useNavigate();

    // Bounds for Sri Lanka
    const sriLankaBounds = [
        [5.5, 79.0], // Southwest
        [10.0, 82.5] // Northeast
    ];

    // Default center to Sri Lanka
    const defaultCenter = [7.8731, 80.7718];

    // Filter hotels that actually have coordinates
    const mappedHotels = hotels.filter(h => h.lat && h.lng);

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: 'var(--shadow)', marginBottom: '40px' }}>
            <MapContainer 
                center={defaultCenter} 
                zoom={7.5} 
                minZoom={7} 
                maxBounds={sriLankaBounds} 
                maxBoundsViscosity={1.0} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mappedHotels.map(hotel => (
                    <Marker key={hotel._id} position={[hotel.lat, hotel.lng]}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{hotel.name}</h3>
                                <p style={{ margin: '0 0 10px 0', color: 'var(--text-light)' }}>{hotel.location}</p>
                                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    Rs. {hotel.price ? Number(hotel.price).toLocaleString() : 'N/A'}
                                </p>
                                <button 
                                    onClick={() => navigate(`/book/${hotel._id}`)}
                                    style={{
                                        padding: '5px 10px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default HotelMap;
