import React, { useState, useEffect } from 'react';
import './ClassesPage.css';
import { Button, Modal, Form, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faInfoCircle, faChalkboardTeacher, faClock, faCalendarDay, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../AuthContext'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { daysOfWeek } from '../constants';
import BookClass from './BookClass';
import ClassInfo from './ClassInfo';
import EditClass from './EditClass';
import AddClass from './AddClass';
import Timetable from './Timetable';
import axios from 'axios';

function ClassesPage() {

  const getDayOfWeekNumber = (dayString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(dayString);
  };

  const { isLoggedIn, isRole } = useAuth(); // Use the useAuth hook to get the logged-in status

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
      const response = await axios.get('https://gms-deployment-heroku-129176233d83.herokuapp.com/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  // Define a function named handleClassSelect that takes a classId parameter
  const handleClassSelect = (classId, day) => {
    // Searching through the classes array to find an object whose id property matches the provided classId, 
    // and it assigns that object to the selected variable
    // c- represents each element in the 'classes' array- checks if the 'id' property of 'c' is equal to the 'classId' variable
    const selected = classes.find(c => c.id === classId);
    // Set the selected class in the state
    setSelectedClass(selected);
    // Set the selected cell ID using both classId and day for uniqueness
    setSelectedCellId(`${classId}-${day}`);
  };


  // Define an asynchronous function that takes an event parameter
  const handleAddClass = async (event) => {
    event.preventDefault();
    // Extract form data
    const formData = new FormData(event.target);
    // Convert form data to object
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
    const classData = Object.fromEntries(formData.entries());
  
    try {
      // Send POST request to add new class
      await axios.post('https://gms-deployment-heroku-129176233d83.herokuapp.com/classes', classData, {
        // Set content type header
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Fetch updated list of classes
      fetchClasses();
      // Hide add class form
      setShowAdd(false);
      // Display success message
      showAlertWithMessage('New class added successfully!');
    } catch (error) {
      console.error('Failed to add new class:', error);
    }
  };

// Define an asynchronous function  that takes an event parameter 
const handleEditClass = async (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();
  // Create a FormData object from the form data submitted
  const formData = new FormData(event.target);
  // Merge the existing editingClass data with the updated form data to create a new class data object
  // Reference: https://stackoverflow.com/questions/71384018/typing-object-fromentriesnew-formdataform
  const classData = { ...editingClass, ...Object.fromEntries(formData.entries()) };

  try {
    // Send a PUT request to update the class data on the server using axios
    await axios.put(`https://gms-deployment-heroku-129176233d83.herokuapp.com/classes/${editingClass.id}`, classData, {
      headers: {
        'Content-Type': 'application/json', // Set content type header
      },
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
    // Send a DELETE request to delete the class data on the server using axios
    await axios.delete(`https://gms-deployment-heroku-129176233d83.herokuapp.com/classes/${classId}`);
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


const groupClassesByTime = (classes) => {
    const groupedClasses = {}; // Initialize an empty object to store grouped classes
    
    // Iterate through each class in the 'classes' array
    classes.forEach(curr => {
        // Check if 'groupedClasses' already has a key corresponding to the current class's 'time' property
        // If it does, it concatenates the current class object to the array for that time slot
        // If not, it initializes an array with the current class object for that time slot
        groupedClasses[curr.time] = (groupedClasses[curr.time] || []).concat(curr);
    });
    
    return groupedClasses; // Return the object containing classes grouped by time
};


// Function to handle class booking
const handleBookingClass = async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Create a new FormData object from the event target (form)
  const formData = new FormData(event.target);

  // Retrieve the value of the 'email_address' field from the form
  const email = formData.get('email_address'); // Corrected to match the form's email field name

  // Construct the booking data object
  const bookingData = {
    class_name: bookingClass.class_name, // Retrieve the class name from bookingClass object
    email_address: email, // Use the retrieved email
    date: selectedDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
  };

  try {
    // Make a POST request to the server to book the class using Axios
    const response = await axios.post('https://gms-deployment-heroku-129176233d83.herokuapp.com/bookClass', bookingData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If response is okay, parse the response data
    const responseBody = response.data;

    // Display a success message to the user
    showAlertWithMessage('Booking successful!');

    // Hide the booking modal on success
    setShowBooking(false);
  } catch (error) {
    // If an error occurs during the booking process
    console.error('Failed to book class:', error);
    setShowBooking(false);
    // Show an alert with the error message
    showAlertWithMessage(`Failed to book class. Email address does not exists.`);
  }
};

  // Group classes by time
  const groupedClasses = groupClassesByTime(classes);

  return (
    <div>
      <br></br>
      {/* ADD NEW CLASS BUTTON */}
      {isLoggedIn && isRole('admin') && (
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
            isRole={isRole}
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
