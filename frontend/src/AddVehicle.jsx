import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Car, User, CreditCard, Phone, Tag, DollarSign, Bike, Camera, FileBadge, Mail, Lock, Calendar, Briefcase, Globe } from 'lucide-react';

function AddVehicle() {
    const [vehicle, setVehicle] = useState({ driverName: '', nic: '', phone: '', vehicleType: '', plateNumber: '', pricePerDay: '', email: '', password: '', vehicleModel: '', driverAge: '', driverExperience: '', languages: '' });
    const [riderPhoto, setRiderPhoto] = useState(null);
    const [licensePhoto, setLicensePhoto] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // 1. Register User Account
            const userRes = await axios.post('http://localhost:5001/api/auth/register', {
                email: vehicle.email,
                password: vehicle.password,
                role: 'rider'
            });
            const userId = userRes.data._id;

            // 2. Register Rider/Vehicle Profile
            const formData = new FormData();
            Object.keys(vehicle).forEach(key => {
                if (key !== 'email' && key !== 'password') {
                    formData.append(key, vehicle[key]);
                }
            });
            formData.append('userId', userId);
            
            if (riderPhoto) {
                formData.append('riderPhoto', riderPhoto);
            }
            if (licensePhoto) {
                formData.append('licensePhoto', licensePhoto);
            }

            await axios.post('http://localhost:5001/api/vehicles', formData);
            alert('Rider registered successfully! Please login.');
            navigate('/login'); 

        } catch (err) {
            alert('Error registering vehicle');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 80px)', padding: '60px 20px', boxSizing: 'border-box' }}>
            <div className="form-card" style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)', marginBottom: '1rem' }}>
                        <Bike size={32} style={{ color: 'var(--primary-color)' }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Register Rider</h1>
                    <p style={{ color: '#a1a1aa' }}>Join our fleet and start earning</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Email Address (For Login)</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input 
                                type="email"
                                className="form-input" 
                                placeholder="Enter email" 
                                value={vehicle.email}
                                onChange={(e) => setVehicle({...vehicle, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password"
                                className="form-input" 
                                placeholder="Create password" 
                                value={vehicle.password}
                                onChange={(e) => setVehicle({...vehicle, password: e.target.value})}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Driver Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input 
                                type="text"
                                className="form-input" 
                                placeholder="Full Name" 
                                value={vehicle.driverName}
                                onChange={(e) => setVehicle({...vehicle, driverName: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">NIC</label>
                        <div className="input-wrapper">
                            <CreditCard className="input-icon" size={20} />
                            <input 
                                type="text"
                                className="form-input" 
                                placeholder="ID Number" 
                                value={vehicle.nic}
                                onChange={(e) => setVehicle({...vehicle, nic: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Phone Number</label>
                        <div className="input-wrapper">
                            <Phone className="input-icon" size={20} />
                            <input 
                                type="tel"
                                className="form-input" 
                                placeholder="07XXXXXXXX" 
                                value={vehicle.phone}
                                onChange={(e) => setVehicle({...vehicle, phone: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Vehicle Type</label>
                        <div className="input-wrapper">
                            <Car className="input-icon" size={20} />
                            <input 
                                type="text"
                                className="form-input" 
                                placeholder="e.g., Tuk Tuk, Car, Van" 
                                value={vehicle.vehicleType}
                                onChange={(e) => setVehicle({...vehicle, vehicleType: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Vehicle Model / Name</label>
                        <div className="input-wrapper">
                            <Car className="input-icon" size={20} />
                            <input 
                                type="text"
                                className="form-input" 
                                placeholder="e.g., Bajaj RE 205cc, Toyota Prius" 
                                value={vehicle.vehicleModel}
                                onChange={(e) => setVehicle({...vehicle, vehicleModel: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Driver Age</label>
                        <div className="input-wrapper">
                            <Calendar className="input-icon" size={20} />
                            <input 
                                type="number"
                                className="form-input" 
                                placeholder="e.g., 32" 
                                value={vehicle.driverAge}
                                onChange={(e) => setVehicle({...vehicle, driverAge: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Experience (Years)</label>
                        <div className="input-wrapper">
                            <Briefcase className="input-icon" size={20} />
                            <input 
                                type="number"
                                className="form-input" 
                                placeholder="e.g., 5" 
                                value={vehicle.driverExperience}
                                onChange={(e) => setVehicle({...vehicle, driverExperience: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Languages Spoken</label>
                        <div className="input-wrapper">
                            <Globe className="input-icon" size={20} />
                            <input 
                                type="text"
                                className="form-input" 
                                placeholder="e.g., Sinhala, English, Tamil" 
                                value={vehicle.languages}
                                onChange={(e) => setVehicle({...vehicle, languages: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Plate Number</label>
                        <div className="input-wrapper">
                            <Tag className="input-icon" size={20} />
                            <input 
                                type="text"
                                className="form-input" 
                                placeholder="e.g., WP AB-1234" 
                                value={vehicle.plateNumber}
                                onChange={(e) => setVehicle({...vehicle, plateNumber: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Price Per Day (LKR)</label>
                        <div className="input-wrapper">
                            <DollarSign className="input-icon" size={20} />
                            <input 
                                type="number"
                                className="form-input" 
                                placeholder="e.g., 3000" 
                                value={vehicle.pricePerDay}
                                onChange={(e) => setVehicle({...vehicle, pricePerDay: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Rider Photo</label>
                        <div className="input-wrapper">
                            <Camera className="input-icon" size={20} />
                            <input 
                                type="file"
                                accept="image/*"
                                className="form-input" 
                                onChange={(e) => setRiderPhoto(e.target.files[0])}
                                style={{ padding: '0.6rem 0.5rem 0.5rem 2.8rem' }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Driving License Photo</label>
                        <div className="input-wrapper">
                            <FileBadge className="input-icon" size={20} />
                            <input 
                                type="file"
                                accept="image/*"
                                className="form-input" 
                                onChange={(e) => setLicensePhoto(e.target.files[0])}
                                style={{ padding: '0.6rem 0.5rem 0.5rem 2.8rem' }}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={isSubmitting}
                        style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
                    >
                        {isSubmitting ? 'Registering...' : 'Register Vehicle'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddVehicle;