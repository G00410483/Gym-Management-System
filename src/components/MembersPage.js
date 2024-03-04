import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios'; 
import './MembersPage.css';

function MembersPage() {
  const [members, setMembers] = useState([]);

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

  return (
    <div className="container mt-5">
      <h1>Members List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Second Name</th>
            <th>Email Address</th>
            <th>Gender</th>
            <th>Type of Membership</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.id}>
              <td>{index + 1}</td>
              <td>{member.first_name}</td>
              <td>{member.second_name}</td>
              <td>{member.email_address}</td>
              <td>{member.gender}</td>
              <td>{member.type_of_membership}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default MembersPage;
