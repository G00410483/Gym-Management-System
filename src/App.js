import React from 'react';
import {
  BrowserRouter, // Use BrowserRouter directly
  Routes, // Import Routes instead of Switch
  Route,
} from 'react-router-dom';
import LoginForm from './LoginForm';
import Homepage from './Homepage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter> {/* Use BrowserRouter here */}
      <div>
        <Routes> {/* Replace Switch with Routes */}
          <Route path="/homepage" element={<Homepage />} /> {/* Update Route structure */}
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
