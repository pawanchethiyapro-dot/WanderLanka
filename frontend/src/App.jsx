import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [hotels, setHotels] = useState([]);

  // Backend eken data ganna function eka
  useEffect(() => {
    axios.get('http://localhost:5000/api/hotels')
      .then((response) => {
        setHotels(response.data);
      })
      .catch((error) => {
        console.error("Data ganna bari wuna!", error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Sri Lanka Travel Hub 🌴</h1>
      <h2>Available Hotels</h2>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id} style={{ marginBottom: '10px' }}>
            <strong>{hotel.name}</strong> - {hotel.location} <br />
            Price: {hotel.price} per night
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;