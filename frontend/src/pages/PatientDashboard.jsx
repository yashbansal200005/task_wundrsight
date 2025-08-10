import React, { useState, useEffect } from 'react';
import api from '../api';
import Loader from '../components/Loader';

function PatientDashboard() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const from = new Date().toISOString().split('T')[0];
            const toDate = new Date();
            toDate.setDate(toDate.getDate() + 6);
            const to = toDate.toISOString().split('T')[0];
            const response = await api.get(`/slots?from=${from}&to=${to}`);
            setSlots(response.data);
        } catch (err) {
            setError('Failed to fetch slots.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleBookSlot = async (slotId) => {
        setMessage('');
        setError('');
        try {
            await api.post('/book', { slotId });
            setMessage(`Slot booked successfully! Check "My Bookings".`);
            // Refetch slots to remove the booked one from the list
            fetchSlots();
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to book slot.');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="dashboard-container">
            <h2>Available Slots (Next 7 Days)</h2>
            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}
            <div className="slot-list">
                {slots.length > 0 ? slots.map(slot => (
                    <div key={slot.slotId} className="slot-item">
                        <span>
                            {new Date(slot.startTime).toLocaleString()}
                        </span>
                        <button onClick={() => handleBookSlot(slot.slotId)}>Book</button>
                    </div>
                )) : <p>No available slots found.</p>}
            </div>
        </div>
    );
}

export default PatientDashboard;