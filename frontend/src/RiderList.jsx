import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RiderList() {
    const [riders, setRiders] = useState([]);
    const navigate = useNavigate();

    const fetchRiders = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/vehicles');
            setRiders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, []);

    // Returns a nice placeholder based on vehicle type (default to TukTuk or car)
    const getVehicleImage = (vehicle) => {
        if (vehicle.riderPhoto) {
            return `http://localhost:5001/${vehicle.riderPhoto}`;
        }
        const type = String(vehicle.vehicleType).toLowerCase();
        if (type.includes('tuk') || type.includes('three') || type.includes('auto')) {
            return "https://images.unsplash.com/photo-1594913785162-e67853f235b5?auto=format&fit=crop&w=600&q=80"; // Sri Lankan TukTuk
        }
        return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80"; // Travel car
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
            }}>🚗 Travel Riders</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '40px', fontSize: '16px' }}>
                Hire local, verified drivers to explore Sri Lanka at your own pace.
            </p>

            <div className="card-container"> 
                {riders.map((r) => (
                    <div key={r._id} className="card"> 
                        <img 
                            src={getVehicleImage(r)} 
                            alt={r.driverName} 
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: 'var(--text-h)' }}>{r.driverName}</h3>
                            <p style={{ margin: '0 0 6px 0', color: 'var(--text)', fontSize: '14px' }}>
                                <strong>Vehicle:</strong> {r.vehicleType} ({r.plateNumber})
                            </p>
                            <p style={{ margin: '0 0 6px 0', color: 'var(--text-light)', fontSize: '14px' }}>
                                <strong>📞 Contact:</strong> {r.phone}
                            </p>
                            <p style={{ margin: '0 0 20px 0', color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>
                                Rs. {r.pricePerDay ? Number(r.pricePerDay).toLocaleString() : 'N/A'} <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-light)' }}>/ day</span>
                            </p>
                            <button 
                                onClick={() => navigate(`/book-rider/${r._id}`)}
                                className="btn-primary"
                                style={{ marginTop: 'auto', width: '100%' }}
                            >
                                Book Rider
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RiderList;