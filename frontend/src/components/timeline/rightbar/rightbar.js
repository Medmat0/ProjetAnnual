import React, { useEffect, useState } from "react";
import "./rightbar.css";
import noAvatar from "../../../assets/postphotos/user.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";
import { useAuth } from "../../../context/authContext";
import useProfile from "../../../context/profileContext";
import { BASE_URL } from "../../../apiCall";
import useTheme from "../ThemeContext";

const Rightbar = ({ user }) => {
  const params = useParams();
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(false);
  const history = useNavigate();

  const { token, userId, name } = useAuth();
  const { unfollowUser, sendFollowRequest } = useProfile();
  const { theme } = useTheme();

  // get user details
  const fetchUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (userId) {
      await axios.get(
        `${BASE_URL}/profile/details/${userId}`,
        config
      );
    }
  };

  // follow user handler
  const followHandler = async () => {
    await sendFollowRequest(params.userId);
    fetchFriends();
    history("/");
  };

  // unfollow a user
  const unfollowHandler = async () => {
    const response = await unfollowUser(params.userId);
    console.log(response);
    fetchFriends();
    history("/");
  };

  useEffect(() => {
    fetchUsers();
  });

  const fetchFriends = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${BASE_URL}/profile/followers`,
      config
    );
    setFriends(data.data);
  };



  useEffect(() => {
    if (params.userId && friends.length > 0) {
      setFollowed(friends.some((friend) => friend.id == params.userId));
    }
  }, [friends, params.userId]);

  useEffect(() => {
    
      fetchFriends();

  }, [userId]);

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
        </div>
      </>
    );
  };

  // profile right bar
  const ProfileRightbar = () => {
    return (
      <>
        {user?.name !== name && userId !== params.userId && (
          <button
            className="rightbarFollowBtn"
            onClick={followed ? unfollowHandler : followHandler}
          >
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle" style={{ color: "blue" }}>
          User information
        </h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">
              {user.profile && user.profile.city ? user.profile.city : "-"}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Status:</span>
            <span className="rightbarInfoValue">
              {user.emailVerified ? "Verified account " : "Not verified email"}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">single</span>
          </div>
        </div>
        {params.userId === userId && (
          <>
            <h4 className="rightbarTitle" style={{ color: "blue" }}>
              User friends
            </h4>
            <div className="rightbarFollowings">
              {friends &&
                friends?.map((friend) => (
                  <Link
                    to={`/profile/${friend?.id}`}
                    style={{ textDecoration: "none" }}
                    key={friend._id}
                  >
                    <div className="rightbarFollowing" key={friend?.id}>
                      <img
                        src={
                          friend?.profile.image
                            ? friend.profile.image
                            : noAvatar
                        }
                        alt=""
                        className="rightbarFollowingImg"
                      />
                      <span className="rightbarFollowingName">
                        {friend?.name}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div
      className="rightbar"
      style={{ color: theme.foreground, background: theme.background }}
    >
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;
