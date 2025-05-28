import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRbRabAihOp0QqtylgbXkHE6J01Mk-V_g",
  authDomain: "studentmanagement-ee028.firebaseapp.com",
  projectId: "studentmanagement-ee028",
  storageBucket: "studentmanagement-ee028.appspot.com",
  messagingSenderId: "991906434969",
  appId: "1:991906434969:web:ef8d5b9e0d2c0ae806cd08",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
