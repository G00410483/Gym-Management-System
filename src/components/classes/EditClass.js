import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { daysOfWeek } from '../constants'; // Adjust this path as necessary

function EditClass({ show, onHide, editingClass, handleEditClass }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Class</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleEditClass(e, editingClass.id)}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formClassName">
            <Form.Label>Class Name</Form.Label>
            <Form.Control type="text" defaultValue={editingClass.class_name} name="class_name" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formInstructorName">
            <Form.Label>Instructor Name</Form.Label>
            <Form.Control type="text" defaultValue={editingClass.instructor_name} name="instructor_name" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTime">
            <Form.Label>Time</Form.Label>
            <Form.Control type="time" defaultValue={editingClass.time} name="time" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDay">
            <Form.Label>Day</Form.Label>
            <Form.Select defaultValue={editingClass.day} name="day" required>
              {daysOfWeek.map((day, index) => (
                <option key={index} value={day}>{day}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMaxCapacity">
            <Form.Label>Max Capacity</Form.Label>
            <Form.Control type="number" defaultValue={editingClass.max_capacity} name="max_capacity" required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditClass;
