import React, { useState } from "react";
import { FaHome, FaBell, FaEnvelope, FaUser, FaBars } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.jpg" alt="Logo" />
        <h1>AbEmX</h1>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <FaHome className="icon" title="Home" />
        <FaEnvelope className="icon" title="Message" />
        <FaBell className="icon" title="Notification" />
        <FaUser className="icon" title="profile" />
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>
    </nav>
  );
};

export default Navbar;
