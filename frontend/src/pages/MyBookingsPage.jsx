import React, { useState, useEffect } from 'react';
import api from '../api';
import Loader from '../components/Loader';

function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/my-bookings');
                setBookings(response.data);
            } catch (err) {
                setError('Failed to fetch your bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="dashboard-container">
            <h2>My Bookings</h2>
            {error && <p className="error">{error}</p>}
            {bookings.length > 0 ? (
                <ul>
                    {bookings.map(booking => (
                        <li key={booking._id} className="booking-item">
                           Appointment at: {new Date(booking.startTime).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : <p>You have no bookings.</p>}
        </div>
    );
}

export default MyBookingsPage;