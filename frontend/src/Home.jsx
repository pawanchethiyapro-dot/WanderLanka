import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Hero Banner Section */}
      <div style={{
        position: 'relative',
        height: '480px',
        width: '100%',
        backgroundImage: 'linear-gradient(rgba(10, 22, 40, 0.65), rgba(10, 22, 40, 0.85)), url("https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '52px', 
          margin: '0 0 10px 0', 
          textShadow: '0 4px 10px rgba(0,0,0,0.5)',
          fontFamily: 'var(--heading)',
          fontWeight: '800'
        }}>
          Ayubowan! 🌴
        </h1>
        <p style={{ 
          fontSize: '20px', 
          maxWidth: '650px', 
          margin: '0 0 30px 0', 
          color: '#cbd5e1', 
          textShadow: '0 2px 5px rgba(0,0,0,0.5)',
          lineHeight: '1.5'
        }}>
          Welcome to Sri Lanka, a land of pristine beaches, lush hills, and timeless heritage. Explore premium hotels and hire local travel riders.
        </p>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/hotels')}
            style={{
              padding: '12px 28px',
              fontSize: '16px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(0, 177, 168, 0.4)'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--primary-hover)'}
            onMouseOut={(e) => e.target.style.background = 'var(--primary)'}
          >
            Explore Hotels
          </button>
          <button 
            onClick={() => navigate('/riders')}
            style={{
              padding: '12px 28px',
              fontSize: '16px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: '700',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.target.style.background = 'white'; e.target.style.color = 'var(--navy-blue)'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'white'; }}
          >
            Find Travel Riders
          </button>
        </div>
      </div>

      {/* Grid of features */}
      <div style={{ padding: '50px 30px', background: 'var(--card-bg)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-h)' }}>
          Start Your Journey in Sri Lanka
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Card 1 */}
          <div className="card" style={{ padding: '30px', textAlign: 'center', background: 'var(--bg)' }}>
            <span style={{ fontSize: '48px', marginBottom: '15px' }}>🏨</span>
            <h3 style={{ margin: '10px 0' }}>Book Premium Stays</h3>
            <p style={{ color: 'var(--text)', fontSize: '15px' }}>
              Find and register handpicked hotels from beachfront resorts to misty mountain retreats.
            </p>
            <button 
              onClick={() => navigate('/hotels')}
              style={{
                marginTop: '15px',
                padding: '8px 20px',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                background: 'transparent',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--primary)'; }}
            >
              Browse Hotels
            </button>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ padding: '30px', textAlign: 'center', background: 'var(--bg)' }}>
            <span style={{ fontSize: '48px', marginBottom: '15px' }}>🚗</span>
            <h3 style={{ margin: '10px 0' }}>Hire Travel Riders</h3>
            <p style={{ color: 'var(--text)', fontSize: '15px' }}>
              Connect with verified drivers and riders to guide you safely through cultural spots.
            </p>
            <button 
              onClick={() => navigate('/riders')}
              style={{
                marginTop: '15px',
                padding: '8px 20px',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                background: 'transparent',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--primary)'; }}
            >
              Find Riders
            </button>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ padding: '30px', textAlign: 'center', background: 'var(--bg)' }}>
            <span style={{ fontSize: '48px', marginBottom: '15px' }}>📋</span>
            <h3 style={{ margin: '10px 0' }}>Manage Reservations</h3>
            <p style={{ color: 'var(--text)', fontSize: '15px' }}>
              Easily view your active room bookings and hired driver logs in one single interface.
            </p>
            <button 
              onClick={() => navigate('/my-bookings')}
              style={{
                marginTop: '15px',
                padding: '8px 20px',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                background: 'transparent',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--primary)'; }}
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;