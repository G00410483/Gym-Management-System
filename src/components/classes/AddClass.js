// AddClassModal.js
import { Button, Modal, Form } from 'react-bootstrap';
import { daysOfWeek } from '../constants';

/* Functional component that extracts properties that are passed down form a parent component 'Classes' */
function AddClass({ show, handleClose, handleAddClass }) {

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Add New Class</Modal.Title>
      </Modal.Header>
      {/* Form for adding a new class starts here */}
      <Form onSubmit={handleAddClass}>
        <Modal.Body>
          {/* Input field for class name */}
          <Form.Group className="mb-3" controlId="formClassName">
            <Form.Label>Class Name</Form.Label>
            <Form.Control type="text" name="class_name" required />
          </Form.Group>

          {/* Input field for class time */}
          <Form.Group className="mb-3" controlId="formTime">
            <Form.Label>Time</Form.Label>
            <Form.Control type="time" name="time" required />
          </Form.Group>

          {/* Input field for instructor name */}
          <Form.Group className="mb-3" controlId="formInstructorName">
            <Form.Label>Instructor Name</Form.Label>
            <Form.Control type="text" name="instructor_name" required />
          </Form.Group>

          {/* Dropdown for selecting class day */}
          <Form.Group className="mb-3" controlId="formDay">
            <Form.Label>Day</Form.Label>
            <Form.Select name="day" required>
              <option value="">Select Day</option>
              {daysOfWeek.map((day, index) => (
                <option key={index} value={day}>{day}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Input for maximum class capacity */}
          <Form.Group className="mb-3" controlId="formMaxCapacity">
            <Form.Label>Max Capacity</Form.Label>
            <Form.Control type="number" name="max_capacity" required />
          </Form.Group>

          {/* Input for class image URL */}
          <Form.Group className="mb-3" controlId="formImageUrl">
            <Form.Label>Image URL</Form.Label>
            <Form.Control type="url" name="image" placeholder="https://example.com/image.jpg" required />
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
