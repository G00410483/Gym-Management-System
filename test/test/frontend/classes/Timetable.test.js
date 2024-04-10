// Import necessary dependencies and functions for testing
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Timetable from '../../../../src/components/classes/Timetable';

describe('Timetable component', () => {
  const groupedClasses = {
    "10:00": [
      { id: 1, class_name: "Test Class 1", day: "Monday" },
      { id: 2, class_name: "Test Class 2", day: "Tuesday" }
    ],
    "11:00": [
      { id: 3, class_name: "Test Class 3", day: "Wednesday" },
      { id: 4, class_name: "Test Class 4", day: "Thursday" }
    ]
  };

  it('renders correctly with provided classes', () => {
    // Render the Timetable component with provided props
    const { getByText } = render(
      <Timetable
        groupedClasses={groupedClasses}
        handleClassSelect={() => {}}
        handleDeleteClass={() => {}}
        isLoggedIn={true}
        isRole={() => true}
        setEditingClass={() => {}}
        setShowEdit={() => {}}
        setBookingClass={() => {}}
        setShowBooking={() => {}}
      />
    );

    // Assert that class names are rendered correctly
    expect(getByText('Test Class 1')).toBeInTheDocument();
    expect(getByText('Test Class 2')).toBeInTheDocument();
    expect(getByText('Test Class 3')).toBeInTheDocument();
    expect(getByText('Test Class 4')).toBeInTheDocument();
  });

  it('calls handleClassSelect when class info button is clicked', () => {
    // Mock handleClassSelect function
    const handleClassSelectMock = jest.fn();
    // Render the Timetable component with provided props
    const { getByText } = render(
      <Timetable
        groupedClasses={groupedClasses}
        handleClassSelect={handleClassSelectMock}
        handleDeleteClass={() => {}}
        isLoggedIn={true}
        isRole={() => true}
        setEditingClass={() => {}}
        setShowEdit={() => {}}
        setBookingClass={() => {}}
        setShowBooking={() => {}}
      />
    );

    // Simulate click on class info button
    fireEvent.click(getByText('Test Class 1'));
    // Assert that handleClassSelect is called with correct arguments
    expect(handleClassSelectMock).toHaveBeenCalledWith(1, 'Monday');
  });

});
