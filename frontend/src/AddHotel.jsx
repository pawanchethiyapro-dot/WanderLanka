import { useState } from 'react';
import axios from 'axios';

function AddHotel() {
   const [isSubmitting, setIsSubmitting] = useState(false); // Add this state
        const [hotel, setHotel] = useState({ name: '', location: '', price: '' });

const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Button eka obala iwarai nam thawa yawanna epa

    setIsSubmitting(true); // Process eka patan gatta
    try {
        await axios.post('http://localhost:5001/api/hotels', hotel);
        alert('Hotel added!');
        // Refresh karanna one nam methana call karanna
    } catch (err) {
        alert('Error adding hotel');
    } finally {
        setIsSubmitting(false); // Process eka iwarai
    }
};

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Hotel Name" onChange={(e) => setHotel({...hotel, name: e.target.value})} />
            <input placeholder="Location" onChange={(e) => setHotel({...hotel, location: e.target.value})} />
            <input placeholder="Price" onChange={(e) => setHotel({...hotel, price: Number(e.target.value)})} />
           <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Hotel'}
</button>
        </form>
    );
}

export default AddHotel;