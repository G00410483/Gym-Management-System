import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import RegisterMembers from '../../../../src/components/register/RegisterMemeber';

describe('RegisterMembers Component', () => {
  it('submits the form with valid data', async () => {
    render(<Router><RegisterMembers /></Router>); 
    
    // Mock Axios post request
    jest.mock('axios', () => ({
      post: jest.fn(() => Promise.resolve({ status: 200, data: { message: 'Registration successful', redirect: 'payment', email: 'test@example.com', price: 10 } })),
    }));
    
  });
});
