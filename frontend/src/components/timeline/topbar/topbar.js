import React, { useState, useEffect } from "react";
import "./topbar.css";
import axios from "axios";
import { Menu, Search, WbSunny, Notifications as NotificationsIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import useTheme, { themes } from "../ThemeContext";
import noAvatar from "../../../assets/postphotos/user.png";
import { BASE_URL } from "../../../apiCall";
import Notifications from "./notifications";

const Topbar = ({ searchHandler, setSearchKey, searchKey, menuHandler }) => {
  const [user, setUser] = useState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const { token, userId } = useAuth();
  const { theme, setTheme } = useTheme();

  // Toggle theme switch
  const themeModeHandler = () => {
    setTheme(theme === themes.light ? themes.dark : themes.light);
    localStorage.setItem("userTheme", theme === themes.light ? "dark" : "light");
  };

  // get user details
  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(`${BASE_URL}/profile/details/${userId}`, config);
      setUser(res.data.user);
    };
    fetchUsers();
  }, [userId, token]);

  const handleSearch = () => {
    if (searchKey.startsWith("#post:")) {
      const query = searchKey.slice(6).trim(); 
      searchHandler(query, "post");
    } else if (searchKey.startsWith("#program:")) {
      const query = searchKey.slice(9).trim();
      searchHandler(query, "program");
    } else {
      searchHandler(searchKey, "friend");
    }
  };
  const toggleNotifications = () => {
    setShowNotifications(prevState => !prevState); // Toggle showNotifications state
  }

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };



  return (
    <>
      <div className="topbarContainer" style={{ color: theme.topbarColor, background: theme.topbarBackground }}>
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="topbarLogo">Share code</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar" onContextMenu={handleContextMenu}>
            <input
              type="text"
              placeholder="Search for friend...example - 'aditya' or Search for post...example - '#post: post title'"
              className="searchInput"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        </div>
        <div className="topbarRight">
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <WbSunny onClick={themeModeHandler} />
            </div>
            <div className="topbarIconItem">
              <Menu onClick={menuHandler} />
            </div>
            <div className="topbarIconItem" onClick={toggleNotifications}>
              <NotificationsIcon />
            </div>
            <div className="topbarIconItem">
              <Search className="searchIcon" onClick={handleSearch} />
            </div>
          </div>
          <Link to={`/profile/${userId}`}>
            <img
              src={user?.profile && user.profile.image ? user.profile.image : noAvatar}
              alt="..."
              className="topbarImg"
            />
          </Link>
        </div>
      </div>
      {showNotifications && <Notifications closeDialog={() => setShowNotifications(false)} />}

     
    </>
  );
};

export default Topbar;
