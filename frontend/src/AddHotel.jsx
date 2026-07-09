import { useState } from 'react';
import axios from 'axios';
import { Building2, MapPin, DollarSign, Hotel, Mail, Lock, Star, Globe, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationPickerMap from './LocationPickerMap';

function AddHotel() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hotel, setHotel] = useState({ name: '', location: '', price: '', email: '', password: '', starRating: '5', website: '' });
    const [hotelPhoto, setHotelPhoto] = useState(null);
    const [mapPosition, setMapPosition] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // 1. Register User Account
            const userRes = await axios.post('http://localhost:5001/api/auth/register', {
                email: hotel.email,
                password: hotel.password,
                role: 'hotel'
            });
            const userId = userRes.data._id;

            // 2. Register Hotel Profile using FormData
            const formData = new FormData();
            formData.append('name', hotel.name);
            formData.append('location', hotel.location);
            formData.append('price', hotel.price);
            formData.append('lat', mapPosition ? mapPosition.lat : '');
            formData.append('lng', mapPosition ? mapPosition.lng : '');
            formData.append('starRating', hotel.starRating);
            formData.append('website', hotel.website);
            formData.append('userId', userId);
            
            if (hotelPhoto) {
                formData.append('hotelPhoto', hotelPhoto);
            }

            await axios.post('http://localhost:5001/api/hotels', formData);
            
            alert('Hotel registered successfully! Please login.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding hotel');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
            <div className="form-card" style={{ maxWidth: '500px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)', marginBottom: '1rem' }}>
                        <Hotel size={32} style={{ color: 'var(--primary-color)' }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Register Hotel</h1>
                    <p style={{ color: '#a1a1aa' }}>List your property on WanderLanka</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="input-group">
                        <label className="input-label">Email Address (For Login)</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input 
                                type="email"
                                className="form-input" 
                                placeholder="Enter email" 
                                value={hotel.email}
                                onChange={(e) => setHotel({...hotel, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password"
                                className="form-input" 
                                placeholder="Create password" 
                                value={hotel.password}
                                onChange={(e) => setHotel({...hotel, password: e.target.value})}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Hotel Name</label>
                        <div className="input-wrapper">
                            <Building2 className="input-icon" size={20} />
                            <input 
                                type="text"
                                className="form-input" 
                                placeholder="Enter hotel name" 
                                value={hotel.name}
                                onChange={(e) => setHotel({...hotel, name: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Location</label>
                        <div className="input-wrapper">
                            <MapPin className="input-icon" size={20} />
                            <input 
                                type="text"
                                className="form-input" 
                                placeholder="Enter location name (e.g., Kandy, Ella)" 
                                value={hotel.location}
                                onChange={(e) => setHotel({...hotel, location: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Pinpoint on Map (Optional but Recommended)</label>
                        <LocationPickerMap position={mapPosition} setPosition={setMapPosition} />
                        {mapPosition && (
                            <p style={{ fontSize: '12px', color: 'var(--primary)' }}>
                                Selected Coordinates: {mapPosition.lat.toFixed(4)}, {mapPosition.lng.toFixed(4)}
                            </p>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Price Per Night (LKR)</label>
                        <div className="input-wrapper">
                            <DollarSign className="input-icon" size={20} />
                            <input 
                                type="number"
                                className="form-input" 
                                placeholder="e.g., 5000" 
                                value={hotel.price}
                                onChange={(e) => setHotel({...hotel, price: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Hotel Class (Star Rating)</label>
                        <div className="input-wrapper">
                            <Star className="input-icon" size={20} />
                            <select 
                                className="form-input" 
                                value={hotel.starRating}
                                onChange={(e) => setHotel({...hotel, starRating: e.target.value})}
                                required
                                style={{ width: '100%', appearance: 'none', background: 'var(--card-bg)' }}
                            >
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Website URL</label>
                        <div className="input-wrapper">
                            <Globe className="input-icon" size={20} />
                            <input 
                                type="url"
                                className="form-input" 
                                placeholder="https://example.com" 
                                value={hotel.website}
                                onChange={(e) => setHotel({...hotel, website: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Hotel Photo</label>
                        <div className="input-wrapper">
                            <Camera className="input-icon" size={20} />
                            <input 
                                type="file"
                                accept="image/*"
                                className="form-input" 
                                onChange={(e) => setHotelPhoto(e.target.files[0])}
                                style={{ padding: '0.6rem 0.5rem 0.5rem 2.8rem' }}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}
                    >
                        {isSubmitting ? 'Registering...' : 'Register Hotel'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddHotel;