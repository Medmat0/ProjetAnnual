import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../../../apiCall"; 
import pythonImage from '../../../assets/appImages/python.png'; 
import jsImage from '../../../assets/appImages/js.png';
import { useAuth } from "../../../context/authContext";
import "./collection.css"; 
import toast from "react-hot-toast";

const CollectionsList = ({updateCollection}) => {
  const { token } = useAuth();
  const [collections, setCollections] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, collectionId: null });
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${BASE_URL}/collection/all`, config);
        setCollections(response.data || []);
      } catch (error) {
        console.error("Failed to fetch collections", error);
        setCollections([]);
      }
    };

    fetchCollections();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu({ visible: false, x: 0, y: 0, collectionId: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuRef]);

  const getImageForLanguage = (language) => {
    switch (language.toLowerCase()) {
      case 'python':
        return pythonImage;
      case 'javascript':
        return jsImage;
      default:
        return null; 
    }
  };

  const handleRightClick = (event, collectionId) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      collectionId,
    });
  };

  const handleDeleteCollection = async () => {
    const { collectionId } = contextMenu;
    if (!collectionId) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
       await axios.delete(`${BASE_URL}/collection/${collectionId}`, config);
      setCollections(collections.filter(collection => collection.id !== collectionId));
      setContextMenu({ visible: false, x: 0, y: 0, collectionId: null });
      toast.success("Collection deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete collection. Please try again.");
    }
  };
  


  return (
    <div className="collectionsList">
      <h4>Your Collections</h4>
      {collections.length > 0 ? (
        <ul>
          {collections.map((collection) => (
            <li key={collection.id} onContextMenu={(event) => handleRightClick(event, collection.id)}>
              <img 
                src={getImageForLanguage(collection.language)} 
                alt={collection.language} 
                className="language-image" 
              />
              {collection.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No collections. Add some!</p>
      )}

      {contextMenu.visible && (
        <div 
          className="context-menu" 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          ref={contextMenuRef}
        >
          <button onClick={handleDeleteCollection}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default CollectionsList;
