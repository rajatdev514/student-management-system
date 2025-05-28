import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    localStorage.removeItem("role"); // Clear previous role (if any)

    // Email validation
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log("Fetched user role:", role);
        localStorage.setItem("role", role); // Store role in localStorage

        // Navigate based on role
        if (role === "student") navigate("/student");
        else if (role === "teacher") navigate("/teacher");
        else if (role === "principal") navigate("/principal");
        else navigate("/");
      } else {
        // Role not found in Firestore
        console.error("No user document found for UID:", user.uid);
        alert("User role not found.");
      }
    } catch (error) {
      // Authentication failed
      alert("Login failed.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-heading">Login</h2>
        <input
          type="email"
          className="login-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          Login
        </button>
        <p className="login-footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
