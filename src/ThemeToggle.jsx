import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if the user has a saved theme in localStorage on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Toggle theme and save the preference in localStorage
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    if (isDarkMode) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button onClick={toggleTheme} style={buttonStyle}>
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

const buttonStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  padding: "10px 20px",
  fontSize: "1rem",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  zIndex: 2,
};

export default ThemeToggle;
