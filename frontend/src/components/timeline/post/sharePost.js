import React, { useState } from "react";
import "./sharePost.css";
import noAvatar from "../../../assets/postphotos/user.png";
import { PermMedia, Room } from "@material-ui/icons";
import usePost from "../../../context/postContext";
import { Box, CircularProgress } from "@material-ui/core";
import toast, { Toaster } from "react-hot-toast";
import InputEmoji from "react-input-emoji";

const Share = ({ fetchPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [image, setImage] = useState(null);
  const [picLoading, setPicLoading] = useState(false);
  const { createPost, createLoading } = usePost();

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "splash-social_media");
    const res = await fetch("https://api.cloudinary.com/v1_1/splashcloud/image/upload", {
      method: "POST",
      body: data,
    });
   console.log("res", res);
    const resData = await res.json();
    console.log("resData", resData);
    return resData.secure_url;
  };

  const postSubmitHandler = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and Content are required.");
      return;
    }
    let imageUrl = "";
    if (image) {
      setPicLoading(true);
      imageUrl = await uploadToCloudinary(image);
      console.log("Image URL:", imageUrl);
      setPicLoading(false);
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("privacy", privacy);
    if (imageUrl) formData.append("image", imageUrl);

    try {
      await createPost(formData);
      setTitle("");
      setContent("");
      setPrivacy("PUBLIC");
      setImage(null);
      fetchPosts();
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Could not create post. Please try again.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <>
      <Toaster />
      <div className="share">
        <form className="shareWrapper" onSubmit={postSubmitHandler} encType="multipart/form-data">
          <div className="shareTop">
            <img className="shareProfileImg" src={noAvatar} alt="..." />
            <InputEmoji value={title} onChange={setTitle} placeholder="Title" />
            <InputEmoji value={content} onChange={setContent} placeholder="What's on your mind?" />
          </div>
          <hr className="shareHr" />
          {picLoading && (
            <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
              <CircularProgress color="secondary" />
            </Box>
          )}
          <input
            type="file"
            id="file"
            accept=".png, .jpeg, .jpg"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <label htmlFor="file">
            <PermMedia htmlColor="tomato" className="shareIcon" />
            <span className="shareOptionText">Photo</span>
          </label>
          <div className="shareOptions">
            <label htmlFor="loc" className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <select id="loc" value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </label>
          </div>
          <button className="shareButton" type="submit" disabled={createLoading}>
            {createLoading ? "Submitting..." : "Share"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Share;
