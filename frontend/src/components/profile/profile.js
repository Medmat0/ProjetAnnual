import React, { useState, useEffect } from "react";
import "./profile.css";
import noCover from "../../assets/appImages/nokia.png";
import sampleProPic from "../../assets/postphotos/user.png";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../apiCall";
import Feed from "../timeline/feed/feedform";
import Rightbar from "../timeline/rightbar/rightbar";
import Sidebar from "../timeline/sidebar/sidebar";
import Topbar from "../timeline/topbar/topbar";
import SearchUser from "../timeline/searchUser/searchuser";
import Moment from "react-moment";
import { Avatar } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import useTheme from "../timeline/ThemeContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const params = useParams();
  const [searchKey, setSearchKey] = useState("");
  const [toggle, setToggle] = useState(false);
  const [searchFriends, setSearchFriends] = useState([]);
  const { token, userId, logout } = useAuth(); // Utilisation de logout depuis useAuth
  const { theme } = useTheme();
  const history = useNavigate();

  const menuHandler = () => {
    setToggle(!toggle);
  };

  // Recherche des utilisateurs
  const searchHandler = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.get(`${BASE_URL}/myprofile/search?keyword=${searchKey}`, config);
      setSearchFriends(res.data.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setSearchKey("");
  };

  // Récupération des détails de l'utilisateur
  useEffect(() => {
    const fetchUserDetails = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const id = params.userId || 1;
        const res = await axios.get(`${BASE_URL}/myprofile/details/${id}`, config);
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Gestion de l'erreur ici
      }
    };
    fetchUserDetails();
  }, [params.userId, token]);

  // Déconnexion de l'utilisateur
  const handleLogout = () => {
    logout(); // Utilisation de la fonction logout fournie par useAuth
    history("/login"); // Navigue vers la page de connexion après déconnexion
  };

  return (
    <>
      <Helmet
        title={`${user?.name ? user?.name : "User"} Profile | Splash Social`}
      />
      <Toaster />
      <Topbar
        searchHandler={searchHandler}
        setSearchKey={setSearchKey}
        searchKey={searchKey}
        menuHandler={menuHandler}
      />
      {toggle && (
        <div className="sidebar-resp">
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search for friend...example - 'aditya'"
              className="searchInput"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <button
            style={{ margin: "0.6rem" }}
            className="shareButton"
            onClick={searchHandler}
          >
            Search
          </button>
          <h4 className="rightbarTitle sb">Search Friends Results</h4>
          <ul className="rightbarFriendList">
            {searchFriends &&
              searchFriends.map((u) => <SearchUser key={u.id} user={u} />)}
          </ul>
          <button className="sidebarButton" onClick={handleLogout}>
            Logout
          </button>
          <hr className="sidebarHr" />
        </div>
      )}
      <div className="profile">
        <Sidebar searchFriends={searchFriends} toggle={toggle} />
        <div className="profileRight">
          <div className="profileRightTop">
            <div
              className="profileCover"
              style={{
                color: theme.foreground,
                background: theme.background,
              }}
            >
              <img
                className="profileCoverImg"
                src={user.profile && user.profile.website ? user.profile.website : noCover}
                alt="..."
              />
              <img
                className="profileUserImg"
                src={user.profile && user.profile.image ? user.profile.image : sampleProPic}
                alt="..."
              />
              {params.userId === userId && (
                <Link to={`/editProfile/${userId}`}>
                  <div className="profile-edit-icon">
                    <Avatar style={{ cursor: "pointer", backgroundColor: "blue" }}>
                      <Edit />
                    </Avatar>
                  </div>
                </Link>
              )}
            </div>
            <div
              className="profileInfo"
              style={{
                color: theme.foreground,
                background: theme.background,
              }}
            >
              <h4 className="profileInfoName">{user.name}</h4>
              <p className="profileInfoDesc">
                About me: {user.profile && user.profile.bio ? user.profile.bio : "no bio yet !"}
              </p>
              <small className="profileInfoDesc">
                Joined on:{" "}
                {user.createdAt ? (
                  <em>
                    <Moment format="DD/MM/YYYY">{user.createdAt}</Moment>
                  </em>
                ) : (
                  "----"
                )}
              </small>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId={params.userId} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
