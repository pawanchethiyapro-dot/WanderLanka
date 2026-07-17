import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, CloudRain, Wind, CloudFog, Cloud, RefreshCw, Compass, Hotel, Car, ClipboardList, Lightbulb } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  
  const initialWeather = [
    {
      city: 'Colombo',
      temp: 30,
      condition: 'Partly Cloudy',
      humidity: '78%',
      windSpeed: '12 km/h',
      type: 'cloudy',
      tip: 'Perfect for sunset walks on Galle Face Green.'
    },
    {
      city: 'Kandy',
      temp: 26,
      condition: 'Light Showers',
      humidity: '85%',
      windSpeed: '8 km/h',
      type: 'rainy',
      tip: 'Great time to visit the Temple of the Tooth.'
    },
    {
      city: 'Nuwara Eliya',
      temp: 16,
      condition: 'Misty & Cold',
      humidity: '90%',
      windSpeed: '10 km/h',
      type: 'misty',
      tip: 'Wear warm clothes & enjoy Ceylon tea!'
    },
    {
      city: 'Ella',
      temp: 22,
      condition: 'Windy & Clear',
      humidity: '65%',
      windSpeed: '20 km/h',
      type: 'windy',
      tip: 'Excellent day to hike Nine Arch Bridge or Ella Rock.'
    },
    {
      city: 'Galle',
      temp: 29,
      condition: 'Sunny & Warm',
      humidity: '72%',
      windSpeed: '15 km/h',
      type: 'sunny',
      tip: 'Excellent day to swim or stroll the Historic Fort.'
    },
    {
      city: 'Trincomalee',
      temp: 33,
      condition: 'Sunny & Hot',
      humidity: '60%',
      windSpeed: '14 km/h',
      type: 'sunny',
      tip: 'Superb day for whale watching or Nilaveli beach.'
    }
  ];

  const [weatherList, setWeatherList] = useState(initialWeather);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const updated = weatherList.map(item => {
        const diff = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newTemp = item.temp + diff;
        const humNum = parseInt(item.humidity) + (Math.floor(Math.random() * 5) - 2);
        return {
          ...item,
          temp: newTemp,
          humidity: `${Math.min(Math.max(humNum, 40), 99)}%`
        };
      });
      setWeatherList(updated);
      setIsRefreshing(false);
    }, 800);
  };

  const getWeatherIcon = (type, size = 32) => {
    switch (type) {
      case 'sunny':
        return <Sun size={size} style={{ color: '#eab308' }} />;
      case 'rainy':
        return <CloudRain size={size} style={{ color: '#60a5fa' }} />;
      case 'misty':
        return <CloudFog size={size} style={{ color: '#94a3b8' }} />;
      case 'windy':
        return <Wind size={size} style={{ color: '#38bdf8' }} />;
      case 'cloudy':
      default:
        return <Cloud size={size} style={{ color: '#cbd5e1' }} />;
    }
  };

  const getWeatherGradient = (type) => {
    switch (type) {
      case 'sunny':
        return 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(217, 119, 6, 0.03) 100%)';
      case 'rainy':
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(29, 78, 216, 0.03) 100%)';
      case 'misty':
        return 'linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0%, rgba(71, 85, 105, 0.03) 100%)';
      case 'windy':
        return 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(2, 132, 199, 0.03) 100%)';
      case 'cloudy':
      default:
        return 'linear-gradient(135deg, rgba(203, 213, 225, 0.12) 0%, rgba(100, 116, 139, 0.03) 100%)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Hero Banner Section */}
      <div style={{
        position: 'relative',
        height: '85vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        
        {/* YouTube Video Background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 0,
          overflow: 'hidden',
          backgroundColor: '#0a1628' // Fallback color
        }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/hero-bg.mp4"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          ></video>
          
          {/* Dark Overlay to make text readable */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(rgba(10, 22, 40, 0.4), rgba(10, 22, 40, 0.7))',
            zIndex: 1
          }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: 'clamp(50px, 8vw, 90px)', 
            margin: '0 0 5px 0', 
            textShadow: '0 8px 30px rgba(0,0,0,0.8)',
            fontFamily: 'var(--sinhala-font)',
            fontWeight: '800',
            letterSpacing: '2px',
            textAlign: 'center'
          }}>
            ආයුබෝවන්
          </h1>
          <h2 style={{
            color: 'var(--primary)',
            fontSize: 'clamp(20px, 3.5vw, 32px)',
            margin: '0 0 25px 0',
            textShadow: '0 4px 15px rgba(0,0,0,0.6)',
            fontFamily: 'var(--heading)',
            fontWeight: '600',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            background: 'linear-gradient(to right, #0ea5e9, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome to Sri Lanka
          </h2>
          <p style={{ 
            fontSize: 'clamp(16px, 2vw, 22px)', 
            maxWidth: '700px', 
            margin: '0 0 40px 0', 
            color: '#e2e8f0', 
            textShadow: '0 4px 15px rgba(0,0,0,0.8)',
            lineHeight: '1.6'
          }}>
            A land of pristine beaches, lush hills, and timeless heritage. Explore premium hotels and hire local travel riders for an unforgettable journey.
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
    </div>

      {/* Sri Lanka Weather Widget */}
      <div style={{ 
        padding: '60px 30px 40px 30px', 
        background: 'var(--bg)', 
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h2 style={{ 
              margin: '0 0 5px 0', 
              fontSize: '28px', 
              color: 'var(--text-h)', 
              fontFamily: 'var(--heading)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Compass style={{ color: 'var(--primary)' }} /> Live Weather & Travel Tips
            </h2>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '15px' }}>
              Check current regional weather conditions in Sri Lanka to plan your travels.
            </p>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              borderRadius: '30px',
              color: 'var(--text-h)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              boxShadow: 'none',
              transform: 'none'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
          >
            <RefreshCw 
              size={16} 
              style={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                color: 'var(--primary)'
              }} 
            />
            {isRefreshing ? 'Updating...' : 'Refresh Weather'}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          width: '100%'
        }}>
          {weatherList.map((w) => (
            <div 
              key={w.city}
              className="card"
              style={{
                padding: '24px',
                background: getWeatherGradient(w.type),
                border: '1px solid var(--border)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'default',
                boxShadow: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: 'var(--text-h)', fontWeight: '700' }}>{w.city}</h3>
                  <span style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: '500' }}>{w.condition}</span>
                </div>
                {getWeatherIcon(w.type, 36)}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-h)', lineHeight: 1 }}>{w.temp}</span>
                <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>°C</span>
              </div>

              <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase' }}>HUMIDITY</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-h)', fontWeight: '700' }}>{w.humidity}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase' }}>WIND</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-h)', fontWeight: '700' }}>{w.windSpeed}</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                borderRadius: '12px', 
                padding: '10px 12px',
                fontSize: '13px',
                color: 'var(--text)',
                lineHeight: '1.4',
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Lightbulb size={16} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                <span><strong>Trip Tip:</strong> {w.tip}</span>
              </div>
            </div>
          ))}
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <Hotel size={48} style={{ color: 'var(--primary)' }} />
            </div>
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <Car size={48} style={{ color: 'var(--primary)' }} />
            </div>
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <ClipboardList size={48} style={{ color: 'var(--primary)' }} />
            </div>
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