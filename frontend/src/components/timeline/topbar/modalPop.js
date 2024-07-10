import React from "react";
import { Modal } from "react-bootstrap";

const modalPop = ({ show, handleClose, request, handleAccept, handleReject }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{request.requester.name} wants to follow you</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <img
          src={request.requester.profile?.image || ""}
          alt={request.requester.name}
          style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success" onClick={() => handleAccept(request.id)}>Accept</button>
        <button className="btn btn-danger" onClick={() => handleReject(request.id)}>Reject</button>
      </Modal.Footer>
    </Modal>
  );
};

export default modalPop;
