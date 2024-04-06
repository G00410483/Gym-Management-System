// Import neccessary modules
import React, { useState, useEffect } from 'react';
import './BookingsDisplay.css';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';
import { Dropdown, DropdownButton } from 'react-bootstrap';

function BookingsDisplay() {
  // State hooks
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('');

  // Function to fetch bookings from a server that accepts an optional sort criteria
  const fetchBookings = async (sortCriteria = '') => {
    try {
      // Send GET request to the server with an optional sort criteria
      const response = await axios.get(`http://localhost:3001/bookingsDisplay?sort=${sortCriteria}`);
      // Updating the bookings state with the fetched data
      setBookings(response.data);
    } catch (error) {
      console.error('There was an error fetching the members:', error);
    }
  };
  useEffect(() => {
    fetchBookings(sort); // Fetch bookings with current sort criteria
  }, [sort]);

  // Function to hnadle search input changes
  const handleSearchChange = (event) => {
    // Update search term state
    setSearchTerm(event.target.value);
  };

  // Function to hnadle sort option changes
  const handleSortChange = (sortCriteria) => {
    setSort(sortCriteria);
    fetchBookings(sortCriteria); // Pass the sort criteria to your fetch function
  };

  // Rendering filtered members based on search term
  // Reference: https://stackoverflow.com/questions/72194163/how-to-define-string-for-tolowercase-for-filter-search-with-multiple-search-ite
  const filteredBookings = bookings.filter(bookings =>
    bookings.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookings.email_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bookings-display">
      <Form>
        {/* Dropdown menu for selecting sort criteria */}
        <DropdownButton
          id="dropdown-button"
          title="Sort Bookings"
          variant="primary"
          className="mb-3"
        >
          {/* Dropdown items for each sort option */}
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

        {/* Search input field */}
        <Form.Group className="mb-3" controlId="searchInput">
          <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
        </Form.Group>
      </Form>
      {/* Table to display the filtered bookings */}
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
              {/* Formatting the date to remove time */}
              <td>{new Date(booking.date).toISOString().split('T')[0]}</td> {/* Remove time */}
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
}



export default BookingsDisplay;
