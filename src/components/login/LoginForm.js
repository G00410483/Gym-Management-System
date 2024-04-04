
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../AuthContext';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import './LoginForm.css';


function LoginForm() {
    // State hooks for managing the email and password input fields.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Hook for navigating between routes
    const navigate = useNavigate();
    // Hook that provides access to the authentication context 
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Attempts sending a POST request to the server with the email and password.
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // If login is successful, parse the JSON response and use the login function from AuthContext.
                const data = await response.json();
                login(data.token, data.role);
                alert('Welcome back !');
                // Redirect based on the server's response
                navigate('/' + data.redirect, { state: { email: data.email, price: data.price } });
            } else {
                throw new Error('Unauthorized');
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <MDBContainer fluid>
                    <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                        <MDBCol col='12'>
                            <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                                {/* Top section of login  */}
                                <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                    <p className="text-white-50 mb-5">Please enter your login and password!</p>
                                    {/* Email section */}
                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formControlLg' type='email' size="lg"
                                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    {/* Password section */}
                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formControlLg' type='password' size="lg"
                                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    {/* Login button section */}
                                    <MDBBtn className='mx-2' color='light' size='lg' type="submit">
                                        Login
                                    </MDBBtn>
                                    <br></br>
                                    {/* Back to homepage button section */}
                                    <MDBBtn className='mx-2' color='light' size='m' type="back" href='/'>
                                        Back to Hompage
                                    </MDBBtn>
                                    <br></br>
                                    {/* Singup section */}
                                    <div>
                                        <p className="mb-0">Don't have an account? <a href="/registerForm" className="text-white-50 fw-bold">Sign Up</a></p>
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </form>
        </div>
    );
}

export default LoginForm;
