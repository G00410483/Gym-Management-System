import React from 'react';
import './ClassesPage.css'; // Make sure to create a CSS file for styling

const timeSlots = [
  '8:00 AM', '11:00 AM', '14:00 PM', '17:00 PM', '20:00 PM',

];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function ClassesPage() {
  // Placeholder for generating table cells
  const generateTableData = (dayIndex) => {
    return timeSlots.map((_, timeIndex) => (
      <td key={`time-${timeIndex}`}>Class {dayIndex + 1}-{timeIndex + 1}</td>
    ));
  };

  return (
    <div>
      <h1>Weekly Class Schedule</h1>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Time / Day</th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, index) => (
            <tr key={time}>
              <td>{time}</td>
              {generateTableData(index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassesPage;
