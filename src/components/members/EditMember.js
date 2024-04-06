import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditMemberModal({ show, handleClose, member, saveMember, removeMember }) {
  // State to manage edited member data
  const [editedMember, setEditedMember] = useState({ ...member });

  // Function to hnadle input chnages
  const handleChange = (e) => {
    setEditedMember({ ...editedMember, [e.target.name]: e.target.value });
  };

  // Function to confirm and remove member
  const confirmAndRemoveMember = (id) => {
    // Confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to remove this member?');
    if (isConfirmed) {
      removeMember(id);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            {/* PPS */}
          <Form.Group controlId="formPPS">
            <Form.Label>PPS</Form.Label>
            <Form.Control
              value={editedMember.pps_number}
              readOnly
            />
          </Form.Group>
          {/* First Name */}
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="first_name"
              value={editedMember.first_name}
              onChange={handleChange}
            />
          </Form.Group>
           {/* Second Name */}
          <Form.Group controlId="formSecondName">
            <Form.Label>Second Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter second name"
              name="second_name"
              value={editedMember.second_name}
              onChange={handleChange}
            />
          </Form.Group>
           {/* Email Address */}
          <Form.Group controlId="formEmailAddress">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email_address"
              value={editedMember.email_address}
              onChange={handleChange}
            />
          </Form.Group>
           {/* Gender */}
          <Form.Group controlId="fornGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              value={editedMember.gender}
            />
          </Form.Group>
           {/* Date of Birth */}
          <Form.Group controlId="formDOB">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              placeholder="Enter date of birth"
              name="date_of_birth"
              value={editedMember.date_of_birth ? new Date(editedMember.date_of_birth).toISOString().split('T')[0] : ''}
              readOnly
            />
          </Form.Group>
          {/* Start Date */}
          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              placeholder="Enter start date"
              name="start_date"
              value={editedMember.start_date ? new Date(editedMember.start_date).toISOString().split('T')[0] : ''}
              readOnly
            />
          </Form.Group>
           {/* Lastg Payment Date */}
           <Form.Group controlId="formPaymentDat4e">
            <Form.Label>Last Payment Date</Form.Label>
            <Form.Control
              placeholder="Enter start date"
              name="last_payment_date"
              value={editedMember.last_payment_date ? new Date(editedMember.start_date).toISOString().split('T')[0] : ''}
              readOnly
            />
          </Form.Group>

           {/* Membership Type */}
          <Form.Group className="mb-3" controlId="formBasicGender">
            <Form.Label  >Type of Membership</Form.Label>
            <Form.Select aria-label="Membership select" className="form-control" value={editedMember.type_of_memebrship}
              onChange={handleChange}>
              <option value="basic">basic</option>
              <option value="premium">premium</option>
              <option value="VIP">VIP</option>
            </Form.Select>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
         {/* Button to remove member */}
        <Button variant="danger" onClick={() => confirmAndRemoveMember(editedMember.id)}>
          Remove
        </Button>
         {/* Button to save changes */}
        <Button variant="primary" onClick={() => saveMember(editedMember)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditMemberModal;
