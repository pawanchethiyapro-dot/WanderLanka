import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelMap from './HotelMap';
import { X, Star } from 'lucide-react';

function HotelList() {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedHotelReviews, setSelectedHotelReviews] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/hotels')
            .then(response => response.json())
            .then(data => setHotels(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (selectedHotel) {
            fetch(`http://localhost:5001/api/reviews/Hotel/${selectedHotel._id}`)
                .then(response => response.json())
                .then(data => {
                    setSelectedHotelReviews(data.reviews || []);
                })
                .catch(error => {
                    console.error('Error fetching hotel reviews:', error);
                    setSelectedHotelReviews([]);
                });
        } else {
            setSelectedHotelReviews([]);
        }
    }, [selectedHotel]);

    // Placeholder image in case hotel doesn't have a valid one
    const getHotelImage = (hotel) => {
        if (hotel.hotelPhoto) {
            return `http://localhost:5001/${hotel.hotelPhoto}`;
        }
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
                    <div 
                        key={hotel._id} 
                        className="card" 
                        onClick={() => setSelectedHotel(hotel)}
                        style={{ cursor: 'pointer' }}
                    > 
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px', marginBottom: '5px' }}>
                                <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-h)' }}>{hotel.name}</h3>
                                <div style={{ fontSize: '12px', color: 'var(--accent-amber)', letterSpacing: '1px', fontWeight: '700' }}>
                                    {Array.from({ length: Number(hotel.starRating) || 5 }, (_, i) => '★').join('')} Class
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '14px' }}>
                                <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center' }}>⭐</span>
                                <strong style={{ color: 'var(--text-h)' }}>
                                    {hotel.averageRating > 0 ? hotel.averageRating : 'New'}
                                </strong>
                                {hotel.reviewCount > 0 && (
                                    <span style={{ color: 'var(--text-light)' }}>({hotel.reviewCount} reviews)</span>
                                )}
                            </div>
                            <p style={{ margin: '0 0 8px 0', color: 'var(--text-light)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>📍</span> {hotel.location}
                            </p>
                            {hotel.website && (
                                <a 
                                    href={hotel.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ 
                                        color: 'var(--primary)', 
                                        textDecoration: 'none', 
                                        fontSize: '13px', 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: '4px',
                                        marginBottom: '12px',
                                        fontWeight: '600'
                                    }}
                                >
                                    🌐 Visit Website
                                </a>
                            )}
                            <p style={{ margin: '0 0 20px 0', color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>
                                Rs. {hotel.price ? Number(hotel.price).toLocaleString() : 'N/A'} <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-light)' }}>/ night</span>
                            </p>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/book/${hotel._id}`);
                                }}
                                className="btn-primary"
                                style={{ marginTop: 'auto', width: '100%' }}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hotel Profile Modal Overlay */}
            {selectedHotel && (
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
                }} onClick={() => setSelectedHotel(null)}>
                    
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
                            onClick={() => setSelectedHotel(null)}
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
                                    src={getHotelImage(selectedHotel)} 
                                    alt={selectedHotel.name} 
                                    style={{ 
                                        width: '180px', 
                                        height: '130px', 
                                        borderRadius: '12px', 
                                        objectFit: 'cover', 
                                        border: '3px solid var(--primary)',
                                        boxShadow: '0 8px 16px rgba(14, 165, 233, 0.2)',
                                        marginBottom: '20px'
                                    }}
                                />
                                <h2 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{selectedHotel.name}</h2>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px' }}>
                                    <Star fill="var(--accent-amber)" color="var(--accent-amber)" size={18} />
                                    <strong style={{ fontSize: '16px' }}>
                                        {selectedHotel.averageRating > 0 ? selectedHotel.averageRating : 'New'}
                                    </strong>
                                    {selectedHotel.reviewCount > 0 && (
                                        <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>({selectedHotel.reviewCount} reviews)</span>
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
                                        <strong>Location:</strong> {selectedHotel.location}
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        <strong>Class:</strong> {Array.from({ length: Number(selectedHotel.starRating) || 5 }, (_, i) => '★').join('')} Star Class
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        <strong>Price:</strong> Rs. {Number(selectedHotel.price).toLocaleString()} / night
                                    </div>
                                    {selectedHotel.website && (
                                        <div style={{ fontSize: '14px' }}>
                                            <strong>Website:</strong>{' '}
                                            <a href={selectedHotel.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                                                Visit Web 🌐
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={() => {
                                        setSelectedHotel(null);
                                        navigate(`/book/${selectedHotel._id}`);
                                    }}
                                    className="btn-primary"
                                    style={{ width: '100%', marginTop: '25px' }}
                                >
                                    Book Room
                                </button>
                            </div>

                            {/* Right/Bottom Panel - Reviews */}
                            <div style={{ 
                                flex: '1 2 400px', 
                                padding: '30px', 
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto'
                            }}>
                                <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Guest Reviews</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                                    {selectedHotelReviews.length === 0 ? (
                                        <div style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '14px' }}>No reviews yet.</div>
                                    ) : (
                                        selectedHotelReviews.map((rev) => (
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

export default HotelList;