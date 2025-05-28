import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Student.css";

const StudentDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    course: "",
    branch: "",
    phone: "",
    address: "",
    university: "",
    semester: "",
  });

  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      const { uid, email } = auth.currentUser;
      setEmail(email); // set default non-editable email

      try {
        const docRef = doc(db, "studentDetails", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to fetch student data:", err);
        toast.error("Failed to load data.");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, age, course, branch, phone, address, university, semester } =
      formData;
    if (
      !name ||
      !age ||
      !course ||
      !branch ||
      !phone ||
      !address ||
      !university ||
      !semester
    ) {
      toast.error("All fields are required.");
      return false;
    }

    const numericAge = Number(age);
    if (isNaN(numericAge) || numericAge < 15 || numericAge > 60) {
      toast.error("Age must be between 15 and 60.");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const uid = auth.currentUser?.uid;
    if (!uid) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      await setDoc(doc(db, "studentDetails", uid), {
        ...formData,
        email,
        submittedBy: uid,
      });
      toast.success("Details saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save details.");
    }
  };

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
    <div className="student-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit} className="student-form-container">
        <h2 className="student-form-title">Welcome to Student Dashboard</h2>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="student-form-input"
        />
        <input
          name="age"
          placeholder="Age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          className="student-form-input"
        />
        <input
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          className="student-form-input"
        />
        <input
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
          className="student-form-input"
        />
        <input
          name="university"
          placeholder="University"
          value={formData.university}
          onChange={handleChange}
          className="student-form-input"
        />
        <input
          name="semester"
          placeholder="Semester"
          value={formData.semester}
          onChange={handleChange}
          className="student-form-input"
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="student-form-input"
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="student-form-input"
        />
        <input
          name="email"
          placeholder="Email"
          value={email}
          disabled
          className="student-form-input email-disabled"
        />

        <div className="button-group">
          <button type="submit" className="student-form-button">
            Save
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="student-form-button-logout"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentDashboard;
