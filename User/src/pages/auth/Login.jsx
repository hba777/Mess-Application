import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase"; // Adjust this import based on your firebase config
import { ToastContainer,toast } from 'react-toastify';
import logo from "../../assets/MCS.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pushToken, setPushToken] = useState(""); // Assuming you have a method to get the push token
  const [role, setRole] = useState("user"); // Default role is user, can be changed as needed
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  // Validate email format
  const _validateEmail = (email) =>
    email && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // Validate password length
  const _validatePassword = (password) => password && password.length >= 6;

  const login = async (email, role, pushToken) => {
    console.log("Login attempt:", email, password);
    setIsLoading(true);
  
    try {
      // Validate email and password
      if (!_validateEmail(email)) {
        setError("Please enter a valid email.");
        setIsLoading(false);
        return;
      }
  
      if (!_validatePassword(password)) {
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
      }
  
      const auth = getAuth();
  
      // Check if the user is authenticated
      if (auth.currentUser) {
        console.log("User already authenticated:", auth.currentUser.email);
        await ensureFirestoreData(auth.currentUser, role, pushToken);
        await getSelfInfo();
        _navigateBasedOnRole();
        setIsLoading(false);
        return;
      }
  
      try {
        // Try to create a new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        console.log("User created successfully:", user.uid);
  
        if (!user.emailVerified) {
          await sendEmailVerification(user);
          toast.info("Verification email sent. Please check your inbox.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsLoading(false);
          return;
        }
  
        // Create Firestore entry for the user
        await ensureFirestoreData(user, role, pushToken);
  
        await getSelfInfo();
        _navigateBasedOnRole();
        setIsLoading(false);
      } catch (createError) {
        console.log("Error creating user, attempting to sign in...");
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
  
          if (!user.emailVerified) {
            await sendEmailVerification(user);
            setError("Verification email sent. Please check your email and verify your account.");
            setIsLoading(false);
            return;
          }
  
          // Ensure Firestore data exists
          await ensureFirestoreData(user, role, pushToken);
  
          await getSelfInfo();
          _navigateBasedOnRole();
          setIsLoading(false);
        } catch (e) {
          if (e.code === "auth/wrong-password") {
            setError("Incorrect password.");
          } else {
            setError(`Error: ${e.message}`);
          }
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.log("Login error:", e);
      setError(`Error: ${e}`);
      setIsLoading(false);
    }
  };
  
  const ensureFirestoreData = async (user, role, pushToken) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
  
    if (!userDoc.exists()) {
      const time = Date.now().toString();
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        role: role || "user", // Default to "user"
        created_at: time,
        pushToken: pushToken || "",
      });
      console.log("User data created in Firestore.");
    } else {
      console.log("User data already exists in Firestore.");
    }
  };  

  const getSelfInfo = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data:", userData);
        return userData;
      } else {
        throw new Error("User data not found.");
      }
    }
  };

  const _navigateBasedOnRole = async () => {
    try {
      const userData = await getSelfInfo();
      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "user") {
        navigate("/user");
      } else {
        setError("User role is not defined.");
      }
    } catch (e) {
      console.error("Navigation error:", e);
      setError(`Error: ${e}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    login(email, role, pushToken);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer/>
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin mx-auto" />
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
