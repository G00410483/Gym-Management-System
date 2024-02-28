import React, { useState, useEffect } from 'react';
import './ClassesPage.css';
import { Button, Modal, Form, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingClass, setEditingClass] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:3001/classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const handleClassSelect = (classId) => {
    const selected = classes.find(c => c.id === classId);
    setSelectedClass(selected);
  };

  const handleAddClass = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const classData = Object.fromEntries(formData.entries());

    try {
      await fetch('http://localhost:3001/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });
      fetchClasses();
      setShowAdd(false);
      showAlertWithMessage('Class added successfully!');
    } catch (error) {
      console.error('Failed to add class:', error);
    }
  };

  const handleEditClass = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const classData = { ...editingClass, ...Object.fromEntries(formData.entries()) };

    try {
      await fetch(`http://localhost:3001/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });
      fetchClasses();
      setShowEdit(false);
      showAlertWithMessage('Class updated successfully!');
    } catch (error) {
      console.error('Failed to update class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await fetch(`http://localhost:3001/classes/${classId}`, {
        method: 'DELETE',
      });
      fetchClasses();
      showAlertWithMessage('Class deleted successfully!');
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  const showAlertWithMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div>
      <h1>Weekly Class Schedule</h1>
      <Button className="mb-3" onClick={() => setShowAdd(true)}>
        <FontAwesomeIcon icon={faPlus} /> Add Class
      </Button>
      {showAlert && <Alert variant="success">{alertMessage}</Alert>}
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
          {classes.map((classData, index) => (
            <tr key={classData.id}>
              <td>{classData.time}</td>
              {daysOfWeek.map((day, dayIndex) => (
                <td key={dayIndex} className={selectedClass && selectedClass.id === classData.id ? 'selected' : ''}>
                  {classData.day === day ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button variant="outline-primary" size="sm" onClick={() => { handleClassSelect(classData); setSelectedClass(classData); }}>
                        <FontAwesomeIcon icon={faEdit} />
                        {classData.name}
                      </Button>

                      <div>
                        <Button variant="outline-primary" size="sm" onClick={() => { setEditingClass(classData); setShowEdit(true); }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        {' '}
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClass(classData.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying details of the selected class */}
      {selectedClass && (
        <Modal show={selectedClass !== null} onHide={() => setSelectedClass(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Selected Class: {selectedClass.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Instructor: {selectedClass.instructor_name}<br />
              Time: {selectedClass.time}<br />
              Day: {selectedClass.day}<br />
              Max Capacity: {selectedClass.max_capacity}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setSelectedClass(null)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}


    </div>
  );
}

export default ClassesPage;
