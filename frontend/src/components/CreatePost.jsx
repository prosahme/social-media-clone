// src/components/CreatePost.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiImage, FiSend } from "react-icons/fi";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    const newPost = {
      id: Date.now(),
      username: "Hayat",
      avatar: "/avatar4.jpg",
      content,
      image,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };

    onPostCreated(newPost);
    setContent("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <motion.div
      className="create-post"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-post-input"
        />

        {image && (
          <motion.img
            src={image}
            alt="Preview"
            className="create-post-preview"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          />
        )}

        <div className="create-post-actions">
          <label htmlFor="file-upload" className="upload-btn">
            <FiImage size={22} />
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          <motion.button
            type="submit"
            className="post-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSend size={20} />
            Post
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePost;
