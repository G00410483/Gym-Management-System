import React from 'react'; // Import React library
import { render, fireEvent } from '@testing-library/react'; // Import render and fireEvent functions from testing-library/react
import EditClass from '../../../src/components/classes/EditClass'; // Import the EditClass component to be tested

describe('EditClass component', () => {
  // Editing class for testing
  const editingClass = { 
    id: 1,
    class_name: 'Test Class',
    instructor_name: 'Test Instructor',
    time: '10:00',
    day: 'Monday',
    max_capacity: 20
  };

  // Test case to check if component renders with correct initial values
  it('renders with correct initial values', () => { 
    // Render the EditClass component
    const { getByLabelText, getByText } = render( 
        // Pass necessary props
      <EditClass show={true} onHide={() => {}} editingClass={editingClass} handleEditClass={() => {}} /> // Pass necessary props
    );
  
    // Assert that inputs have correct initial values
    expect(getByLabelText('Class Name')).toHaveValue('Test Class');
    expect(getByLabelText('Instructor Name')).toHaveValue('Test Instructor');
    expect(getByLabelText('Time')).toHaveValue('10:00');
    expect(getByLabelText('Day')).toHaveValue('Monday');
    expect(getByLabelText('Max Capacity').value).toEqual('20'); // Access value directly and compare
    expect(getByText('Save Changes')).toBeInTheDocument(); // Assert that Save Changes button is present
    expect(getByText('Close')).toBeInTheDocument(); // Assert that Close button is present
  });

  it('calls onHide when close button is clicked', () => { // Test case to check if onHide is called when close button is clicked
    const onHideMock = jest.fn(); // Mock onHide function
    const { getByText } = render( // Render the EditClass component
      <EditClass show={true} onHide={onHideMock} editingClass={editingClass} handleEditClass={() => {}} /> // Pass necessary props
    );

    fireEvent.click(getByText('Close')); // Simulate click on Close button
    expect(onHideMock).toHaveBeenCalled(); // Assert that onHide is called
  });
});
