import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import EditMemberModal from './EditMemberModal'; // Import the EditMemberModal component
import './MembersPage.css';

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/members');
        setMembers(response.data);
      } catch (error) {
        console.error('There was an error fetching the members:', error);
      }
    };

    fetchMembers();
  }, []);

  const handleRowClick = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  const saveMember = async (member) => {
    try {
      await axios.put(`http://localhost:3001/members/${member.id}`, member);
      setMembers(members.map(m => m.id === member.id ? member : m));
      handleCloseModal();
    } catch (error) {
      console.error('There was an error saving the member:', error);
    }
  };

  const removeMember = async (memberId) => {
    try {
      await axios.delete(`http://localhost:3001/members/${memberId}`);
      setMembers(members.filter(m => m.id !== memberId));
      handleCloseModal();
    } catch (error) {
      console.error('There was an error removing the member:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Members List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
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
          {members.map((member, index) => (
            <tr key={member.id} onClick={() => handleRowClick(member)}>
              <td>{index + 1}</td>
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
      {selectedMember && (
        <EditMemberModal
          show={showModal}
          handleClose={handleCloseModal}
          member={selectedMember}
          saveMember={saveMember}
          removeMember={removeMember}
        />
      )}
    </div>
  );
}

export default MembersPage;
