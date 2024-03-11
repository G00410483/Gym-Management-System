import React, { useState, useEffect } from 'react';

function BookingsDisplay() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Function to fetch bookings from your backend
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

  // Render the fetched bookings
  return (
    <div>
      <h2>Bookings Display</h2>
      <AllBookingsView bookings={bookings} />
    </div>
  );
}

function AllBookingsView({ bookings }) {
  return (
    <div>
      {bookings.map((booking, index) => (
        <div key={index}>
          <p>Email: {booking.email_address}</p>
          <p>Class: {booking.class_name}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default BookingsDisplay;
