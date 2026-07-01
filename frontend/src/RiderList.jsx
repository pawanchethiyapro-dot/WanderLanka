// RiderList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function RiderList() {
    const [riders, setRiders] = useState([]);
    const navigate = useNavigate();

    // Data fetch karana function eka
    const fetchRiders = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/vehicles'); // Oyage endpoint eka hari da balanna
            setRiders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRiders(); // Page eka load weddi run wenawa
    }, []); // Me empty array eka thibboth page eka reload wenna ona

   return (
    <div className="card-container"> 
        {riders.map((r) => (
            <div key={r._id} className="card"> 
                {/* Rider ge details */}
                <h3>{r.driverName}</h3>
                <p>Vehicle: {r.vehicleType}</p>
                <p>Contact: {r.phone}</p>
                <p>Price: Rs. {r.pricePerDay} / Day</p>
                <button 
                    onClick={() => navigate(`/book-rider/${r._id}`)}
                    style={{
                        marginTop: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Book Rider
                </button>
            </div>
        ))}
    </div>
);
}
export default RiderList;