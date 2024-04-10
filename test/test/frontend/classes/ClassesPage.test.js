import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For expect(...).toBeInTheDocument()
import ClassesPage from '../../../../src/components/classes/ClassesPage'; 

// Mock useAuth hook
jest.mock('../../../../src/AuthContext', () => ({
  useAuth: jest.fn(() => ({ isLoggedIn: true, isRole: () => true })),
}));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { id: 1, class_name: 'Class 1', day: 'Monday', time: '10:00' },
        { id: 2, class_name: 'Class 2', day: 'Tuesday', time: '11:00' },
      ]),
  })
);

describe('ClassesPage', () => {
  beforeEach(() => {
    fetch.mockClear(); // Clear mock calls before each test
  });

  it('renders without crashing', () => {
    render(<ClassesPage />);
  });

  it('displays "Add Class" button for admin users when logged in', () => {
    // Arrange
    const { getByText } = render(<ClassesPage />);
    
    // Act
    const addButton = getByText('Add Class');
    
    // Assert
    expect(addButton).toBeInTheDocument();
  });

  // Additional tests for class selection, adding a new class, editing a class, deleting a class, and booking a class can be added here
});
