// Import necessary utilities from testing library
import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClassesPage from '../../../src/components/classes/ClassesPage';
import { AuthContext } from '../../../src/AuthContext'; // Update the import path as necessary

// Mock the global fetch
global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

beforeEach(() => {
  fetch.mockClear();
  localStorage.clear();
});

afterEach(cleanup);

const mockFetchClasses = () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: 'Yoga', instructor: 'John Doe', time: '09:00 AM' }]), // Example class data
    })
  );
};

describe('ClassesPage Component Tests', () => {
  test('Renders Add Class button for admin users', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'admin';
      return null;
    });
    mockFetchClasses();

    const { getByText } = render(
      <AuthProvider>
        <ClassesPage />
      </AuthProvider>
    );

    expect(getByText('Add Class')).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  test('Fetches and displays classes on component mount', async () => {
    mockFetchClasses();

    const { findByText } = render(
      <AuthProvider>
        <ClassesPage />
      </AuthProvider>
    );

    expect(await findByText('Yoga')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  // Simulate adding a class
  test('Opens Add Class modal and submits new class', async () => {
    mockFetchClasses(); // Initial fetch for classes

    fetch.mockImplementationOnce(() => // Mock adding class
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 2, name: 'Pilates', instructor: 'Jane Doe', time: '10:00 AM' }),
      })
    );

    const { getByText, getByLabelText, getByRole } = render(
      <AuthProvider>
        <ClassesPage />
      </AuthProvider>
    );

    fireEvent.click(getByText('Add Class')); // Adapt based on your actual button text or role

    // Assuming you have labels associated with your inputs
    fireEvent.change(getByLabelText('Class Name'), { target: { value: 'Pilates' } });
    fireEvent.change(getByLabelText('Instructor Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(getByLabelText('Time'), { target: { value: '10:00 AM' } });

    fireEvent.click(getByRole('button', { name: /save changes/i })); // Adapt based on your actual button text or role

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      // You might want to check for a success message or that the class list has been updated
    });
  });

  // Additional test for editing a class could follow a similar pattern to the add class test
});