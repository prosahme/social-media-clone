import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {token && <Navbar />}
      <Routes></Routes>
    </Router>
  );
}

export default App;
