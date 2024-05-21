import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Rightbar.css';
import noAvatar from '../../assets/noAvatar.png';
import { Link, useParams } from 'react-router-dom';

const Rightbar = ({ user }) => {
    const { userId } = useParams();
    const [friends, setFriends] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [newGroupPrivacy, setNewGroupPrivacy] = useState('public');

    const groups = [
        { _id: '1', name: 'Javascript', groupPicture: 'url/to/group1/picture' },
        { _id: '2', name: 'ReactJs', groupPicture: 'url/to/group2/picture' },
        { _id: '3', name: 'Python', groupPicture: 'url/to/group3/picture' },
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

    const handleCreateGroupClick = () => {
        setShowCreateGroupModal(true);
    };

    const [message, setMessage] = useState(null);
    const handleCreateGroup = async () => {
        try {
            const newGroup = {
                userId,  // Assurez-vous que userId est inclus dans les données envoyées
                name: newGroupName,
                description: newGroupDescription,
                privacy: newGroupPrivacy,
            };
            const res = await axios.post('/api/groups/create', newGroup);
            // Add the new group to the list of groups (You might want to refetch or update the state here)
            groups.push(res.data.data);
            setShowCreateGroupModal(false);
            setNewGroupName('');
            setNewGroupDescription('');
            setNewGroupPrivacy('public');
        } catch (err) {
            console.log(err);
        }
    };

    {message && <div className="message">{message}</div>}
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? (
                    <>
                        <h4 className="rightbarTitle">User Information</h4>
                        <h4 className="rightbarTitle">User Friends</h4>
                        <div className="rightbarFollowings">
                            {friends.map(friend => (
                                <Link to={`/profile/${friend._id}`} key={friend._id} className="rightbarFollowing">
                                    <img
                                        src={friend.profilePicture || noAvatar}
                                        alt={friend.name}
                                        className="rightbarFollowingImg"
                                    />
                                    <span className="rightbarFollowingName">{friend.name}</span>
                                </Link>
                            ))}
                        </div>
                        <h4 className="rightbarTitle">Available Groups</h4>
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="rightbarSearchInput"
                        />
                        <button onClick={handleCreateGroupClick} className="rightbarFollowBtn">
                            <span>+</span> Create Group
                        </button>
                        <div className="rightbarGroups">
                            {filteredGroups.map(group => (
                                <div className="rightbarGroup" key={group._id}>
                                    <Link to={`/group/${group._id}`} className="rightbarGroupLink">
                                        <img
                                            src={group.groupPicture || noAvatar}
                                            alt={group.name}
                                            className="rightbarGroupImg"
                                        />
                                        <span className="rightbarGroupName">{group.name}</span>
                                    </Link>
                                    {joinedGroups.includes(group._id) ? (
                                        <button onClick={() => leaveGroupHandler(group._id)} className="rightbarFollowBtn">Leave</button>
                                    ) : (
                                        <button onClick={() => joinGroupHandler(group._id)} className="rightbarFollowBtn">Join</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {showCreateGroupModal && (
                            <div className="createGroupModal">
                                <h4>Create New Group</h4>
                                <input
                                    type="text"
                                    placeholder="Group Name"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                />
                                <textarea
                                    placeholder="Group Description"
                                    value={newGroupDescription}
                                    onChange={(e) => setNewGroupDescription(e.target.value)}
                                />
                                <select
                                    value={newGroupPrivacy}
                                    onChange={(e) => setNewGroupPrivacy(e.target.value)}
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                                <button onClick={handleCreateGroup}>Create</button>
                                <button onClick={() => setShowCreateGroupModal(false)}>Cancel</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div>Home Rightbar Content</div>
                )}
            </div>
        </div>
    );
};

export default Rightbar;
