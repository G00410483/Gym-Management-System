// Timetable.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { daysOfWeek } from '../constants';

function Timetable({ groupedClasses, handleClassSelect, handleDeleteClass, isLoggedIn, isRole, setEditingClass, setShowEdit, setBookingClass, setShowBooking }) {
  
  const confirmAndDeleteClass = (classId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this class?');
    if (isConfirmed) {
      handleDeleteClass(classId);
    }
  };
  
  return (
    <div>
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
                        {filteredClass.class_name}
                        <br />
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </Button>
                      {isLoggedIn && isRole('admin') && (
                        <div>
                          <Button id='editBtn' variant="outline-primary" size="sm" onClick={() => { setEditingClass(filteredClass); setShowEdit(true); }}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button id='deleteBtn' variant="outline-danger" size="sm" onClick={() => confirmAndDeleteClass(filteredClass.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      )}
                      {isLoggedIn && !isRole('admin') && (
                        <div>
                          <Button id='editBtn' variant="outline-primary" size="sm" onClick={() => { setBookingClass(filteredClass); setShowBooking(true); }}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Timetable;
