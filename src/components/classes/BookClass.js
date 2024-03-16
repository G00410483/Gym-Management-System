// BookingModal.js
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BookClass({ show, onHide, bookingClass, handleBookingClass, selectedDate, setSelectedDate, getDayOfWeekNumber }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Book Class</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleBookingClass}>
        <Modal.Body>
          <p>Booking class: {bookingClass.class_name}</p>
          <Form.Group className="mb-3" controlId="formBookingEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" name="email_address" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBookingDate">
            <Form.Label>Select Date</Form.Label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              filterDate={(date) => date.getDay() === getDayOfWeekNumber(bookingClass.day)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Book Now
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BookClass;
