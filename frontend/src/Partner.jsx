import { useNavigate } from 'react-router-dom';
import { Building2, Bike, ArrowRight } from 'lucide-react';

function Partner() {
    const navigate = useNavigate();

    return (
        <div className="page-container" style={{ padding: '4rem 2rem', minHeight: 'calc(100vh - 80px)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ 
                    fontSize: '3rem', 
                    marginBottom: '1rem', 
                    background: 'linear-gradient(to right, #fff, #a1a1aa)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'var(--heading)'
                }}>
                    Partner With WanderLanka
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem auto', lineHeight: '1.6' }}>
                    Join Sri Lanka's fastest growing travel platform. Whether you own a property or a vehicle, start earning with us today.
                </p>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                    gap: '2rem' 
                }}>
                    {/* Hotel Partner Card */}
                    <div className="form-card" style={{ 
                        padding: '3rem 2rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => navigate('/register-hotel')}
                    >
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '20px', 
                            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            <Building2 size={40} style={{ color: 'var(--primary-color)' }} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>Register a Hotel</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.5' }}>
                            List your villa, resort, or guesthouse and reach thousands of travelers looking for the perfect stay in Sri Lanka.
                        </p>
                        <button className="btn-primary" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Get Started <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Rider Partner Card */}
                    <div className="form-card" style={{ 
                        padding: '3rem 2rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => navigate('/register-rider')}
                    >
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '20px', 
                            background: 'linear-gradient(135deg, rgba(0, 177, 168, 0.2) 0%, rgba(3, 105, 161, 0.2) 100%)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            <Bike size={40} style={{ color: 'var(--primary)' }} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>Become a Rider</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.5' }}>
                            Got a Tuk Tuk, Car, or Van? Join our fleet of verified drivers and provide safe transport for tourists across the island.
                        </p>
                        <button className="btn-primary" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Join the Fleet <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Partner;
