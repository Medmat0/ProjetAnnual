import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";
import {useAuth} from "./authContext";
import axios from "axios";
import { BASE_URL } from "../apiCall";
import profileReducer, { initialProfileState } from "./profileReduce";
import {
  errorOptions,
  successOptions,
} from "../utils/optionsStyle";

const ProfileContext = createContext(initialProfileState);

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialProfileState);

  const { token  } = useAuth();

  // update user req
  const editUser = async (
    name,
    email,
    desc,
    city,
  
    profilePicture,
    coverPicture
  ) => {
    try {
      dispatch({
        type: "UPDATE_USER_REQUEST",
      });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        `${BASE_URL}/profile/edit`,
        { name, email, desc, city, profilePicture, coverPicture },
        config
      );
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: data,
      });
      toast.success("Profile updated successfully", successOptions);
    } catch (error) {
      console.log(error.response.data.message);
      dispatch({
        type: "UPDATE_USER_FAIL",
        payload: error.response.data.message,
      });
      toast.error(error.response.data.message, errorOptions);
    }
  };

  // follow user req
  const followUser = async (followId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${BASE_URL}/profile/follow/${followId}`, {}, config);
      toast.success("You followed the user", successOptions);
    } catch (error) {
      toast.error(error.response.data.message, errorOptions);
    }
  };

  // unfollow user req
  const unfollowUser = async (unfollowId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${BASE_URL}/profile/unfollow/${unfollowId}`,{},  config);
      console.log(response);
      toast.success("You unfollowed the user", successOptions);
    } catch (error) {
      toast.error(error.response.data.message, errorOptions);
    }
  };

  const sendFollowRequest = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${BASE_URL}/profile/request/send/${userId}`, {}, config);
      toast.success("Follow request sent", successOptions);
    } catch (error) {
      toast.error(error.response.data.message, errorOptions);
    }
  };

  const value = {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    success: state.success,
    editUser,
    followUser,
    unfollowUser,
    sendFollowRequest,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

const useProfile = () => {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error("useProfile must be used within ProfileContext");
  }
  return context;
};

export default useProfile;