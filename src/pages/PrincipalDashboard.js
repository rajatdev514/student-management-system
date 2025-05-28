import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Principal.css";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const PrincipalDashboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "studentDetails"));
        const studentData = querySnapshot.docs.map((doc) => doc.data());
        setStudents(studentData);
      } catch (error) {
        console.error("Failed to fetch student details:", error);
      }
    };

    fetchDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      window.location.reload(); // or navigate to login page
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="principal-dashboard">
      <h2>Welcome to Principal Dashboard</h2>
      <div className="principal-card-container">
        {students.map((student, index) => (
          <div key={index} className="principal-card">
            <h4>{student.name}</h4>
            <p>
              <strong>Age:</strong> {student.age}
            </p>
            <p>
              <strong>Course:</strong> {student.course}
            </p>
            <p>
              <strong>Branch:</strong> {student.branch}
            </p>
            <p>
              <strong>Branch:</strong> {student.phone}
            </p>
            <p>
              <strong>Branch:</strong> {student.address}
            </p>
            <p>
              <strong>Branch:</strong> {student.university}
            </p>
            <p>
              <strong>Branch:</strong> {student.semester}
            </p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="principal-logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default PrincipalDashboard;
