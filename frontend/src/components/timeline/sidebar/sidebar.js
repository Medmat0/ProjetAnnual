import React, { useState  } from "react";
import "./sidebar.css";
import { RssFeed, Notifications as NotificationsIcon , Bookmarks , Build  } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import useTheme from "../ThemeContext.js";
import { Link } from "react-router-dom";
import SearchUser from "../searchUser/searchuser";
import Notifications from "../topbar/notifications.js";
import CollectionsList from "./collection.js" 




const Sidebar = ({ searchFriends, toggle , onPipelineBuilderClick   
   }) => {
  const { theme } = useTheme();
  const history = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false); 

  
  // logout user and redirect to login page
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    history("/login");
  };


  return (
    <>
      <div
        className="sidebar"
        style={{ color: theme.foreground, background: theme.background }}>
        <div className="sidebarWrapper">
          <ul className="sidebarList">
            <Link to="/" style={{ textDecoration: "none", color: "#1877f2" }}>
              <li className="sidebarListItem">
                <RssFeed className="sidebarIcon" />
                <span className="sidebarListItemText">Feed</span>
              </li>
            </Link>
        
            <li className="sidebarListItem" onClick={() => setShowNotifications(!showNotifications)}>
              <NotificationsIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Notifications</span>
            </li>
            <li className="sidebarListItem" onClick={onPipelineBuilderClick}>
              <Build className="sidebarIcon" />
              <span className="sidebarListItemText">Create Pipeline</span>
            </li>
          </ul>
          <hr className="sidebarHr" />
          <h4 className="rightbarTitle">Search Friends Results</h4>
          <ul className="rightbarFriendList">
            {searchFriends && searchFriends.map((u) => <SearchUser key={u._id} user={u} />)}
          </ul>
          <hr className="sidebarHr" />
          <button className="sidebarButton" onClick={logoutHandler}>
            Logout
          </button>
        </div>
          <CollectionsList  />      </div>
      {showNotifications && <Notifications closeDialog={() => setShowNotifications(false)} />} {/* Affiche les notifications */}
    </>
  );
};

export default Sidebar;
