import React from 'react';
import {
  BrowserRouter, // Use BrowserRouter directly
  Routes, // Import Routes instead of Switch
  Route,
  useLocation,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Homepage from './components/Homepage';
import ClassesPage from './components/ClassesPage';

function App() {
  const ConditionalNavbar = () => {
    const location = useLocation();

    // Do not display the Navbar on the login page
    if (location.pathname === '/' || location.pathname === '/registerForm') {
      return null;
    }
    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Gym-App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/homepage">Home</Nav.Link>
              <Nav.Link href="#displayAll">Display All</Nav.Link>
              <Nav.Link href="#register">Register</Nav.Link>
              <Nav.Link href="/classes">Classes</Nav.Link>
              <Nav.Link href="#dashboard">Dashboard</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };

  return (
    <BrowserRouter>
      <ConditionalNavbar />
      <div>
        <Routes>
        <Route path="/registerForm" element={<RegisterForm />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/classes" element={<ClassesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
