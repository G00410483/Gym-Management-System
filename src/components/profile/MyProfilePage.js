import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './MyProfilePage.css';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBInput,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBProgress,
    MDBProgressBar,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
} from 'mdb-react-ui-kit';
const MemberDetails = () => {
    // Define state veriables to manage member data
    const [member, setMember] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [notifs, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle notification visability
    const toggleNotifications = () => {
        setIsOpen(!isOpen); // Toggle the state
    };

    // Fetch member details using useEffect hook
    useEffect(() => {
        fetchMemberDetails();
    }, []);

    // Fetch member details from API
    const fetchMemberDetails = async () => {
        try {
            // Retrive token from local storage 
            // Reference: https://stackoverflow.com/questions/73283693/how-to-pass-token-to-local-storage-with-axios
            const token = localStorage.getItem('token');
            // Configuration for axios request 
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Make GET request to API 
            const response = await axios.get('https://gms-deployment-heroku-129176233d83.herokuapp.com/displayMember', config);
            // Update fetched data 
            setMember(response.data.memberDetails);
            setBookings(response.data.bookings);
            setNotifications(response.data.notifs);
        } catch (err) {
            console.error(err);
        }
    };

    // Function to handle form submit
    const handleFormSubmit = async (e) => {
        // Prevent default
        e.preventDefault();
        try {
            // Retrive token from local storage 
            const token = localStorage.getItem('token');
            // Configuration for Axios request 
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            // Make PUT request to update member details
            await axios.put(`https://gms-deployment-heroku-129176233d83.herokuapp.com/members/${member.id}`, member, config);
            setEditMode(false); // Disable edit mode
            fetchMemberDetails(); // Refresh member details
        } catch (err) {
            console.error('Failed to update member details', err);
        }
    };

    // Function to delete specific booking
    const deleteBooking = async (bookingId) => {
        try {
            // Retrieve token from localStorage
            const token = localStorage.getItem('token');
            // Make DELETE request to API to delete booking
            await axios.delete(`https://gms-deployment-heroku-129176233d83.herokuapp.com/deleteBooking/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update bookings state by filtering out the deleted booking
            setBookings(bookings.filter(booking => booking.id !== bookingId));
        } catch (err) {
            console.error('Failed to delete booking', err);
        }
    };

    // Function to delete a specific notification
    const deleteNotification = async (notificationId) => {
        try {
            // Retrive token 
            const token = localStorage.getItem('token');
            // Make DELETE request to API to delete notification
            await axios.delete(`https://gms-deployment-heroku-129176233d83.herokuapp.com/deleteNotification/${notificationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update notifications state by filtering out the deleted notification
            setNotifications(notifs.filter(notif => notif.id !== notificationId));
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    };

    // Function to calculate age based on date of birth
    // Reference: https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
    function calculateAge(dob) {
        const birthday = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();
        const m = today.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
            age--;
        }
        return age;
    }

    const handleInputChange = (e) => {
        setMember({ ...member, [e.target.name]: e.target.value });
    };

    return (
        <section style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src="https://static.thenounproject.com/png/363639-200.png"
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '150px' }}
                                    fluid />
                                <h6>{member.first_name} {member.second_name}, {member.date_of_birth ? calculateAge(member.date_of_birth) : ''}</h6>

                                <MDBBtn onClick={() => setEditMode(!editMode)}>Edit Profile</MDBBtn>

                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        {editMode ? (
                            <MDBCard className="mb-4">
                                <MDBCardBody>
                                    <Form onSubmit={handleFormSubmit}>
                                    <Form.Label>First Name</Form.Label>
                                        <MDBInput placeholder="First Name" type="text" name="first_name" value={member.first_name} onChange={handleInputChange} className="mb-4" />
                                        <Form.Label>Second Name</Form.Label>
                                        <MDBInput placeholder="Second Name" type="text" name="second_name" value={member.second_name} onChange={handleInputChange} className="mb-4" />
                                        <Form.Label>Email Address</Form.Label>
                                        <MDBInput placeholder="Email Address" type="email" name="email_address" value={member.email_address} onChange={handleInputChange} className="mb-4" />
                                        <Form.Group className="mb-3" controlId="formGenderSelect">
                                            <Form.Label>Gender</Form.Label>
                                            <Form.Select name="gender" value={member.gender} onChange={handleInputChange} className="form-control">
                                                <option value="">Select gender</option>
                                                <option value="male">male</option>
                                                <option value="female">female</option>
                                                <option value="prefer not to say">prefer not to say</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <MDBBtn type="submit">Save Changes</MDBBtn>
                                    </Form>
                                </MDBCardBody>
                            </MDBCard>
                        ) : (
                            <MDBCard className="mb-4">
                                <MDBCardBody>
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>First Name</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">{member.first_name}</MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Second Name</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">{member.second_name}</MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Email</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">{member.email_address}</MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>PPS Number</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">{member.pps_number}</MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Date of Birth</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">
                                                {
                                                    member.date_of_birth ?
                                                        (new Date(member.date_of_birth).toISOString().split('T')[0]) :
                                                        'Date of Birth not available'
                                                }
                                            </MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Start Date</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">
                                                {
                                                    member.start_date ?
                                                    /* Reference:https://stackoverflow.com/questions/47066555/remove-time-after-converting-date-toisostring */
                                                        (new Date(member.start_date).toISOString().split('T')[0]) :
                                                        'Date of Birth not available'
                                                }
                                            </MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Gender</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">{member.gender}</MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Type of Membership</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">{member.type_of_membership}</MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Last Payment Date</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">{
                                                    member.last_payment_date ?
                                                        (new Date(member.last_payment_date).toISOString().split('T')[0]) :
                                                        'Date of Payment not available'
                                                }</MDBCardText>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCardBody>
                            </MDBCard>
                        )}
                        <MDBRow>
                            <MDBCol md="6">
                                <MDBCard className="mb-4">
                                    <MDBCardBody>
                                        <MDBCardText className="mb-4">
                                            <span className="text-primary font-italic me-1">Bookings</span>
                                        </MDBCardText>
                                        {bookings.length > 0 ? (
                                            <MDBListGroup>
                                                {bookings.map((booking, index) => (
                                                    <MDBListGroupItem key={index}>
                                                        Class: {booking.class_name}, Date: {new Date(booking.date).toISOString().split('T')[0]}
                                                        <hr />
                                                        <MDBBtn className="ms-2" color="danger" size="sm" onClick={() => deleteBooking(booking.id)}>Cancel</MDBBtn>
                                                    </MDBListGroupItem>
                                                ))}
                                            </MDBListGroup>
                                        ) : (
                                            <MDBCardText>No bookings found</MDBCardText>
                                        )}
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                            <MDBCol md="6">
                                <MDBCard className="mb-4">
                                    <MDBCardBody id='notifSection'>
                                        {/* Toggle Button */}
                                        <span className="text-black" onClick={toggleNotifications} style={{ cursor: 'pointer' }}>Notifications</span>
                                        <span className="text-white" id='notifNum'>{notifs.length}</span>


                                        {/* Conditionally render the notifications list based on isOpen state */}
                                        {isOpen && (
                                            bookings.length > 0 ? (
                                                <MDBListGroup style={{ margin: '15px' }}>
                                                    {notifs.map((notif, index) => (
                                                        <MDBListGroupItem id='message' key={index}>
                                                            Dear Member
                                                            <hr />
                                                            Type: {notif.type}
                                                            <hr />
                                                            Your booking for {notif.class_name}.
                                                            <hr />
                                                            <MDBBtn className="ms-2" color="danger" size="sm" onClick={() => deleteNotification(notif.id)}>Delete</MDBBtn>
                                                        </MDBListGroupItem>
                                                    ))}
                                                    <br />
                                                </MDBListGroup>
                                            ) : (
                                                <MDBCardText>No notifications found</MDBCardText>
                                            )
                                        )}
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>

                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
};

export default MemberDetails;
