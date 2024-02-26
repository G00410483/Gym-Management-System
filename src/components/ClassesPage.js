import React, { useState } from 'react';
import './ClassesPage.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const timeSlots = ['8:00 AM', '11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleClassSelect = (dayIndex, timeIndex) => {
    setSelectedClass(`Class ${dayIndex + 1}-${timeIndex + 1}`);
  };

  const generateTableData = (timeIndex) => {
    return daysOfWeek.map((_, dayIndex) => (
      <td key={`time-${timeIndex}-day-${dayIndex}`} className={selectedClass === `Class ${dayIndex + 1}-${timeIndex + 1}` ? 'selected' : ''}>
        <Button onClick={() => handleClassSelect(dayIndex, timeIndex)}>Class {dayIndex + 1}-{timeIndex + 1}</Button>
      </td>
    ));
  };

  return (
    <div>
      <h1>Weekly Class Schedule</h1>
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
              <td>{time}</td>
              {generateTableData(index)}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedClass && (
      <div className="card-container">
        <Card className="card-style">
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Selected Class: {selectedClass}</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </div>
    )}
  </div>
);
}

export default ClassesPage;
