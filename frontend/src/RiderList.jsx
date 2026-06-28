// RiderList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';


function RiderList() {
    const [riders, setRiders] = useState([]);

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
        <div>
    <h1>All Riders</h1>
    {riders.length > 0 ? (
        riders.map(r => <div key={r._id}>{r.driverName || "No Name"}</div>)
    ) : (
        <p>No riders found in database.</p>
    )}
</div>
    );
}
export default RiderList;