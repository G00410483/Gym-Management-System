import React, { useState, useEffect } from 'react';
import './ClassesPage.css';
import { Button, Modal, Form, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faInfoCircle, faChalkboardTeacher, faClock, faCalendarDay, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../AuthContext'; // Adjust this path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { daysOfWeek } from '../constants';
import BookClass from './BookClass';
import ClassInfo from './ClassInfo';
import EditClass from './EditClass';
import AddClass from './AddClass';
import Timetable from './Timetable';

function ClassesPage() {

  const getDayOfWeekNumber = (dayString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(dayString);
  };

  const { isLoggedIn } = useAuth(); // Use the useAuth hook to get the logged-in status

  // State variables managed using the useState hook
  const [classes, setClasses] = useState([]);
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingClass, setEditingClass] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingClass, setBookingClass] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const handleBookingClass = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.target);
    const email = formData.get('email'); // Ensure this matches the 'name' attribute of your email input field

    const bookingData = {
      class_name: bookingClass.class_name, // Ensure this is the correct property from your state
      email_address: email,
    };

    try {
      const response = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response was not ok.');
      }
      const responseBody = await response.json();
      showAlertWithMessage('Booking successful!');
      setShowBooking(false); // Hide the booking modal on success
    } catch (error) {
      console.error('Failed to book class:', error);
      showAlertWithMessage(`Failed to book class. ${error.message}`);
    }
  };


  // Group classes by time
  const groupedClasses = groupClassesByTime(classes);

  return (
    <div>
      <h1>Weekly Class Schedule</h1>

      {/* ADD NEW CLASS BUTTON */}
      {isLoggedIn && (
        <div className="table-container">
          <div className="add-class-button-container">
            <Button id='addClassBtn' className="mb-3" onClick={() => setShowAdd(true)}>
              <FontAwesomeIcon icon={faPlus} /> Add Class
            </Button>
          </div>
          <table className="schedule-table">
          </table>
        </div>
      )}

      {showAlert && <Alert variant="success">{alertMessage}</Alert>}

      {/* TIMETABLE SECTION */}
      <Timetable
            groupedClasses={groupedClasses}
            handleClassSelect={handleClassSelect}
            handleDeleteClass={handleDeleteClass}
            isLoggedIn={isLoggedIn}
            setEditingClass={setEditingClass}
            setShowEdit={setShowEdit}
            setBookingClass={setBookingClass}
            setShowBooking={setShowBooking}
          />

      {/* MODAL FOR DISPLAYING SELECTED CLASS */}
      <ClassInfo selectedClass={selectedClass} onHide={() => setSelectedClass(null)} />

      {/* MODAL FOR ADDING NEW CLASS */}
      <AddClass
        show={showAdd}
        handleClose={() => setShowAdd(false)}
        handleAddClass={handleAddClass}
      />

      {/* MODAL FOR EDITING SPECIFIC CLASS */}
      <EditClass
        show={showEdit}
        onHide={() => setShowEdit(false)}
        editingClass={editingClass}
        handleEditClass={handleEditClass}
      />

      {/* MODAL FOR BOOKING A CLASS */}
      <BookClass
        show={showBooking}
        onHide={() => setShowBooking(false)}
        bookingClass={bookingClass}
        handleBookingClass={handleBookingClass}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        getDayOfWeekNumber={getDayOfWeekNumber}
      />
    </div>
  );
}

export default ClassesPage;
