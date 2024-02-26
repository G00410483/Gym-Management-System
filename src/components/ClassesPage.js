import React, { useState } from 'react';
import './ClassesPage.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function ClassesPage() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleClassSelect = (dayIndex, timeIndex) => {
    setSelectedClass(`Class ${dayIndex + 1}-${timeIndex + 1}`);
  };

  const handleTimeChange = (index, event) => {
    const newTimes = [...timeSlots];
    newTimes[index] = event.target.value;
    setTimeSlots(newTimes);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, '']);
  };

  const removeTimeSlot = (index) => {
    const newTimes = [...timeSlots];
    newTimes.splice(index, 1);
    setTimeSlots(newTimes);
  };

  const generateTableData = (timeIndex) => {
    return daysOfWeek.map((_, dayIndex) => (
      <td key={`time-${timeIndex}-day-${dayIndex}`} className={selectedClass === `Class ${dayIndex + 1}-${timeIndex + 1}` ? 'selected' : ''}>
        <Button variant="secondary" onClick={() => handleClassSelect(dayIndex, timeIndex)}>Class {dayIndex + 1}-{timeIndex + 1}</Button>
      </td>
    ));
  };

  return (
    <div>
      <h1>Weekly Class Schedule</h1>
      <Button onClick={addTimeSlot} className="mb-3">
        <FontAwesomeIcon icon={faPlus} /> Add Time Slot
      </Button>
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
          {timeSlots.map((time, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Enter time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e)}
                />
                <Button variant="danger" size="sm" onClick={() => removeTimeSlot(index)} className="mt-1">
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
              {generateTableData(index)}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedClass && (
        <div className="card-container">
          <Card className="card-style">
            <Card.Body>
              <Card.Title>Selected Class: {selectedClass}{timeSlots}</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </Card.Text>
              <Button variant="primary" onClick={() => setSelectedClass(null)}>Close</Button>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
  
  
}

export default ClassesPage;
