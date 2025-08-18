import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <section className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>
            Welcome to <span>AbEmX</span>
          </h1>
          <p>Connect, share, and engage with the world in a unique way.</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="explore-btn"
            onClick={() => navigate("/feed")}
          >
            Explore Now
          </motion.button>
        </motion.div>

        <motion.img
          src="/hero.jpg"
          alt="Social media concept"
          className="hero-image"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
        />
      </section>

      {/* Features Section */}
      <section className="features">
        <motion.div
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h3>🌍 Connect</h3>
          <p>Stay connected with friends and communities worldwide.</p>
        </motion.div>
        <motion.div
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h3>📸 Share</h3>
          <p>Post your thoughts, images, and stories effortlessly.</p>
        </motion.div>
        <motion.div
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h3>💬 Engage</h3>
          <p>Interact with trending topics and conversations.</p>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
