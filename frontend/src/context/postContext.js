import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";
import {useAuth} from './authContext';
import postReducer, { initialPostState } from "./postReduce";
import axios from "axios";
import { BASE_URL } from "../apiCall";
import {
  errorOptions,
  successOptions,
} from "../utils/optionsStyle";

const PostContext = createContext(initialPostState);

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialPostState);

  const {token, userId } = useAuth();

  const createProgramPost = async (programPostData) => {
    try {
      dispatch({ type: "CREATE_PROGRAM_POST_REQUEST" });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`${BASE_URL}/createProgramPost`, programPostData, config);
      dispatch({ type: "CREATE_PROGRAM_POST_SUCCESS", payload: data });
      toast.success("Program Post created successfully", successOptions);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An error occurred while creating the program post.";
      dispatch({ type: "CREATE_PROGRAM_POST_FAIL", payload: errorMsg });
      toast.error(errorMsg, errorOptions);
    }
  };
  
  // create post req
  const createPost = async (formData) => {
    try {
      dispatch({
        type: "CREATE_POST_REQUEST",
      });
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/post/createPost`,
        formData,
        config
      );
      
      dispatch({
        type: "CREATE_POST_SUCCESS",
        payload: data,
      });
      toast.success("Post created successfully", successOptions);
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            dispatch({
              type: "CREATE_POST_FAIL",
              payload: error.response.data.message,
            });
            toast.error(error.response.data.message, errorOptions);
          } else {
            dispatch({
              type: "CREATE_POST_FAIL",
              payload: "An error occurred while creating the post.",
            });
            toast.error("An error occurred while creating the post.", errorOptions);
          }
          
    }
  };
  

  // get timeline posts req
  const getTimelinePosts = async () => {
    try {
      dispatch({
        type: "FETCH_POSTS_REQUEST",
      });
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const url = `${BASE_URL}/post/myposts`;
      const { data } = await axios.get(url, config);
      dispatch({
        type: "FETCH_POSTS_SUCCESS",
        payload: data.data,
      });
     
      //console.log("Timeline posts", data.data);
    } catch (error) {
      dispatch({
        type: "FETCH_POSTS_FAIL",
        payload: error.response.data.message,
      });
      toast.error(error.response.data.message, errorOptions);
    }
  };





  const value = {
    post: state.post,
    timelinePosts: state.timelinePosts,
    loading: state.loading,
    createLoading: state.createLoading,
    error: state.error,
    createPost,
    getTimelinePosts,
    createProgramPost
    

  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

const usePost = () => {
  const context = useContext(PostContext);

  if (context === undefined) {
    throw new Error("usePost must be used within PostContext");
  }
  return context;
};

export default usePost;