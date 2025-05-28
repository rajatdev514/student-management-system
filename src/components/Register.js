import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [role, setRole] = useState("student"); // Default role is student
  const navigate = useNavigate(); // Hook for navigation

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Email format validation
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Password validation (at least 6 characters)
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Create user using Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user role and email in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
      });
      console.log("User role saved successfully:", role);

      localStorage.setItem("role", role); // Store role locally for use after login

      // Navigate based on selected role
      if (role === "student") navigate("/student");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "principal") navigate("/principal");
      else navigate("/");
    } catch (err) {
      // Handle errors during registration
      console.error("Registration error:", err);
      alert("Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2 className="register-heading">Register</h2>
        <input
          type="email"
          className="register-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="register-input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="register-select"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="principal">Principal</option>
        </select>
        <button type="submit" className="register-button">
          Register
        </button>
        <p className="register-footer-text">
          Already have an account?{" "}
          <Link to="/" className="register-link">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
