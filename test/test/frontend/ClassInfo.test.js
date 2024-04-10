// Import necessary dependencies and functions for testing
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ClassInfo from '../../../src/components/classes/ClassInfo'; 

describe('ClassInfo component', () => {
  const selectedClass = {
    class_name: 'Test Class',
    instructor_name: 'Test Instructor',
    time: '10:00',
    day: 'Monday',
    max_capacity: 20
  };

  it('calls onHide when Close button is clicked', () => {
    // Mock onHide function
    const onHideMock = jest.fn();
    // Render the ClassInfo component with onHideMock prop
    const { getByText } = render(<ClassInfo selectedClass={selectedClass} onHide={onHideMock} />);

    // Simulate click on Close button
    fireEvent.click(getByText('Close'));

    // Assert that onHideMock is called
    expect(onHideMock).toHaveBeenCalled();
  });
});
