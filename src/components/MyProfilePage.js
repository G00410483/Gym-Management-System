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
    const [member, setMember] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchMemberDetails();
    }, []);

    const fetchMemberDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.get('http://localhost:3001/displayMember', config);
            setMember(response.data.memberDetails);
            setBookings(response.data.bookings);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.put(`http://localhost:3001/members/${member.id}`, member, config);
            setEditMode(false);
            fetchMemberDetails(); // Refresh member details
        } catch (err) {
            console.error('Failed to update member details', err);
        }
    };

    const deleteBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/deleteBooking/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove the booking from the local state to update UI
            setBookings(bookings.filter(booking => booking.id !== bookingId));
        } catch (err) {
            console.error('Failed to delete booking', err);
        }
    };

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
                                        <MDBInput placeholder="First Name" type="text" name="first_name" value={member.first_name} onChange={handleInputChange} className="mb-4" />
                                        <MDBInput placeholder="Second Name" type="text" name="second_name" value={member.second_name} onChange={handleInputChange} className="mb-4" />
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

                                        <Form.Group className="mb-3" controlId="formMembershipSelect">
                                            <Form.Label>Type of Membership</Form.Label>
                                            <Form.Select name="type_of_membership" value={member.type_of_membership} onChange={handleInputChange} className="form-control">
                                                <option value="">Select type of membership</option>
                                                <option value="basic">basic</option>
                                                <option value="premium">premium</option>
                                                <option value="VIP">VIP</option>
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

                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
};

export default MemberDetails;
