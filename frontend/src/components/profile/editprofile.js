import React, { useState, useEffect } from "react";
import "./editprofile.css";
import "./profile.css";
import noCover from "../../assets/appImages/nokia.png";
import sampleProPic from "../../assets/postphotos/user.png";
import Topbar from "../timeline/topbar/topbar";
import Sidebar from "../timeline/sidebar/sidebar";
import { useParams } from "react-router-dom";
import {useAuth} from "../../context/authContext";
import { BASE_URL } from "../../apiCall";
import axios from "axios";
import useProfile from "../../context/profileContext";
import { Box, CircularProgress } from "@material-ui/core";
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import useTheme from "../timeline/ThemeContext";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [proPicUrl, setProPicUrl] = useState("");
  const [coverPicUrl, setCoverPicUrl] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [user, setUser] = useState({});
  const params = useParams();
  const { token } = useAuth();
  const { editUser, loading } = useProfile();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(
        `${BASE_URL}/myprofile/details/${params.userId}`,
        config
      );
      console.log("user in edit profile", res.data);
      setUser(res.data.user);
    };
    fetchUsers();
  }, [params.userId, token]);

  const postProPic = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error("Please Select an Image!");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "splash-social_media");
      data.append("cloud_name", "splashcloud");
      fetch("https://api.cloudinary.com/v1_1/splashcloud/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProPicUrl(data.secure_url);
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast.error("Please select an image with png/jpg type");
      setPicLoading(false);
      return;
    }
  };

  const postCoverPic = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error("Please Select an Image!");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "splash-social_media");
      data.append("cloud_name", "splashcloud");
      fetch("https://api.cloudinary.com/v1_1/splashcloud/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setCoverPicUrl(data.secure_url);
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast.error("Please select an image with png/jpg type");
      setPicLoading(false);
      return;
    }
  };

  const updateProfileHandler = (e) => {
    e.preventDefault();
    editUser(name, email, userDesc, city, proPicUrl, coverPicUrl);
  };



  return (
    <>
      <Helmet title="Edit profile | Splash Social" />
      <Toaster />
      <Topbar />
      <div
        className="profile"
        style={{ color: theme.foreground, background: theme.background }}>
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.profile && user.profile.website ? user.profile.website  : noCover}
                alt="..."
              />
              <img
                className="profileUserImg"
                src={user.profile && user.profile.image? user.profile.image : sampleProPic}
                alt="..."
              />
            </div>
            {loading && (
              <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
                <CircularProgress color="secondary" />
              </Box>
            )}
            <section className="editProfile-container">
              <div className="editProfile-box">
                <h3 className="editProfile-heading">Update Profile</h3>
                <form onSubmit={updateProfileHandler}>
                  <input
                    className="editProfile-input"
                    type="text"
                    placeholder={user?.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="editProfile-input"
                    type="email"
                    placeholder={user?.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="editProfile-input"
                    type="text"
                    placeholder={
                      user.profile && user.profile.bio ? user.profile.bio : "no bio yet !"
                    }
                    value={userDesc}
                    onChange={(e) => setUserDesc(e.target.value)}
                  />
                  <input
                    className="editProfile-input"
                    type="text"
                    placeholder={user.profile && user.profile.city ?user.profile.city  : "Which city...."}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  
                  {picLoading && (
                    <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
                      <CircularProgress color="secondary" />
                    </Box>
                  )}
                  <div>
                    <label htmlFor="proPic" className="editProfile-label">
                      Upload Profile Picture
                    </label>
                    <input
                      id="proPic"
                      className="editProfileFile-input"
                      type="file"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => postProPic(e.target.files[0])}
                    />
                    {proPicUrl && (
                      <div className="profilePicPreview">
                         <img src={proPicUrl} alt="Cover Preview" style={{ width: "100%", height: "auto" }}  />
                      </div>
                    )}
                  </div>
                  <label htmlFor="coverPic" className="editProfile-label">
                    Upload Cover Picture
                  </label>
                  <input
                    className="editProfileFile-input"
                    id="coverPic"
                    type="file"
                    accept=".png, .jpeg, .jpg"
                    onChange={(e) => postCoverPic(e.target.files[0])}
                  />
                  {coverPicUrl && (
                    <div className="profilePicPreview">
                       <img src={coverPicUrl} alt="Cover Preview"   style={{ width: "100%", height: "auto" }}  />
                    </div>
                  )}
                  <div className="editProfile-btnBox">
                    <button type="submit" className="editProfile-btn">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;