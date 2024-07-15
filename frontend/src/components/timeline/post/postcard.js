import React, { useState, useEffect } from "react";
import "./PostCard.css";
import sampleProPic from "../../../assets/postphotos/user.png";
import likeImg from "../../../assets/postphotos/heart.png";
import heart from "../../../assets/postphotos/like.png";
import { Send } from "@material-ui/icons";
import { Box, CircularProgress } from "@material-ui/core";
import axios from "axios";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import InputEmoji from "react-input-emoji";
import toast from "react-hot-toast";
import { errorOptions, successOptions } from "../../../utils/optionsStyle";
import usePost from "../../../context/postContext";
import { useAuth } from "../../../context/authContext";
import { BASE_URL } from "../../../apiCall";

const PostCard = ({ post, fetchPosts }) => {
  const [like, setLike] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comm, setComm] = useState("");
  const { token, userId } = useAuth();
  const { getTimelinePosts } = usePost();
  const likeHandler = () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const pId = post.id;
      axios.post(`${BASE_URL}/like/${pId}`, {}, config);
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
          `${BASE_URL}/comment/${pId}`,
          { content: comm },
          config
        );
      }
      setCommentLoading(false);
      toast.success("Comment posted successfully!", successOptions);
    } catch (error) {
      setCommentLoading(false);
      toast.error(error.response.data.message, errorOptions);
    }
    fetchPosts();
    setComm("");
  };

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
        await axios.delete(`${BASE_URL}/post/delete/${post.id}`, config);
      }
      setCommentLoading(false);
      toast.success("Post deleted successfully!", successOptions);
    } catch (error) {
      setCommentLoading(false);
      toast.error(error.response.data.message, errorOptions);
    }
    fetchPosts();
  };

  useEffect(() => {
    getTimelinePosts();
  }, []);

  useEffect(() => {
    setIsLiked(post.likes?.includes(userId));
  }, [token.id, post.likes, userId]);


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
                {post.postedAt}
              </Moment>{" "}
              ago
            </span>
          </div>
          <div className="postTopRight">
            {userId == post.author.id ? (
              <button
                style={{ backgroundColor: "#3b82f6" }}
                className="shareButton"
                onClick={deleteHandler}
              >
                Delete
              </button>
            ) : (
              <> </>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.content}</span>
          <img
            className="postImg"
            src={post.image ? post.image : post}
            alt="..."
          />
        </div>
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
          <div className="postBottomRight"><span className="postCommentText" onClick={showCommentHandler}>
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
              placeholder="Post a comment...."
            />
          </div>
          <div className="postCommentCont-2">
            <button
              className="postCommentBtn"
              onClick={postCommentHandler}
              disabled={commentLoading ? true : false}
            >
              <Send style={{ fontSize: "18px" }} />
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
                  src={comment.user.profile && comment.user.profile.image ? comment.user.profile.image : sampleProPic}
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

export default PostCard;