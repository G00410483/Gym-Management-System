import React, { useState, useEffect } from 'react';
import './ClassesPage.css';
import { Button, Modal, Form, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faInfoCircle, faChalkboardTeacher, faClock, faCalendarDay, faUsers } from '@fortawesome/free-solid-svg-icons';


// Array representing days of the week.
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function ClassesPage() {
  // State variables managed using the useState hook
  const [classes, setClasses] = useState([]);
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingClass, setEditingClass] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // useEffect hook to fetch classes data when the component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  // Define an asynchronous function named fetchClasses
  const fetchClasses = async () => {
    try {
      // Send a GET request to fetch class data from the server
      const response = await fetch('http://localhost:3001/classes');
      // Extract JSON data from the response
      const data = await response.json();
      // Update the classes state with the fetched data
      setClasses(data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  // Define a function named handleClassSelect that takes a classId parameter
  const handleClassSelect = (classId, day) => {
    // Find the selected class from the classes state based on the provided classId
    const selected = classes.find(c => c.id === classId);
    // Set the selected class in the state
    setSelectedClass(selected);
    // Set the selected cell ID using both classId and day for uniqueness
    setSelectedCellId(`${classId}-${day}`);
  };


  // Define an asynchronous function named handleAddClass that takes an event parameter
  const handleAddClass = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Create a FormData object from the form data submitted
    const formData = new FormData(event.target);
    // Convert the FormData object into a plain JavaScript object containing form field values
    const classData = Object.fromEntries(formData.entries());

    try {
      // Send a POST request to the server to add a new class
      await fetch('http://localhost:3001/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Convert the class data object to JSON format and set it as the request body
        body: JSON.stringify(classData),
      });
      // Refresh the classes data after adding a new class
      fetchClasses();
      // Hide the modal for adding a new class
      setShowAdd(false);
      // Show an alert message indicating successful class addition
      showAlertWithMessage('Class added successfully!');
    } catch (error) {
      console.error('Failed to add class:', error);
    }
  };

  // Define an asynchronous function named handleEditClass that takes an event parameter 
  const handleEditClass = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Create a FormData object from the form data submitted
    const formData = new FormData(event.target);
    // Merge the existing editingClass data with the updated form data to create a new class data object
    const classData = { ...editingClass, ...Object.fromEntries(formData.entries()) };

    try {
      // Send a PUT request to update the class data on the server
      await fetch(`http://localhost:3001/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Convert the class data object to JSON format and set it as the request body
        body: JSON.stringify(classData),
      });
      // Refresh the classes data after editing a class
      fetchClasses();
      // Hide the modal for editing a class
      setShowEdit(false);
      // Show an alert message indicating successful class update
      showAlertWithMessage('Class updated successfully!');
    } catch (error) {
      console.error('Failed to update class:', error);
    }
  };

  // Define an asynchronous function named handleDeleteClass that takes a classId parameter
  const handleDeleteClass = async (classId) => {
    try {
      // Send a DELETE request to delete the class data on the server
      await fetch(`http://localhost:3001/classes/${classId}`, {
        method: 'DELETE',
      });
      // Refresh the classes data after deleting a class
      fetchClasses();
      // Show an alert message indicating successful class deletion
      showAlertWithMessage('Class deleted successfully!');
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  // Define a function named showAlertWithMessage that takes a message parameter
  const showAlertWithMessage = (message) => {
    // Set the alert message in the component state
    setAlertMessage(message);
    // Show the alert
    setShowAlert(true);
    // Hide the alert after 3000 milliseconds (3 seconds)
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Define a function named 'groupClassesByTime' that accepts an array of objects named 'classes'.
  // Reference: https://stackoverflow.com/questions/52027207/javascript-reduce-split-accumulator-in-multiple-variables
  const groupClassesByTime = (classes) => {
    // Use the 'reduce' method on the 'classes' array that takes a callback function
    // and an initial value for the accumulator (in this case, an empty object {}).
    return classes.reduce((acc, curr) => {
      // Checks if 'acc' already has a key corresponding to the current class's 'time' property.
      // If it does it uses that key value if not it initializes it with an empty array.
      // Then it '.push(cur)' adds the current class object to the array for that time slot.
      (acc[curr.time] = acc[curr.time] || []).push(curr);
      return acc;
    }, {});
  };

  // Group classes by time
  const groupedClasses = groupClassesByTime(classes);

  return (
    <div>
      <h1>Weekly Class Schedule</h1>

      {/* ADD NEW CLASS BUTTON */}
      <div className="table-container">
        <div className="add-class-button-container">
          <Button id='addClassBtn' className="mb-3" onClick={() => setShowAdd(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add Class
          </Button>
        </div>
        <table className="schedule-table">
        </table>
      </div>

      {showAlert && <Alert variant="success">{alertMessage}</Alert>}

      {/* TIMETABLE SECTION */}
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Time / Day</th>
            {daysOfWeek.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedClasses).map(([time, classesAtThisTime]) => (
            <tr key={time}>
              <td>{time}</td>
              {daysOfWeek.map((day, dayIndex) => (
                <td key={dayIndex}>
                  {classesAtThisTime.filter(classForDay => classForDay.day === day).map((filteredClass) => (
                    <div key={filteredClass.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button id='classInfoBtn' variant="outline-primary" size="sm"
                        onClick={() => handleClassSelect(filteredClass.id, day)}>
                        {filteredClass.name}
                        <br />
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </Button>

                      <div>
                        <Button id='ttBtn' variant="outline-primary" size="sm" onClick={() => { setEditingClass(filteredClass); setShowEdit(true); }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button id='ttBtn' variant="outline-danger" size="sm" onClick={() => handleDeleteClass(filteredClass.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>

      {/* MODAL FOR DISPLAYING SELECTED CLASS */}
      {selectedClass && (
       <Modal show={selectedClass !== null} onHide={() => setSelectedClass(null)}>
       <Modal.Header>
         <Modal.Title>{selectedClass.name}</Modal.Title>
         <FontAwesomeIcon icon={faInfoCircle} />
       </Modal.Header>
       <Modal.Body>
         <p><FontAwesomeIcon icon={faChalkboardTeacher} className="modal-icon" />Instructor: {selectedClass.instructor_name}<br />
         <FontAwesomeIcon icon={faClock} className="modal-icon" />Time: {selectedClass.time}<br />
         <FontAwesomeIcon icon={faCalendarDay} className="modal-icon" />Day: {selectedClass.day}<br />
         <FontAwesomeIcon icon={faUsers} className="modal-icon" />Max Capacity: {selectedClass.max_capacity}</p>
         <img id="classImg"src="https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_auto,q_auto:best/newscms/2020_23/1576521/workout-classes-kb-main-200603.jpg" alt="Class Visual" className="modal-image" />
       </Modal.Body>
       <Modal.Footer>
         <Button variant="primary" onClick={() => setSelectedClass(null)}>Close</Button>
       </Modal.Footer>
     </Modal>
     
      )}

      {/* MODAL FOR ADDING NEW CLASS */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Class</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddClass}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formClassName">
              <Form.Label>Class Name</Form.Label>
              <Form.Control type="text" name="name" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formInstructorName">
              <Form.Label>Instructor Name</Form.Label>
              <Form.Control type="text" name="instructor_name" required />
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
            <Form.Group className="mb-3" controlId="formMaxCapacity">
              <Form.Label>Max Capacity</Form.Label>
              <Form.Control type="number" name="max_capacity" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* MODAL FOR EDITING SPECIFIC CLASS */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Class</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditClass}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formClassName">
              <Form.Label>Class Name</Form.Label>
              <Form.Control type="text" defaultValue={editingClass.name} name="name" required />
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
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ClassesPage;
