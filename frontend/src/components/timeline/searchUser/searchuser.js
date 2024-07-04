
import React from "react";
import "./searchuser.css";
import { Link } from "react-router-dom";
import noAvatar from "../../../assets/postphotos/user.png";

const SearchUser = ({ user }) => {
  //  search users result component
  return (
    <>
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <Link to={`/profile/${user.id}`}>
            <img
              className="rightbarProfileImg"
              src={user.profile && user.profile.image ?  user.profile.image  : noAvatar}
              alt="avatar"
            />
          </Link>
        </div>
        <span className="rightbarUsername">{user.name}</span>
      </li>
    </>
  );
};

export default SearchUser;