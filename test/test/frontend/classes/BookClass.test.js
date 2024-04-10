// BookClass.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BookClass from '../../../../src/components/classes/BookClass';

describe('BookClass component', () => {
  it('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <BookClass 
        show={true}
        onHide={() => {}}
        bookingClass={{ class_name: 'Yoga' }}
        handleBookingClass={() => {}}
        selectedDate={new Date('2025-04-09')}
        setSelectedDate={() => {}}
        getDayOfWeekNumber={() => {}}
      />
    );

    expect(getByText('Booking class: Yoga')).toBeInTheDocument();
    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(getByLabelText('Select Date')).toBeInTheDocument();
  });

  it('triggers handleBookingClass function on submit', () => {
    // Mock handleBookingClass function
    const mockHandleBookingClass = jest.fn();
    
    // Render the component
    const { getByText, getByLabelText } = render(
      <BookClass 
        show={true}
        onHide={() => {}}
        bookingClass={{ class_name: 'Yoga' }}
        handleBookingClass={mockHandleBookingClass}
        selectedDate={new Date('2024-04-09')}
        setSelectedDate={() => {}}
        getDayOfWeekNumber={() => {}}
      />
    );

    // Mock the submit method of the form element
    const form = getByLabelText('Select Date').closest('form');
    form.submit = mockHandleBookingClass;

    // Trigger form submission
    fireEvent.click(getByText('Book Now'));

    // Expect handleBookingClass to be called
    expect(mockHandleBookingClass).toHaveBeenCalledTimes(1);
  });

  it('closes modal when Close button is clicked', () => {
    // Mock onHide function
    const mockOnHide = jest.fn();

    // Render the component
    const { getByText } = render(
      <BookClass 
        show={true}
        onHide={mockOnHide}
        bookingClass={{ class_name: 'Yoga' }}
        handleBookingClass={() => {}}
        selectedDate={new Date('2024-04-09')}
        setSelectedDate={() => {}}
        getDayOfWeekNumber={() => {}}
      />
    );

    // Trigger click on Close button
    fireEvent.click(getByText('Close'));

    // Expect onHide to be called
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });
});
