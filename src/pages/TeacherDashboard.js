import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Teacher.css";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const TeacherDashboard = () => {
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
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <div className="teacher-dashboard">
      <h2>Welcome to Teacher Dashboard</h2>
      <div className="teacher-card-container">
        {students.map((student, index) => (
          <div key={index} className="teacher-card">
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
              <strong>Phone:</strong> {student.phone}
            </p>
            <p>
              <strong>Address:</strong> {student.address}
            </p>
            <p>
              <strong>University:</strong> {student.university}
            </p>
            <p>
              <strong>Semester:</strong> {student.semester}
            </p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="teacher-logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default TeacherDashboard;
