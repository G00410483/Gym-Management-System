// Import necessary modules for testing
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
import BookingsDisplay from '../../../../src/components/bookings/BookingsDisplay';

// Mock axios module
jest.mock('axios');

// Test suite for the BookingsDisplay component
describe('BookingsDisplay Component', () => {
  // Mock bookings data
  const bookingsData = [
    {
      id: 1,
      email_address: 'test1@example.com',
      class_name: 'Yoga',
      date: '2024-04-14T12:00:00.000Z'
    },
    {
      id: 2,
      email_address: 'test2@example.com',
      class_name: 'Pilates',
      date: '2024-04-15T12:00:00.000Z'
    }
  ];

  // Set up axios mock to return mock bookings data before each test
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: bookingsData });
  });

  // Test to ensure the component renders correctly
  test('renders the component', async () => {
    render(<BookingsDisplay />);
    // Expect "Sort Bookings" and "Search" elements to be present in the rendered component
    expect(screen.getByText('Sort Bookings')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  // Test to ensure bookings data is displayed correctly
  test('displays bookings data', async () => {
    render(<BookingsDisplay />);
    // Wait for the component to render and then expect each booking's details to be present
    await waitFor(() => {
      expect(screen.getByText('test1@example.com')).toBeInTheDocument();
      expect(screen.getByText('Yoga')).toBeInTheDocument();
      expect(screen.getByText('2024-04-14')).toBeInTheDocument();
      expect(screen.getByText('test2@example.com')).toBeInTheDocument();
      expect(screen.getByText('Pilates')).toBeInTheDocument();
      expect(screen.getByText('2024-04-15')).toBeInTheDocument();
    });
  });

  // Test to ensure bookings data is filtered based on search term
  test('filters bookings data based on search term', async () => {
    render(<BookingsDisplay />);
    // Simulate change in search input value and then expect filtered results
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'test1' } });
    await waitFor(() => {
      expect(screen.getByText('test1@example.com')).toBeInTheDocument();
      expect(screen.queryByText('test2@example.com')).toBeNull(); // Expect second booking not to be present
    });
  });

  // Test to ensure bookings data is sorted based on selected criteria
  test('sorts bookings data based on selected criteria', async () => {
    render(<BookingsDisplay />);
    // Simulate click on sorting dropdown and select "Class Name" option
    fireEvent.click(screen.getByText('Sort Bookings'));
    fireEvent.click(screen.getByText('Class Name'));
    // Expect axios to have been called with the appropriate sort criteria
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/bookingsDisplay?sort=class_name ASC');
    });
  });
});
