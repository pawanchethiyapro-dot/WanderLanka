import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plus, Trash2, ArrowUp, ArrowDown, Calculator, Calendar, Car, Hotel, Compass, Star, ChevronRight } from 'lucide-react';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

function ChangeMapView({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords && coords.length > 0) {
            if (coords.length === 1) {
                map.setView(coords[0], 9);
            } else {
                map.fitBounds(coords, { padding: [50, 50] });
            }
        }
    }, [coords, map]);
    return null;
}

let DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SRI_LANKA_CITIES = [
  { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
  { name: 'Negombo', lat: 7.2089, lng: 79.8356 },
  { name: 'Sigiriya', lat: 7.9570, lng: 80.7603 },
  { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
  { name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891 },
  { name: 'Ella', lat: 6.8722, lng: 81.0450 },
  { name: 'Galle', lat: 6.0535, lng: 80.2117 },
  { name: 'Yala', lat: 6.3699, lng: 81.5173 },
  { name: 'Trincomalee', lat: 8.5775, lng: 81.2335 }
];

function ItineraryPlanner() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [riders, setRiders] = useState([]);
    const [selectedStops, setSelectedStops] = useState([
        { id: '1', city: SRI_LANKA_CITIES[0] }, // Default Colombo
        { id: '2', city: SRI_LANKA_CITIES[3] }  // Default Kandy
    ]);
    const [newCityIndex, setNewCityIndex] = useState(0);
    const [activeStopId, setActiveStopId] = useState('1');

    useEffect(() => {
        // Fetch hotels
        axios.get('http://localhost:5001/api/hotels')
            .then(res => setHotels(res.data || []))
            .catch(err => console.error('Error fetching hotels:', err));

        // Fetch riders
        axios.get('http://localhost:5001/api/vehicles')
            .then(res => setRiders(res.data || []))
            .catch(err => console.error('Error fetching riders:', err));
    }, []);

    const addStop = () => {
        const cityToAdd = SRI_LANKA_CITIES[newCityIndex];
        const newStop = {
            id: Date.now().toString(),
            city: cityToAdd
        };
        setSelectedStops([...selectedStops, newStop]);
        setActiveStopId(newStop.id);
    };

    const removeStop = (id) => {
        if (selectedStops.length <= 1) {
            alert("Your itinerary must have at least 1 stop, machan!");
            return;
        }
        const updated = selectedStops.filter(s => s.id !== id);
        setSelectedStops(updated);
        // Set new active stop if the deleted one was active
        if (activeStopId === id) {
            setActiveStopId(updated[0].id);
        }
    };

    const moveStop = (index, direction) => {
        const newStops = [...selectedStops];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newStops.length) return;
        
        // Swap
        const temp = newStops[index];
        newStops[index] = newStops[targetIndex];
        newStops[targetIndex] = temp;
        
        setSelectedStops(newStops);
    };

    // Calculate approximate coordinates list for Polyline
    const polylineCoords = selectedStops.map(s => [s.city.lat, s.city.lng]);

    // Active stop city recommendations
    const activeStop = selectedStops.find(s => s.id === activeStopId) || selectedStops[0];
    const activeCityName = activeStop?.city.name || '';

    // Recommendations match location
    const recommendedHotels = hotels.filter(h => 
        h.location && h.location.toLowerCase().includes(activeCityName.toLowerCase())
    );

    // Riders can travel anywhere, so we recommend top riders with highest rating or general ones
    const recommendedRiders = riders.slice(0, 3); 

    // Helper functions for placeholders
    const getHotelImage = (hotel) => {
        if (hotel.hotelPhoto) return `http://localhost:5001/${hotel.hotelPhoto}`;
        if (hotel.licensePhoto) return `http://localhost:5001/${hotel.licensePhoto}`;
        return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80";
    };

    const getVehicleImage = (rider) => {
        if (rider.riderPhoto) return `http://localhost:5001/${rider.riderPhoto}`;
        return "https://images.unsplash.com/photo-1594913785162-e67853f235b5?auto=format&fit=crop&w=300&q=80";
    };

    // Calculate total summary cost per day estimation
    const getEstimateCost = () => {
        let totalHotel = 0;
        let totalRider = 0;

        selectedStops.forEach(stop => {
            // Find cheapest hotel matching this stop city
            const cityH = hotels.filter(h => h.location && h.location.toLowerCase().includes(stop.city.name.toLowerCase()));
            if (cityH.length > 0) {
                const prices = cityH.map(h => Number(h.price) || 0);
                totalHotel += Math.min(...prices);
            }
        });

        if (riders.length > 0) {
            const prices = riders.map(r => Number(r.pricePerDay) || 0);
            totalRider = Math.min(...prices); // Single rider shared across days
        }

        return {
            hotels: totalHotel,
            rider: totalRider,
            total: totalHotel + totalRider
        };
    };

    const estimates = getEstimateCost();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 'calc(100vh - 80px)', background: 'var(--bg)', boxSizing: 'border-box' }}>
            
            {/* Header Title Section */}
            <div style={{ padding: '30px 20px 10px 20px', textAlign: 'center' }}>
                <h1 style={{ 
                    margin: '0 0 10px 0', 
                    background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'var(--heading)'
                }}>🗺️ Custom Route Planner</h1>
                <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '15px' }}>
                    Construct your dream travel path across Sri Lanka, map it out, and select matching stays & travel riders.
                </p>
            </div>

            {/* Main Layout Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '24px', 
                padding: '20px',
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto',
                boxSizing: 'border-box'
            }}>
                
                {/* Left Panel - Stops Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ padding: '24px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                        <h2 style={{ margin: '0 0 15px 0', fontSize: '20px', color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={22} style={{ color: 'var(--primary)' }} /> Your Travel Route
                        </h2>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <select 
                                value={newCityIndex}
                                onChange={(e) => setNewCityIndex(Number(e.target.value))}
                                style={{ flexGrow: 1, background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px' }}
                            >
                                {SRI_LANKA_CITIES.map((c, idx) => (
                                    <option key={c.name} value={idx}>{c.name}</option>
                                ))}
                            </select>
                            <button 
                                onClick={addStop}
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                            >
                                <Plus size={18} /> Add Stop
                            </button>
                        </div>

                        {/* Timeline list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {selectedStops.map((stop, index) => {
                                const isActive = stop.id === activeStopId;
                                return (
                                    <div 
                                        key={stop.id}
                                        onClick={() => setActiveStopId(stop.id)}
                                        style={{
                                            padding: '12px 16px',
                                            background: isActive ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                                            border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: isActive ? 'var(--primary)' : 'var(--border)',
                                                color: isActive ? 'white' : 'var(--text-light)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                fontWeight: '700'
                                            }}>
                                                {index + 1}
                                            </div>
                                            <span style={{ fontWeight: '600', color: isActive ? 'var(--text-h)' : 'var(--text)' }}>
                                                {stop.city.name}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={() => moveStop(index, -1)}
                                                disabled={index === 0}
                                                style={{ padding: '6px', background: 'none', border: 'none', color: index === 0 ? '#4b5563' : 'var(--text-light)', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button 
                                                onClick={() => moveStop(index, 1)}
                                                disabled={index === selectedStops.length - 1}
                                                style={{ padding: '6px', background: 'none', border: 'none', color: index === selectedStops.length - 1 ? '#4b5563' : 'var(--text-light)', cursor: index === selectedStops.length - 1 ? 'not-allowed' : 'pointer' }}
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                            <button 
                                                onClick={() => removeStop(stop.id)}
                                                style={{ padding: '6px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Estimates Costing Card */}
                    <div className="card" style={{ padding: '24px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                        <h2 style={{ margin: '0 0 15px 0', fontSize: '20px', color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calculator size={22} style={{ color: 'var(--primary)' }} /> Budget Estimation
                        </h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-light)' }}>Hotel Rooms (Starting total):</span>
                                <strong style={{ color: 'var(--text-h)' }}>Rs. {estimates.hotels.toLocaleString()}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-light)' }}>Travel Rider (Starting daily):</span>
                                <strong style={{ color: 'var(--text-h)' }}>Rs. {estimates.rider.toLocaleString()}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '5px' }}>
                                <strong style={{ color: 'var(--primary)' }}>Estimated Tour Cost:</strong>
                                <strong style={{ color: 'var(--primary)', fontSize: '18px' }}>Rs. {estimates.total.toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Panel - Route Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '400px' }}>
                    <div className="card" style={{ padding: '0', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', height: '100%' }}>
                        <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Compass size={22} style={{ color: 'var(--primary)' }} /> Interactive Itinerary Map
                        </div>
                        <div style={{ height: 'calc(100% - 63px)', width: '100%', minHeight: '350px' }}>
                            <MapContainer 
                                center={[7.8731, 80.7718]} 
                                zoom={7.2} 
                                minZoom={7} 
                                maxBounds={[
                                    [5.5, 79.0], // Southwest
                                    [10.0, 82.5] // Northeast
                                ]} 
                                maxBoundsViscosity={1.0} 
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <ChangeMapView coords={polylineCoords} />
                                {selectedStops.map((stop, idx) => (
                                    <Marker key={stop.id} position={[stop.city.lat, stop.city.lng]}>
                                        <Popup>
                                            <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
                                                <h4 style={{ margin: '0 0 4px 0' }}>Stop {idx + 1}: {stop.city.name}</h4>
                                                <p style={{ margin: 0, color: 'gray', fontSize: '12px' }}>Latitude: {stop.city.lat.toFixed(4)}</p>
                                                <p style={{ margin: 0, color: 'gray', fontSize: '12px' }}>Longitude: {stop.city.lng.toFixed(4)}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                                {polylineCoords.length > 1 && (
                                    <Polyline 
                                        positions={polylineCoords} 
                                        color="var(--primary)" 
                                        weight={4} 
                                        dashArray="10, 10" 
                                    />
                                )}
                            </MapContainer>
                        </div>
                    </div>
                </div>

                {/* Right Panel - City Recommendations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ padding: '24px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                        <h2 style={{ margin: '0 0 15px 0', fontSize: '20px', color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={22} style={{ color: 'var(--primary)' }} /> Options in {activeCityName}
                        </h2>

                        {/* Stays recommendations */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--text-light)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Hotel size={16} /> Recommended Stays
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {recommendedHotels.length === 0 ? (
                                    <div style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '13px' }}>
                                        No hotels registered in {activeCityName} yet, machan.
                                    </div>
                                ) : (
                                    recommendedHotels.map(hotel => (
                                        <div key={hotel._id} style={{ display: 'flex', gap: '10px', padding: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '12px', alignItems: 'center' }}>
                                            <img src={getHotelImage(hotel)} alt={hotel.name} style={{ width: '60px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                                                <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-h)' }}>{hotel.name}</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--accent-amber)' }}>
                                                    <Star size={10} fill="var(--accent-amber)" /> {hotel.averageRating > 0 ? hotel.averageRating : 'New'}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/book/${hotel._id}`)}
                                                className="btn-primary"
                                                style={{ display: 'flex', padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                                            >
                                                Book Stay
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Driver recommendations */}
                        <div>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--text-light)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Car size={16} /> Available Travel Riders
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {recommendedRiders.length === 0 ? (
                                    <div style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '13px' }}>
                                        No active travel riders available.
                                    </div>
                                ) : (
                                    recommendedRiders.map(rider => (
                                        <div key={rider._id} style={{ display: 'flex', gap: '10px', padding: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '12px', alignItems: 'center' }}>
                                            <img src={getVehicleImage(rider)} alt={rider.driverName} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                                                <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-h)' }}>{rider.driverName}</h4>
                                                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{rider.vehicleType}</span>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/book-rider/${rider._id}`)}
                                                className="btn-primary"
                                                style={{ display: 'flex', padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                                            >
                                                Book Rider
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ItineraryPlanner;
