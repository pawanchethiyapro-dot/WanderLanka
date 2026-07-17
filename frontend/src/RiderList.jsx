import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Star, Car } from 'lucide-react';
import { useCurrency } from './context/CurrencyContext';

function RiderList() {
    const { convertPrice } = useCurrency();
    const [riders, setRiders] = useState([]);
    const navigate = useNavigate();
    const [selectedRider, setSelectedRider] = useState(null);
    const [selectedRiderReviews, setSelectedRiderReviews] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('default');

    const filteredRiders = riders
        .filter(r => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = r.driverName.toLowerCase().includes(searchLower) || 
                                  r.vehicleType.toLowerCase().includes(searchLower) ||
                                  (r.vehicleModel && r.vehicleModel.toLowerCase().includes(searchLower)) ||
                                  (r.languages && r.languages.toLowerCase().includes(searchLower));
            const matchesType = typeFilter === 'all' || r.vehicleType.toLowerCase().includes(typeFilter.toLowerCase());
            const matchesMaxPrice = !maxPrice || Number(r.pricePerDay) <= Number(maxPrice);
            return matchesSearch && matchesType && matchesMaxPrice;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
            if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
            return 0;
        });

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

    useEffect(() => {
        if (selectedRider) {
            axios.get(`http://localhost:5001/api/reviews/Vehicle/${selectedRider._id}`)
                .then(res => {
                    setSelectedRiderReviews(res.data.reviews || []);
                })
                .catch(err => {
                    console.error('Error fetching rider reviews:', err);
                    setSelectedRiderReviews([]);
                });
        } else {
            setSelectedRiderReviews([]);
        }
    }, [selectedRider]);

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
            }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}><Car size={32} style={{ color: 'var(--primary)' }} /> Travel Riders</span></h1>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '40px', fontSize: '16px' }}>
                Hire local, verified drivers to explore Sri Lanka at your own pace.
            </p>

            {/* Filter Bar */}
            <div className="card" style={{
                padding: '20px',
                marginBottom: '30px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', flexGrow: 1 }}>
                    {/* Search Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px', flexGrow: 1 }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Search</label>
                        <input 
                            type="text" 
                            placeholder="Search by driver, vehicle model, or language..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Vehicle Type Dropdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vehicle Type</label>
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            style={{ width: '100%', background: 'var(--card-bg)', appearance: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text)' }}
                        >
                            <option value="all">All Types</option>
                            <option value="tuk">Tuk Tuk</option>
                            <option value="car">Car (Sedan/hatchback)</option>
                            <option value="van">Van</option>
                            <option value="suv">SUV / Jeep</option>
                        </select>
                    </div>

                    {/* Max Price Range */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Max Price (LKR / Day)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 15000" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                {/* Sort By Option */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort By</label>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ width: '100%', background: 'var(--card-bg)', appearance: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text)' }}
                    >
                        <option value="default">Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Results count indicator */}
            <div style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '20px' }}>
                Showing {filteredRiders.length} verified driver{filteredRiders.length !== 1 ? 's' : ''} in Sri Lanka
            </div>

            <div className="card-container"> 
                {filteredRiders.map((r) => (
                    <div 
                        key={r._id} 
                        className="card" 
                        onClick={() => setSelectedRider(r)}
                        style={{ cursor: 'pointer' }}
                    > 
                        <img 
                            src={getVehicleImage(r)} 
                            alt={r.driverName} 
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: 'var(--text-h)' }}>{r.driverName}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '14px' }}>
                                <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center' }}>⭐</span>
                                <strong style={{ color: 'var(--text-h)' }}>
                                    {r.averageRating > 0 ? r.averageRating : 'New'}
                                </strong>
                                {r.reviewCount > 0 && (
                                    <span style={{ color: 'var(--text-light)' }}>({r.reviewCount} reviews)</span>
                                )}
                            </div>
                            <p style={{ margin: '0 0 6px 0', color: 'var(--text)', fontSize: '14px' }}>
                                <strong>Vehicle:</strong> {r.vehicleType} {r.vehicleModel ? `• ${r.vehicleModel}` : ''} ({r.plateNumber})
                            </p>
                            {r.driverAge && (
                                <p style={{ margin: '0 0 6px 0', color: 'var(--text-light)', fontSize: '14px' }}>
                                    <strong>👤 Profile:</strong> {r.driverAge} Y/O {r.driverExperience ? `• ${r.driverExperience} Yrs Exp` : ''}
                                </p>
                            )}
                            {r.languages && (
                                <p style={{ margin: '0 0 6px 0', color: 'var(--text-light)', fontSize: '14px' }}>
                                    <strong>🗣️ Speaks:</strong> {r.languages}
                                </p>
                            )}
                            <p style={{ margin: '0 0 6px 0', color: 'var(--text-light)', fontSize: '14px' }}>
                                <strong>📞 Contact:</strong> {r.phone}
                            </p>
                            <p style={{ margin: '0 0 20px 0', color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>
                                {r.pricePerDay ? convertPrice(r.pricePerDay) : 'N/A'} <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-light)' }}>/ day</span>
                            </p>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/book-rider/${r._id}`);
                                }}
                                className="btn-primary"
                                style={{ marginTop: 'auto', width: '100%' }}
                            >
                                Book Rider
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Profile Modal Overlay */}
            {selectedRider && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    padding: '20px',
                    boxSizing: 'border-box'
                }} onClick={() => setSelectedRider(null)}>
                    
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow)',
                        width: '100%',
                        maxWidth: '750px',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        
                        {/* Close button */}
                        <button 
                            onClick={() => setSelectedRider(null)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                padding: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-h)',
                                zIndex: 10,
                                boxShadow: 'none',
                                transform: 'none'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', overflowY: 'auto', height: '100%' }}>
                            
                            {/* Left/Top Panel - Image & Basic info */}
                            <div style={{ 
                                flex: '1 1 300px', 
                                padding: '30px', 
                                borderRight: '1px solid var(--border)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                            }}>
                                <img 
                                    src={getVehicleImage(selectedRider)} 
                                    alt={selectedRider.driverName} 
                                    style={{ 
                                        width: '150px', 
                                        height: '150px', 
                                        borderRadius: '50%', 
                                        objectFit: 'cover', 
                                        border: '4px solid var(--primary)',
                                        boxShadow: '0 8px 16px rgba(14, 165, 233, 0.2)',
                                        marginBottom: '20px'
                                    }}
                                />
                                <h2 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{selectedRider.driverName}</h2>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px' }}>
                                    <Star fill="var(--accent-amber)" color="var(--accent-amber)" size={18} />
                                    <strong style={{ fontSize: '16px' }}>
                                        {selectedRider.averageRating > 0 ? selectedRider.averageRating : 'New'}
                                    </strong>
                                    {selectedRider.reviewCount > 0 && (
                                        <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>({selectedRider.reviewCount} reviews)</span>
                                    )}
                                </div>

                                <div style={{ 
                                    background: 'var(--accent-bg)', 
                                    border: '1px solid var(--accent-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    width: '100%',
                                    textAlign: 'left',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ fontSize: '14px' }}>
                                        <strong>Vehicle:</strong> {selectedRider.vehicleType}
                                    </div>
                                    {selectedRider.vehicleModel && (
                                        <div style={{ fontSize: '14px' }}>
                                            <strong>Model:</strong> {selectedRider.vehicleModel}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '14px' }}>
                                        <strong>Plate No:</strong> {selectedRider.plateNumber}
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        <strong>Price:</strong> {convertPrice(selectedRider.pricePerDay)} / day
                                    </div>
                                </div>

                                <button 
                                    onClick={() => {
                                        setSelectedRider(null);
                                        navigate(`/book-rider/${selectedRider._id}`);
                                    }}
                                    className="btn-primary"
                                    style={{ width: '100%', marginTop: '25px' }}
                                >
                                    Book Rider
                                </button>
                            </div>

                            {/* Right/Bottom Panel - Driver Details & Reviews */}
                            <div style={{ 
                                flex: '1 2 400px', 
                                padding: '30px', 
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto'
                            }}>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Driver Profile</h3>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                                    {selectedRider.driverAge && (
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>AGE</div>
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-h)' }}>{selectedRider.driverAge} Years Old</div>
                                        </div>
                                    )}
                                    {selectedRider.driverExperience && (
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>EXPERIENCE</div>
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-h)' }}>{selectedRider.driverExperience} Years</div>
                                        </div>
                                    )}
                                    {selectedRider.languages && (
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>LANGUAGES</div>
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-h)' }}>{selectedRider.languages}</div>
                                        </div>
                                    )}
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>📞 PHONE</div>
                                        <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-h)' }}>{selectedRider.phone}</div>
                                    </div>
                                </div>

                                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Reviews</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
                                    {selectedRiderReviews.length === 0 ? (
                                        <div style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '14px' }}>No reviews yet.</div>
                                    ) : (
                                        selectedRiderReviews.map((rev) => (
                                            <div key={rev._id} style={{ 
                                                background: 'rgba(255, 255, 255, 0.02)', 
                                                border: '1px solid var(--border)', 
                                                borderRadius: '12px', 
                                                padding: '12px 16px' 
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <strong>{rev.customerName}</strong>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                                        {new Date(rev.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star 
                                                            key={s} 
                                                            size={12} 
                                                            fill={s <= rev.rating ? 'var(--accent-amber)' : 'none'} 
                                                            color={s <= rev.rating ? 'var(--accent-amber)' : '#94a3b8'} 
                                                        />
                                                    ))}
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: '1.4' }}>
                                                    {rev.comment}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default RiderList;