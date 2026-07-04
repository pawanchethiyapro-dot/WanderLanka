import { useState } from 'react';
import axios from 'axios';
import { Building2, MapPin, DollarSign, Hotel, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AddHotel() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hotel, setHotel] = useState({ name: '', location: '', price: '', email: '', password: '' });
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

            // 2. Register Hotel Profile
            const hotelData = {
                name: hotel.name,
                location: hotel.location,
                price: hotel.price,
                userId: userId
            };
            await axios.post('http://localhost:5001/api/hotels', hotelData);
            
            alert('Hotel registered successfully! Please login.');
            navigate('/login'); // We will create this page next
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
                                placeholder="Enter location (e.g., Kandy, Ella)" 
                                value={hotel.location}
                                onChange={(e) => setHotel({...hotel, location: e.target.value})}
                                required
                            />
                        </div>
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