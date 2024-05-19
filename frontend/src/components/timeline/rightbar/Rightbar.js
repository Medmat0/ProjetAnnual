import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Rightbar.css';
import './Rightbar.css';
import noAvatar from '../../assets/noAvatar.png';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Rightbar.css';



const Rightbar = ({ user }) => {
    const { userId } = useParams();
    const [friends, setFriends] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Static list of groups
    const groups = [
        { _id: '1', name: 'Group One', groupPicture: 'url/to/group1/picture' },
        { _id: '2', name: 'Group Two', groupPicture: 'url/to/group2/picture' },
        { _id: '3', name: 'Group Three', groupPicture: 'url/to/group3/picture' },
    ];

    useEffect(() => {
        const fetchFriendsAndJoinedGroups = async () => {
            try {
                const resFriends = await axios.get(`/api/users/friends/${userId}`);
                setFriends(resFriends.data);

                const resJoinedGroups = await axios.get(`/api/users/joinedGroups/${userId}`);
                setJoinedGroups(resJoinedGroups.data);
            } catch (err) {
                console.log(err);
            }
        };

        if (userId) {
            fetchFriendsAndJoinedGroups();
        }
    }, [userId]);

    const joinGroupHandler = async (groupId) => {
        try {
            await axios.post(`/api/groups/join/${groupId}`, { userId });
            setJoinedGroups([...joinedGroups, groupId]);
        } catch (err) {
            console.log(err);
        }
    };

    const leaveGroupHandler = async (groupId) => {
        try {
            await axios.post(`/api/groups/leave/${groupId}`, { userId });
            setJoinedGroups(joinedGroups.filter(id => id !== groupId));
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? (
                    <>
                        <h4 className="rightbarTitle">User Information</h4>
                        <div className="rightbarInfo">
                            {/* User information display */}
                        </div>
                        <h4 className="rightbarTitle">User Friends</h4>
                        <div className="rightbarFollowings">
                            {/* User friends display */}
                        </div>
                        <h4 className="rightbarTitle">Available Groups</h4>
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="rightbarSearchInput"
                        />
                        <div className="rightbarGroups">
                            {filteredGroups.map(group => (
                                <Link to={`/group/${group._id}`} key={group._id} className="rightbarGroup">
                                    <img
                                        src={group.groupPicture || noAvatar}
                                        alt={group.name}
                                        className="rightbarGroupImg"
                                    />
                                    <span className="rightbarGroupName">{group.name}</span>
                                    {joinedGroups.includes(group._id) ? (
                                        <button onClick={() => leaveGroupHandler(group._id)}>Leave</button>
                                    ) : (
                                        <button onClick={() => joinGroupHandler(group._id)}>Join</button>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div>Home Rightbar Content</div>
                )}
            </div>
        </div>
    );
};

export default Rightbar;
