import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hotels, setHotels] = useState([]);

  // Backend eken data genna ganna hook eka
  useEffect(() => {
    fetch('http://localhost:5001/api/hotels')
      .then((response) => response.json())
      .then((data) => setHotels(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="app-container">
      <h1>WanderLanka Hotels</h1>
      <p>Ape database eken gaththa hotels list eka pahala thiyenawa:</p>
      
      <div className="hotel-list">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="hotel-card">
            <h2>{hotel.name}</h2>
            <p><strong>Location:</strong> {hotel.location}</p>
            <p><strong>Price:</strong> {hotel.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;