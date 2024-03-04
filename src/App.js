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
import {
  MDBIcon
} from 'mdb-react-ui-kit';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Homepage from './components/Homepage';
import ClassesPage from './components/ClassesPage';

function App() {
  const appStyle = {
    fontFamily: "Roboto, sans-serif",
  };
  const ConditionalNavbar = () => {
    const location = useLocation();

    // Do not display the Navbar on the login page
    if (location.pathname === '/' || location.pathname === '/registerForm') {
      return null;
    }
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/homepage" className="me-3">Gym-App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/homepage" className="me-3">
                <MDBIcon fas icon="home" className="me-2" />Home
              </Nav.Link>
              <Nav.Link href="#displayAll" className="me-3">
                <MDBIcon fas icon="th-list" className="me-2" />Display
              </Nav.Link>
              <Nav.Link href="#register" className="me-3">
                <MDBIcon fas icon="user-plus" className="me-2" />Register
              </Nav.Link>
              <Nav.Link href="/classes" className="me-3">
                <MDBIcon fas icon="chalkboard-teacher" className="me-2" />Classes
              </Nav.Link>
              <Nav.Link href="#dashboard" className="me-3">
                <MDBIcon fas icon="chart-line" className="me-2" />Dashboard
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    );
  };

  return (
    <div style={appStyle}>
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
    </div>

  );
}

export default App;
