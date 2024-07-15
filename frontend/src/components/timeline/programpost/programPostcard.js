import React, { useState, useEffect } from "react";
import "./programPostCard.css"; 
import { Box, CircularProgress } from "@material-ui/core";

import sampleProPic from "../../../assets/postphotos/user.png";
import likeImg from "../../../assets/postphotos/heart.png";
import heart from "../../../assets/postphotos/like.png";
import Moment from "react-moment";
import { Send } from "@material-ui/icons";
import axios from "axios";
import InputEmoji from "react-input-emoji";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/authContext";
import { BASE_URL } from "../../../apiCall";
import { Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react"; 
const ProgramPostCard = ({ post, fetchPosts  }) => {
  const [like, setLike] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comm, setComm] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(post.code);
  const { token, userId } = useAuth();
  const [versions, setVersions] = useState([]); 
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(null);
  const [selectedVersionId] = useState(null);
  const history = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const versionsData = await fetchVersions(); 
        setVersions(versionsData); 
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    };

    fetchData();
  }, []); 
  const likeHandler = () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const pId = post.id;
      axios.post(`${BASE_URL}/like/programpost/${pId}`, {}, config);
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const showCommentHandler = () => {
    setShowComment(!showComment);
  };

  const postCommentHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      setCommentLoading(true);
      if (post.id) {
        const pId = post.id;
        await axios.post(
          `${BASE_URL}/comment/programpost/${pId}`,
          { content: comm },
          config
        );
      }
      setCommentLoading(false);
      toast.success("Comment posted successfully!");
    } catch (error) {
      setCommentLoading(false);
      toast.error(error.response.data.message);
    }
    fetchPosts();
    setComm("");
  };
 console.log(post);
  const deleteHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      setCommentLoading(true);
      if (post.id) {
        await axios.delete(`${BASE_URL}/programPost/delete/${post.id}`, config);
      }
      setCommentLoading(false);
      toast.success("Post deleted successfully!");
    } catch (error) {
      setCommentLoading(false);
      toast.error(error.response.data.message);
    }
    fetchPosts();
  };


  useEffect(() => {
    setIsLiked(post.likes?.includes(userId));
  }, [token.id, post.likes]);


  const fetchVersions = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(`${BASE_URL}/programPost/programVersions/${post.id}`, config);
      setVersions(res.data);
      return res.data;
    } catch (error) {
      toast.error("Failed to fetch versions.");
      return [];
    }
  };
  const handleExecuteScript = () => {
    history('/code', {
      state: {
        codeInside: selectedVersion? selectedVersion : post.code,
        inputUserType: post.inputType,
        languageUser: post.language
      }
    });
  };

  const handleVersionClick = async (versionContent, index) => {
    
    setSelectedVersion(versionContent);
    setSelectedVersionIndex(index + 1); 

    setShowVersions(false);
  };
  
  const addToCollection = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(
        `${BASE_URL}/collection/add`,
        {
          postId: post.id,
          versionId: selectedVersionId,
        },
        config
      );
      toast.success("Post added to collection successfully!");
      
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const saveVersion = async () => {
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
      await axios.post(`${BASE_URL}/programPost/saveVersion`, { postId: post.id, content: selectedVersion } , config);
      
        toast.success("Version saved successfully");
        await fetchVersions();
        alert('Version saved successfully');
        //fetchPosts(); 
     
    } catch (error) {
      console.error('Error saving version:', error);
      alert('Failed to save version');
    }
  };

  const toggleVersions = async () => {
    setShowVersions(!showVersions);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${post.author.id}`}>
              <img
                className="postProfileImg"
                src={post.author.profile && post.author.profile.image ? post.author.profile.image : sampleProPic}
                alt="..."
              />
            </Link>
            <span className="postUsername">{post.author.name}</span>
            <span className="postLocation">
              • {post.privacy || "Location"}
            </span>
            <span className="postDate">
              <Moment fromNow ago>
                {post.createdAt}
              </Moment>{" "}
              ago
            </span>
          </div>
          <div className="postTopRight">
          <div className="dropdown">
    <button className="dropbtn">⋮</button>
    <div className="dropdown-content">
            {userId === post.author.id ? (
              <button
                
                className="DeleteButton"
                onClick={deleteHandler}
              >
                Delete
              </button>
            ) : (
              <> </>
            )}
            <button
              className="versionButton"
              onClick={toggleVersions}
            >
              Versions
            </button>
            <button
              className="versionButton"
              onClick={handleExecuteScript}
            >
              Execute Script
            </button>
            <button className="saveButton" onClick={saveVersion}>
              Save
            </button>
            <button
            class="addToCollectionButton"
              variant="contained"
              color="primary"
              onClick={addToCollection}
            >
              Add to Collection
            </button>
          </div>
          </div>
  </div>
        </div>
        <div className="postCenter">
        <h2>{post.title}</h2>
        <p>{post.description} </p>
          <Editor
            height="200px"
            defaultLanguage={post.language}
            value={selectedVersion ? selectedVersion : post.code}
            onChange={(value) => setSelectedVersion(value)}
            options={{ readOnly: userId !== post.author.id,
                theme: "vs-dark"
            }}
          />
          <p>Language: {post.language}</p>
          <p>Input Type: {post.inputType}</p>
          {selectedVersionIndex && (
            <p>Selected Version: Version {selectedVersionIndex}</p>
          )}
        </div>
        { showVersions && (
          <div className="postVersions">
            <h4>Versions</h4>
            <ul>
              {versions.data?.length ? versions.data.map((version, index) => ( 
                <li key={index} onClick={() => handleVersionClick(version.content, index)}>
                  Version {index + 1}
                </li>
              )) : <li>No versions available</li>}
            </ul>
          </div>
        )}
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              onClick={likeHandler}
              src={likeImg}
              alt="like"
            />
            <img
              className="likeIcon"
              onClick={likeHandler}
              src={heart}
              alt="heart"
            />
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={showCommentHandler}>
              {post?.comments ? post.comments.length : 0} comments
            </span>
          </div>
        </div>
        {commentLoading && (
          <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}
        <div className="postCommentCont">
          <div className="postCommentCont-1">
            <InputEmoji
              value={comm}
              onChange={setComm}
              placeholder="Write a comment"
            />
          </div>
          <div>
            <button className="postCommentBtn" onClick={postCommentHandler}>
              {commentLoading ? <CircularProgress size={16} /> : <Send />}
            </button>
          </div>
        </div>
        {post?.comments?.map((comment) => {
          return (
            <div
              className="postCommentsBox"
              style={{ display: showComment ? "" : "none" }}
              key={comment?.id}
            >
              <div className="postCommentUser">
                <img
                  className="postProfileImg"
                  src={comment.user.profile && comment.user.profile.image? comment.user.profile.image : sampleProPic}
                  alt="..."
                />
                <span className="postCommentUserName">
                  {comment.user?.name}
                </span>
              </div>
              <div className="postCommentContent">
                <span>{comment.content}</span>
              
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgramPostCard;
