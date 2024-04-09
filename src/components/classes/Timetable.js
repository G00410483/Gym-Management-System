// Timetable.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { daysOfWeek } from '../constants';

// Componenet for displaying timetable
function Timetable({ groupedClasses, handleClassSelect, handleDeleteClass, isLoggedIn, isRole, setEditingClass, setShowEdit, setBookingClass, setShowBooking }) {
  
  // Function to confirm and delete a class
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
          {/* Reference: https://stackoverflow.com/questions/72499657/mapping-through-object-entries */}
          {/* Iterates over the entries of the  groupedClass object */}
          {/* Each entry consists of a time and an arrat of  classAtThisTime scheduled for particular time */}
          {Object.entries(groupedClasses).map(([time, classesAtThisTime]) => (
            // Creates a table row for each time slot, with the time as the key
            <tr key={time}>
              <td>{time}</td>
              {/* Maps over daysOfWeek array */}
              {daysOfWeek.map((day, dayIndex) => (
                // Creates a table cell for each day, with the dayIndex as the key
                // Each cell represents a day of the week for the specific time slot
                <td key={dayIndex}>
                  {/* Within each cell it filters classesAtThisTime array to get classes for the current day */}
                  {classesAtThisTime.filter(classForDay => classForDay.day === day).map((filteredClass) => (
                    // Wraps the calss information dispayed in the cell 
                    <div key={filteredClass.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button id='classInfoBtn' variant="outline-primary" size="sm"
                        onClick={() => handleClassSelect(filteredClass.id, day)}>
                        {filteredClass.class_name}
                        <br />
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </Button>
                      {/* Display if user is logged in and role is admin  */}
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
                      {/* Display if user is logged in and role is admin  */}
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
