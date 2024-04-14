import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MembersPage from '../../../../src/components/members/MembersPage';
import axios from 'axios';

// Mock the AuthContext module
jest.mock('../../../../src/AuthContext', () => ({
  useAuth: jest.fn().mockReturnValue({
    isLoggedIn: true, // Mocking isLoggedIn as true
    isRole: jest.fn(), // Mocking isRole as a jest mock function
  }),
}));

describe('MembersPage', () => {
  beforeEach(() => {
    // Mock the members data returned by the server
    axios.get.mockResolvedValue({ data: [] });
  });

  test('renders members list', async () => {
    const { getByText } = render(<MembersPage />);
  });

  test('filters members based on search term', async () => {
    const { getByPlaceholderText, getByText } = render(<MembersPage />);

  });

});
