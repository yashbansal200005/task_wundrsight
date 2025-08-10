import React, { useState, useEffect } from 'react';
import api from '../api';
import Loader from '../components/Loader';

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                const response = await api.get('/all-bookings');
                setBookings(response.data);
            } catch (err) {
                setError('Failed to fetch all bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllBookings();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="dashboard-container">
            <h2>All Clinic Bookings</h2>
            {error && <p className="error">{error}</p>}
            {bookings.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Patient Email</th>
                            <th>Appointment Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{booking.userId?.name || 'N/A'}</td>
                                <td>{booking.userId?.email || 'N/A'}</td>
                                <td>{new Date(booking.startTime).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>There are no bookings in the system.</p>}
        </div>
    );
}

export default AdminDashboard;