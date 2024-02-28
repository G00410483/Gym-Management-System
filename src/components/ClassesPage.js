import React, { useState, useEffect } from 'react';
import './ClassesPage.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:3001/classes');
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const handleClassSelect = (classId) => {
    const selected = classes.find(c => c.id === classId);
    setSelectedClass(selected);
  };

  return (
    <div>
      <h1>Weekly Class Schedule</h1>
      <Button className="mb-3">
        <FontAwesomeIcon icon={faPlus} /> Add Class
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
          {classes.map((classData, index) => (
            <tr key={classData.id}>
              <td>{classData.time}</td>
              {daysOfWeek.map((day, dayIndex) => (
                <td key={dayIndex} className={selectedClass && selectedClass.id === classData.id ? 'selected' : ''}>
                  {classData.day === day ? (
                    <Button variant="secondary" onClick={() => handleClassSelect(classData.id)}>
                      {classData.name}
                    </Button>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedClass && (
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Selected Class: {selectedClass.name}</Card.Title>
            <Card.Text>
              Instructor: {selectedClass.instructor_name}<br />
              Time: {selectedClass.time}<br />
              Day: {selectedClass.day}<br />
              Max Capacity: {selectedClass.max_capacity}
            </Card.Text>
            <Button variant="primary" onClick={() => setSelectedClass(null)}>Close</Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default ClassesPage;
