import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import axios from 'axios';
import EditMemberModal from './EditMemberModal';
import './MembersPage.css';

function MembersPage() {
  // State hooks to manage members data, the selected member, and modal visibility
  const [members, setMembers] = useState([]); // State for storing members list
  const [selectedMember, setSelectedMember] = useState(null); // State for storing the selected member for editing
  const [showModal, setShowModal] = useState(false); // State for controlling the visibility of the modal
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect hook to fetch members data from the server when the component mounts
  useEffect(() => {
    const fetchMembers = async () => { // Define an asynchronous function to fetch members data
      try {
        const response = await axios.get('http://localhost:3001/members'); // Use Axios to make a GET request to fetch members
        setMembers(response.data); // Update the members state with the fetched data
      } catch (error) {
        console.error('There was an error fetching the members:', error); // Log any errors to the console
      }
    };

    // Call fetchMembers function
    fetchMembers();
  }, []); // Empty dependency array- this effect runs only once after the initial render

  // Function to handle row click event, which sets the selected member and shows the modal
  const handleRowClick = (member) => {
    // Set the selected member
    setSelectedMember(member);
    // Show modal
    setShowModal(true);
  };

  // Function to close the modal and clear selected member
  const handleCloseModal = () => {
    // Hide the modal
    setShowModal(false);
    // Set selected member to null
    setSelectedMember(null);
  };

  // Function to save edited member
  const saveMember = async (member) => {
    try {
      // Use Axios to make a PUT request to update the membe
      await axios.put(`http://localhost:3001/members/${member.id}`, member);
      // Update the members state with the edited member
      setMembers(members.map(m => m.id === member.id ? member : m));
      // Close modal after saving
      handleCloseModal();
    } catch (error) {
      console.error('There was an error saving the member:', error);
    }
  };

  // Function to remove member
  const removeMember = async (memberId) => {
    try {
      // Use Axios to make a DELETE request to remove the member
      await axios.delete(`http://localhost:3001/members/${memberId}`);
      // Update the members state to exclude the removed member
      setMembers(members.filter(m => m.id !== memberId));
      // Close modal after removing
      handleCloseModal();
    } catch (error) {
      console.error('There was an error removing the member:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Rendering filtered members based on search term
  const filteredMembers = members.filter(member =>
    member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || // Check if first name includes search term
    member.second_name.toLowerCase().includes(searchTerm.toLowerCase()) // Check if second name includes search term
  );

  return (
    <div className="container mt-5">
      <h1>Members List</h1>
      {/* Search input field */}
      <Form>
        <Form.Group
          className="mb-3 d-flex justify-content-center align-items-center"
          controlId="exampleForm.ControlInput1">
          <Form.Control
            placeholder="Search"
            style={{ width: '200px' }}
            value={searchTerm} // Set the value prop to the searchTerm state
            onChange={handleSearchChange} // Set the onChange event handler to handleSearchChange directly
          />
        </Form.Group>

      </Form>
      {/* Bootstrap Table used for styling */}
      <Table striped bordered hover>
        <thead>
          <tr>
            {/* Table headers */}
            <th>#</th>
            <th>PPS Number</th>
            <th>First Name</th>
            <th>Second Name</th>
            <th>Email Address</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Start Date</th>
            <th>Type of Membership</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over filteredMembers array to render each member as a row in the table */}
          {filteredMembers.map((member, index) => (
            <tr key={member.id} onClick={() => handleRowClick(member)}>{/* Assign a key and set click handler */}
              <td>{index + 1}</td>
              {/* Render member details in each cell */}
              <td>{member.pps_number}</td>
              <td>{member.first_name}</td>
              <td>{member.second_name}</td>
              <td>{member.email_address}</td>
              <td>{member.gender}</td>
              <td>{member.date_of_birth}</td>
              <td>{member.start_date}</td>
              <td>{member.type_of_membership}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Check if 'selectedMember' is not null or undefined. This condition determines if the EditMemberModal should be rendered. */}
      {selectedMember && (
        // Render the EditMemberModal component with props passed to it. This modal is used for editing a member's details.
        <EditMemberModal
          show={showModal} // Determines if the modal is visible.
          handleClose={handleCloseModal} // Function to call when closing the modal.
          member={selectedMember} // The member data to edit.
          saveMember={saveMember} // Function to save the edited member data.
          removeMember={removeMember} // Function to remove the member.
        />
      )}

    </div>
  );
}

export default MembersPage;
