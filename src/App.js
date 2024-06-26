// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './AuthContext'; 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { MDBIcon } from 'mdb-react-ui-kit';


import LoginForm from './components/login/LoginForm';
import RegisterForm from './components/Register';
import Homepage from './components/homepage/Homepage';
import ClassesPage from './components/classes/ClassesPage';
import RegisterMember from './components/register/RegisterMemeber';
import MembersPage from './components/members/MembersPage';
import BookingsDisplay from './components/bookings/BookingsDisplay';
import Dashboard from './components/dahsboard/Dashboard';
import MyProfilePage from './components/profile/MyProfilePage';
import PaymentPage from './components/payment/PaymentPage';


// Conditional component to show/hide navbar
function ConditionalNavbar() {
  // Using Auth context to manage authentication
  const { isLoggedIn, logout, isRole } = useAuth();
  // Get current location to check path name
  const location = useLocation();

  // Hiding navbar on specific pages
  if (location.pathname === '/login' || location.pathname === '/registerForm' || location.pathname === '/payment') {
    return null;
  }

  // Structure of navbar
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="left">
      <Container>
        <Navbar.Brand href="/">
        <i class="fas fa-dumbbell fa-x"></i>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/"><MDBIcon fas icon="home" className="me-2" />Home</Nav.Link>
            {isLoggedIn && isRole('member') && <Nav.Link href="/myProfile"><MDBIcon fas icon="th-list" className="me-2" />My Profile</Nav.Link>}
            {isLoggedIn && isRole('admin') && <Nav.Link href="/memberPage"><MDBIcon fas icon="list" className="me-2" />Display</Nav.Link>}
            {!isLoggedIn && <Nav.Link href="/registerMember"><MDBIcon fas icon="user-plus" className="me-2" />Register</Nav.Link>}
            <Nav.Link href="/classes"><MDBIcon fas icon="chalkboard-teacher" className="me-2" />Classes</Nav.Link>
            {isLoggedIn  && isRole('admin') && <Nav.Link href="/bookingsDisplay"><MDBIcon fas icon="book" className="me-2" />Bookings</Nav.Link>}
            {isLoggedIn && isRole('admin') && <Nav.Link href="/dashboard"><MDBIcon fas icon="chart-line" className="me-2" />Dashboard</Nav.Link>}
      
          </Nav>
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link href="/" onClick={() => logout()}>
                  <MDBIcon fas icon="sign-out-alt" className="me-2" />Logout
                </Nav.Link>
                {/* Conditionally display 'A' for Admin and 'M' for Member */}
                <Nav.Item style={{ color: 'white', marginTop: '8px' }}>
                  {isRole('admin') ? 'A' : 'M'}
                </Nav.Item>
              </>
            ) : (
              <Nav.Link href="/login">
                <MDBIcon fas icon="sign-in-alt" className="me-2" />Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <AuthProvider>
      <div style={{ fontFamily: "Roboto, sans-serif" }}>
        <BrowserRouter>
          <ConditionalNavbar />
          <Routes>
            {/* Define routes for different pages */}
            <Route path="/registerForm" element={<RegisterForm />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/memberPage" element={<MembersPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/registerMember" element={<RegisterMember />} />
            <Route path="/bookingsDisplay" element={<BookingsDisplay />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/myProfile" element={<MyProfilePage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
