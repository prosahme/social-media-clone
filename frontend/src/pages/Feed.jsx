// src/pages/Feed.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/CreatePost";

const initialPosts = [
  {
    id: 1,
    username: "Eman",
    avatar: "/Avatar2.jpg",
    image: "/post1.jpg",
    caption: "Beautiful day to code something new 🌸",
  },
  {
    id: 2,
    username: "Mohammed",
    avatar: "/Avatar1.jpg",
    image: "/post2.jpg",
    caption: "Exploring the world of React 🚀",
  },
  {
    id: 3,
    username: "Lina",
    avatar: "/avatar3.jpg",
    image: "/post4.jpg",
    caption: "Coffee + Code = ❤️",
  },
];

const Feed = () => {
  const [posts, setPosts] = useState(initialPosts);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="feed-container">
      <CreatePost onPostCreated={handlePostCreated} />

      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          className="post-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="post-header">
            <img src={post.avatar} alt={post.username} className="avatar" />
            <h4>{post.username}</h4>
          </div>

          {post.image && (
            <motion.img
              src={post.image}
              alt="post"
              className="post-image"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          )}

          <p className="caption">{post.caption}</p>

          <div className="post-actions">
            <button>❤️ Like</button>
            <button>💬 Comment</button>
            <button>🔗 Share</button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Feed;
