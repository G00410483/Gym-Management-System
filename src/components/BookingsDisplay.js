import React, { useState, useEffect } from 'react';
import './BookingsDisplay.css'; 

function BookingsDisplay() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:3001/bookingsDisplay');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  return (
    <div className="bookings-display">
      <h2>Bookings Display</h2>
      <AllBookingsView bookings={bookings} />
    </div>
  );
}

function AllBookingsView({ bookings }) {
  return (
    <div className="bookings-grid">
      {bookings.map((booking, index) => (
        <div className="booking-card" key={index}>
          <h3>{booking.class_name}</h3>
          <p><strong>Email:</strong> {booking.email_address}</p>
          <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default BookingsDisplay;
