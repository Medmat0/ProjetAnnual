import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../apiCall";
import { useAuth } from "../../../context/authContext";
import { Snackbar, Slide } from "@mui/material";
import "./notifications.css"; // Assurez-vous que le CSS est importé

const Notifications = ({ closeDialog }) => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { token } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const res = await axios.get(`${BASE_URL}/profile/requests`, config);
        setRequests(res.data);
        console.log("requests",res.data);
        if (!res.data) {
          setSnackbarMessage("No new requests");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [token]);

  const handleAccept = async (requestId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.post(`${BASE_URL}/profile/request/accept/${requestId}`, {}, config);
      setRequests(requests.filter(request => request.id !== requestId));
      setSnackbarMessage("Request accepted");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error accepting request:", error);
      setSnackbarMessage("Failed to accept request");
      setOpenSnackbar(true);
    }
  };

  const handleReject = async (requestId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.post(`${BASE_URL}/profile/request/reject/${requestId}`, {}, config);
      setRequests(requests.filter(request => request.id !== requestId));
      setSnackbarMessage("Request rejected");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error rejecting request:", error);
      setSnackbarMessage("Failed to reject request");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const itemsPerPage = 2;
  const paginatedRequests = requests.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="notifications">
      {paginatedRequests.length > 0 ? (
        paginatedRequests.map((request) => (
          <div key={request.id} className="notification-item">
            <div className="user-info">
              <span>{request.requester.name}</span>
            </div>
            <span>wants to follow you</span>
            <button className="accept" onClick={() => handleAccept(request.id)}>Accept</button>
            <button className="reject" onClick={() => handleReject(request.id)}>Reject</button>
          </div>
        ))
      ) : (
        <p>Pas de notifications !</p>
      )}
      <div className="pagination-controls">
        {currentPage > 0 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        )}
        {(currentPage + 1) * itemsPerPage < requests.length && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        )}
      </div>
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        TransitionComponent={Slide}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </div>
  );
};

export default Notifications;
