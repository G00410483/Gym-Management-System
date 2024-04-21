
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../AuthContext';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import './LoginForm.css';
import axios from 'axios';

function LoginForm() {
    // State hooks for managing the email and password input fields.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Hook for navigating between routes
    const navigate = useNavigate();
    // Hook that provides access to the authentication context 
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [errorMessage, setErrorMessage] = useState(''); // State to store error message

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Attempts sending a POST request to the server with the email and password.
            const response = await axios.post('https://gms-deployment-heroku-129176233d83.herokuapp.com/login', {
                email,
                password
            });
    
            if (response.status === 200) {
                // If login is successful, use the login function from AuthContext.
                const data = response.data;
                login(data.token, data.role);
                alert('Welcome back !');
                // Redirect based on the server's response
                navigate('/' + data.redirect, { state: { email: data.email, price: data.price } });
            } else {
                throw new Error('Unauthorized');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Incorrect email or password');
            } else {
                setErrorMessage('Login failed: ' + error.message);
            }
        }
    };

    return (
        <div>
            {/* Reference: https://mdbootstrap.com/docs/standard/extended/login/ */}
            <form onSubmit={handleSubmit}>
                <MDBContainer fluid>
                    <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                        <MDBCol col='12'>
                            <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                                {/* Top section of login  */}
                                <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                                    <h1 className="fw-bold mb-2 text-white">Login</h1>
                                    <p className="text-white-50 mb-5">Please enter your login and password!</p>
                                    {errorMessage && <p className="text-danger mb-3">{errorMessage}</p>}
                                    {/* Email section */}
                                    <MDBInput
                                        wrapperClass='mb-4 mx-5 w-100'
                                        labelClass='text-white'
                                        label='Email address'
                                        id='formControlmail'
                                        type='email'
                                        size="lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <MDBInput
                                        wrapperClass='mb-4 mx-5 w-100'
                                        labelClass='text-white'
                                        label='Password'
                                        id='formControlpass'
                                        type={showPassword ? 'text' : 'password'} // Ternary operator to toggle password visibility
                                        size="lg"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                     {/* Checkbox to toggle password visibility */}
                                     <div className="form-check text-white mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="showPassword"
                                            onChange={() => setShowPassword(!showPassword)}
                                        />
                                        <label className="form-check-label" htmlFor="showPassword">
                                            Show Password
                                        </label>
                                    </div>
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
                                        {/* <p className="mb-0">Don't have an account? <a href="/registerForm" className="text-white-50 fw-bold">Sign Up</a></p> */}
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
