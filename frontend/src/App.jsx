import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Feed from "./pages/Feed";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;
