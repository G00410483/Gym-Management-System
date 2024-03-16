// AddClassModal.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { daysOfWeek } from '../constants';

function AddClass({ show, handleClose, editingClass, handleAddClass }) {

  const [availableClassNames, setAvailableClass] = useState([]);

  useEffect(() => {
    const fetchAvailableClass = async () => {
      const response = await fetch('http://localhost:3001/availableClasses');
      const data = await response.json();
      setAvailableClass(data);
    };

    if (show) { // Fetch available class names only if the modal is shown
      fetchAvailableClass();
    }
  }, [show]); // Re-fetch every time the modal is shown
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Class</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleAddClass(e, editingClass.id)}>
        <Modal.Body>
        <Form.Group className="mb-3" controlId="formClassName">
            <Form.Label>Class Name</Form.Label>
            <Form.Select name="class_name" required>
              {availableClassNames.map((classInfo, index) => (
                <option key={index} value={classInfo.class_name}>{classInfo.class_name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTime">
            <Form.Label>Time</Form.Label>
            <Form.Control type="time" name="time" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDay">
            <Form.Label>Day</Form.Label>
            <Form.Select name="day" required>
              {daysOfWeek.map((day, index) => (
                <option key={index} value={day}>{day}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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

export default AddClass;
