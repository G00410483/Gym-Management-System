import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddClass from '../../../src/components/classes/AddClass'; // Importing the AddClass component to be tested

test('Add Class Modal renders correctly', () => {
  // Mock functions to simulate event handlers
  const handleClose = jest.fn();
  const handleAddClass = jest.fn();

  // Rendering the AddClass component with mock props
  const { getByLabelText, getByText } = render(
    <AddClass show={true} handleClose={handleClose} handleAddClass={handleAddClass} />
  );

  // Test if modal title is rendered
  expect(getByText('Add New Class')).toBeInTheDocument();

  // Test if form inputs are rendered
  expect(getByLabelText('Class Name')).toBeInTheDocument();
  expect(getByLabelText('Time')).toBeInTheDocument();
  expect(getByLabelText('Instructor Name')).toBeInTheDocument();
  expect(getByLabelText('Day')).toBeInTheDocument();
  expect(getByLabelText('Max Capacity')).toBeInTheDocument();
  expect(getByLabelText('Image URL')).toBeInTheDocument();

  // Test if buttons are rendered
  expect(getByText('Close')).toBeInTheDocument();
  expect(getByText('Save Changes')).toBeInTheDocument();
});

test('Close button calls handleClose function', () => {
  // Mock functions to simulate event handlers
  const handleClose = jest.fn();
  const handleAddClass = jest.fn();

  // Rendering the AddClass component with mock props
  const { getByText } = render(
    <AddClass show={true} handleClose={handleClose} handleAddClass={handleAddClass} />
  );

  // Simulate a click event on the 'Close' button
  fireEvent.click(getByText('Close'));

  // Expect the handleClose function to have been called
  expect(handleClose).toHaveBeenCalled();
});
