import React, { useEffect, useState } from "react";
import "./feedform.css";
import { useParams } from "react-router-dom";
import PostCard from "../post/postcard";
import Share from "../post/sharePost";
import ProgrammePost from "../programpost/editorcode";
import ProgramPostCard from "../programpost/programPostcard";
import { Box, CircularProgress, Button, Chip } from "@material-ui/core"; 
import { useAuth } from "../../../context/authContext";
import useTheme from "../ThemeContext";
import axios from "axios";
import { BASE_URL } from "../../../apiCall";

const Feed = ({ userId, searchKey }) => {
  const params = useParams();
  const { token, userId: thisUserId } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState("normal");
  const [selectedTags, setSelectedTags] = useState([]); // State to hold selected tags
  const { theme } = useTheme();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let url = postType === "program"
        ? `${BASE_URL}/programPosts`
        : userId
          ? `${BASE_URL}/post/posts/${params.userId}?privacy=PUBLIC`
          : `${BASE_URL}/post/myposts?privacy=PUBLIC`;

      if (searchKey && postType === "program") {
        url = `${BASE_URL}/fetchUniqueProgramPost/?keyword=${encodeURIComponent(searchKey)}`;
      }

      const res = await axios.get(url, config);
      setLoading(false);
      setPosts(res.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [thisUserId, params.userId, userId, token, postType, searchKey]);

  const handlePostTypeChange = (type) => {
    setPostType(type);
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredPosts = selectedTags.length > 0
    ? posts.filter((post) => selectedTags.every((tag) => post.tags?.includes(tag)))
    : posts;

  return (
    <div
      className="feed"
      style={{ color: theme.foreground, background: theme.background }}
    >
      <div className="feedWrapper">
        {(!userId || userId === thisUserId) && (
          <div>
            <Button
              onClick={() => handlePostTypeChange("normal")}
              variant={postType === "normal" ? "contained" : "outlined"}
              color="primary"
            >
              Normal Post
            </Button>
            <Button
              onClick={() => handlePostTypeChange("program")}
              variant={postType === "program" ? "contained" : "outlined"}
              color="primary"
            >
              Program Post
            </Button>
            {postType === "program" && <ProgrammePost fetchPosts={fetchPosts} />}
            {postType === "normal" && <Share fetchPosts={fetchPosts} />}
          </div>
        )}

        <div className="tagContainer">
          <h4>Filter by Tags:</h4>
          <div>
            {["Images filter", "Text addition", "Python", "Javascript", "Programming"].map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                color={selectedTags.includes(tag) ? "primary" : "default"}
                onClick={() => handleTagSelect(tag)}
                style={{ margin: "0 5px 10px 0" }}
              />
            ))}
          </div>
        </div>

        {loading && (
          <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {filteredPosts.length === 0 ? (
          <h2 style={{ marginTop: "20px" }}>No posts yet!</h2>
        ) : (
          filteredPosts.map((p) => {
            return postType === "program" ? (
              <ProgramPostCard 
                post={p} 
                key={p.id} 
                fetchPosts={fetchPosts} 
              />
            ) : (
              <PostCard post={p} key={p.id} fetchPosts={fetchPosts} />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Feed;
