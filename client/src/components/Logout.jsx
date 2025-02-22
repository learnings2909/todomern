import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./utils/auth"; // Import logout function

const TodoPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear the token from localStorage
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TodoPage;
