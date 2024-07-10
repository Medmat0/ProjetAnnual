import axios from "axios";
import React, { useState , useEffect } from "react";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../apiCall";
import { useAuth } from "../../context/authContext";
import Feed from "./feed/feedform";
import SearchUser from "./searchUser/searchuser";
import Sidebar from "./sidebar/sidebar";
import Topbar from "./topbar/topbar";
import PipelineBuilder from "./piplines/piplinesBuilder";

const Timeline = () => {
  const [searchFriends, setSearchFriends] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const { token } = useAuth();
  const [toggle, setToggle] = useState(false);
  const [showPipelineBuilder, setShowPipelineBuilder] = useState(false); // État pour afficher PipelineBuilder
  const [collections, setCollections] = useState([]);
  const history = useNavigate();
  
  // logout user and redirect to login page
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history("/login");
  };

  const pipelineBuilderHandler = () => {
    setShowPipelineBuilder(!showPipelineBuilder);
  };

  // Toggle menu
  const menuHandler = () => {
    setToggle(!toggle);
  };

  // search user request
  const searchHandler = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.get(
        `${BASE_URL}/profile/search?keyword=${searchKey}`,
        config
      );
      setSearchFriends(res.data.data);
      setSearchKey("");
    } catch(error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const response = await axios.get(`${BASE_URL}/collection/all`, config);
        setCollections(response.data);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    };

    fetchCollections();
  }, []);




  return (
    <>
      <Helmet title="Timeline |  Share code" />
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
              className="searchInput "
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <button
            style={{ margin: "0.6rem" }}
            className="shareButton"
            onClick={searchHandler}>
            Search
          </button>
          <h4 className="rightbarTitle sb">Search Friends Results</h4>
          <ul className="rightbarFriendList">
            {searchFriends &&
              searchFriends.map((u) => <SearchUser key={u.id} user={u} />)}
          </ul>
          <button className="sidebarButton" onClick={logoutHandler}>
            Logout
          </button>
          <hr className="sidebarHr" />
        </div>
      )}
      <div className="homeContainer">
        <Sidebar 
        searchFriends={searchFriends} 
        toggle={toggle} 
        onPipelineBuilderClick={pipelineBuilderHandler} 
          />

        {showPipelineBuilder ? <PipelineBuilder collections={collections} /> : <Feed  />}
        {!showPipelineBuilder }
      </div>
    </>
  );
};

export default Timeline;
