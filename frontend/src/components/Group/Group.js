import React from 'react';
const posts = [
    { id: 1, content: 'Post du groupe !', date: '2024-05-18' },
    { id: 2, content: 'Post 2 du groupze!', date: '2024-05-17' },
];

const Group = () => {
    return (
        <div className="profile">
            <h2>Feed de groupe</h2>
            {posts.map(post => (
                <div key={post.id} className="post">
                    <p>{post.content}</p>
                    <span>{post.date}</span>
                </div>
            ))}
        </div>
    );
};

export default Group;