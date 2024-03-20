import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import axios from 'axios';
import EditMember from './EditMember';
import './MembersPage.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';



function MembersPage() {
  // State hooks to manage members data, the selected member, and modal visibility
  const [members, setMembers] = useState([]); // State for storing members list
  const [selectedMember, setSelectedMember] = useState(null); // State for storing the selected member for editing
  const [showModal, setShowModal] = useState(false); // State for controlling the visibility of the modal
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('');


  // Define the fetchMembers function
  const fetchMembers = async (sortCriteria = '') => {
    try {
      // Update the URL with sort parameter
      const response = await axios.get(`http://localhost:3001/members?sort=${sortCriteria}`);
      setMembers(response.data);
    } catch (error) {
      console.error('There was an error fetching the members:', error);
    }
  };

  // useEffect hook to fetch members data from the server when the component mounts or sort state changes
  useEffect(() => {
    fetchMembers(sort); // Fetch members with current sort criteria
  }, [sort]); // Include sort in the dependency array to refetch when it changes

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

  const handleSortChange = (sortCriteria) => {
    setSort(sortCriteria);
    fetchMembers(sortCriteria); // Pass the sort criteria to your fetch function
  };

  // Rendering filtered members based on search term
  const filteredMembers = members.filter(member =>
    member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || // Check if first name includes search term
    member.second_name.toLowerCase().includes(searchTerm.toLowerCase()) || // Check if second name includes search term
    member.email_address.toLowerCase().includes(searchTerm.toLowerCase()) // Check if email address inculed search term
  );

  return (
    <div className="container mt-5">
      <h1>Members List</h1>
      {/* Search input field */}
      <Form>
        <DropdownButton
          id="dropdown-button"
          title="Sort Members"
          variant="primary"
          className="mb-3"
        >
          <Dropdown.Item onClick={() => handleSortChange('date_of_birth ASC')}>
           Date of Birth (Ascending)
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('date_of_birth DESC')}>
            Date of Birth (Descending)
          </Dropdown.Item>

          <Dropdown.Item onClick={() => handleSortChange('start_date ASC')}>
           Start Date (Ascending)
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('start_date DESC')}>
            Start Date (Descending)
          </Dropdown.Item>

          <Dropdown.Item onClick={() => handleSortChange('gender ASC')}>
           Gender
          </Dropdown.Item>

          <Dropdown.Item onClick={() => handleSortChange('type_of_membership ASC')}>
           Type of Membership 
          </Dropdown.Item>
        </DropdownButton>
        <Form.Group className="mb-3" controlId="searchInput">
          <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
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
            <tr key={member.id} onClick={() => handleRowClick(member)}>
              <td>{index + 1}</td>
              {/* Render member details in each cell */}
              <td>{member.pps_number}</td>
              <td>{member.first_name}</td>
              <td>{member.second_name}</td>
              <td>{member.email_address}</td>
              <td>{member.gender}</td>
              <td>{new Date(member.date_of_birth).toISOString().split('T')[0]}</td> {/* Remove time */}
              <td>{new Date(member.start_date).toISOString().split('T')[0]}</td> {/* Remove time */}
              <td>{member.type_of_membership}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Check if 'selectedMember' is not null or undefined. This condition determines if the EditMemberModal should be rendered. */}
      {selectedMember && (
        // Render the EditMemberModal component with props passed to it. This modal is used for editing a member's details.
        <EditMember
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
