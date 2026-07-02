import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Car, User, CreditCard, Phone, Tag, DollarSign, Bike } from 'lucide-react';

function AddVehicle() {
    const [vehicle, setVehicle] = useState({ driverName: '', nic: '', phone: '', vehicleType: '', plateNumber: '', pricePerDay: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5001/api/vehicles', vehicle);
            alert('Vehicle registered successfully!');
            navigate('/riders'); // Register una gaman list ekata yanawa
        } catch (err) {
            alert('Error registering vehicle');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
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