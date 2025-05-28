import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // clean up listener
  }, []);

  const storedRole = localStorage.getItem("role");

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!user || storedRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
