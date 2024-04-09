// SelectedClassModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faChalkboardTeacher, faClock, faCalendarDay, faUsers } from '@fortawesome/free-solid-svg-icons';

function ClassInfo({ selectedClass, onHide }) {
  return (
    <Modal show={!!selectedClass} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>{selectedClass?.class_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <FontAwesomeIcon icon={faChalkboardTeacher} className="modal-icon" /> Instructor: {selectedClass?.instructor_name}<br />
          <FontAwesomeIcon icon={faClock} className="modal-icon" /> Time: {selectedClass?.time}<br />
          <FontAwesomeIcon icon={faCalendarDay} className="modal-icon" /> Day: {selectedClass?.day}<br />
          <FontAwesomeIcon icon={faUsers} className="modal-icon" /> Max Capacity: {selectedClass?.max_capacity}
        </p>
        {selectedClass?.image && <img src={selectedClass.image} alt="Class Image" className="modal-image" />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClassInfo;
