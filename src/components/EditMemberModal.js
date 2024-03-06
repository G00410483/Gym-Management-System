import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditMemberModal({ show, handleClose, member, saveMember, removeMember }) {
  const [editedMember, setEditedMember] = useState({ ...member });

  const handleChange = (e) => {
    setEditedMember({ ...editedMember, [e.target.name]: e.target.value });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={() => removeMember(editedMember.id)}>
          Remove
        </Button>
        <Button variant="primary" onClick={() => saveMember(editedMember)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditMemberModal;
