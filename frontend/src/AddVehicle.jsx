import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddVehicle() {
    const [vehicle, setVehicle] = useState({ driverName: '', nic: '', phone: '', vehicleType: '', plateNumber: '', pricePerDay: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/vehicles', vehicle);
            alert('Vehicle registered successfully!');
            navigate('/riders'); // Register una gaman list ekata yanawa
        } catch (err) {
            alert('Error registering vehicle');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register Rider</h1>
            <input placeholder="Driver Name" onChange={(e) => setVehicle({...vehicle, driverName: e.target.value})} />
            <input placeholder="NIC" onChange={(e) => setVehicle({...vehicle, nic: e.target.value})} />
            <input placeholder="Phone" onChange={(e) => setVehicle({...vehicle, phone: e.target.value})} />
            <input placeholder="Vehicle Type" onChange={(e) => setVehicle({...vehicle, vehicleType: e.target.value})} />
            <input placeholder="Plate Number" onChange={(e) => setVehicle({...vehicle, plateNumber: e.target.value})} />
            <input type="number" placeholder="Price Per Day" onChange={(e) => setVehicle({...vehicle, pricePerDay: e.target.value})} />
            <button type="submit">Register Vehicle</button>
        </form>
    );
}

export default AddVehicle;