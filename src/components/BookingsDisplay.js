import React, { useState, useEffect } from 'react';
import './BookingsDisplay.css';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';
import { Dropdown, DropdownButton } from 'react-bootstrap';

function BookingsDisplay() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('');

  const fetchBookings = async (sortCriteria = '') => {
    try {
      // Update the URL with sort parameter
      const response = await axios.get(`http://localhost:3001/bookingsDisplay?sort=${sortCriteria}`);
      setBookings(response.data);
    } catch (error) {
      console.error('There was an error fetching the members:', error);
    }
  };
  useEffect(() => {
    fetchBookings(sort); // Fetch members with current sort criteria
  }, [sort]); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (sortCriteria) => {
    setSort(sortCriteria);
    fetchBookings(sortCriteria); // Pass the sort criteria to your fetch function
  };

  // Rendering filtered members based on search term
  const filteredBookings = bookings.filter(bookings =>
    bookings.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookings.email_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bookings-display">
      <h2>Bookings Display</h2>
      <Form>
        <DropdownButton
          id="dropdown-button"
          title="Sort Bookings"
          variant="primary"
          className="mb-3"
        >
          <Dropdown.Item onClick={() => handleSortChange('email_address ASC')}>
            Email Address
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('class_name ASC')}>
            Class Name
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('date ASC')}>
            Date
          </Dropdown.Item>
        </DropdownButton>

        <Form.Group className="mb-3" controlId="searchInput">
          <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
        </Form.Group>
      </Form>
      {/* Bootstrap Table used for styling */}
      <Table striped bordered hover>
        <thead>
          <tr>
            {/* Table headers */}
            <th>#</th>
            <th>Email Address</th>
            <th>Class</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over filteredMembers array to render each member as a row in the table */}
          {filteredBookings.map((booking, index) => (
            <tr key={booking.id}>
              <td>{index + 1}</td>
              {/* Render member details in each cell */}
              <td>{booking.email_address}</td>
              <td>{booking.class_name}</td>
              <td>{new Date(booking.date).toISOString().split('T')[0]}</td> {/* Remove time */}
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
}



export default BookingsDisplay;
