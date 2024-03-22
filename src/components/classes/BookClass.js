// BookingModal.js
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/* Functional component that extracts properties that are passed down form a parent component 'Classes' */
/*  */
function BookClass({ show, onHide, bookingClass, handleBookingClass, selectedDate, setSelectedDate, getDayOfWeekNumber }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
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
           {/*  Reference: https://stackoverflow.com/questions/62239735/react-date-picker-filtering-dates-issue */}
            <DatePicker
              /*Selected date **/
              selected={selectedDate}
              /* Update the selected date */
              onChange={(date) => setSelectedDate(date)}
              /* Formatting */
              dateFormat="dd/MM/yyyy"
              /*  Set minimum as "today"*/
              minDate={new Date()}
              /* Filtering selectable dates based on the day of the week */
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
