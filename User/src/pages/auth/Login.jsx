import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from 'react-toastify';
// import logo from "../../assets/MCS.jpg";
import logo from "../../assets/MCSBackgroundRemoved.png";

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

      navigate("/userDashboard");
    }catch(e){ 
      console.error("Login error:", e);
      setError(`Error: ${e}`);
     }
  };

  // const _navigateBasedOnRole = async () => {
  //   try {
  //     const userData = await getSelfInfo();
  //     if (userData.role === "admin") {
  //       navigate("/admin");
  //     } else if (userData.role === "user") {
  //       navigate("/user");
  //     } else {
  //       setError("User role is not defined.");
  //     }
  //   } catch (e) {
  //     console.error("Navigation error:", e);
  //     setError(`Error: ${e}`);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    login(email, role, pushToken);
  };

  return (
  //   <div className="flex items-center justify-center h-screen bg-gray-100">
  //     <ToastContainer/>
  //     <div className="bg-white shadow-lg rounded-lg p-8 w-96">
  //       <div className="flex justify-center mb-6">
  //         <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
  //       </div>

  //       <form onSubmit={handleSubmit}>
  //         <div className="mb-4">
  //           <label
  //             htmlFor="email"
  //             className="block text-gray-700 font-bold mb-2"
  //           >
  //             Email
  //           </label>
  //           <input
  //             type="email"
  //             id="email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             placeholder="Enter your email"
  //           />
  //         </div>
  //         <div className="mb-4">
  //           <label
  //             htmlFor="password"
  //             className="block text-gray-700 font-bold mb-2"
  //           >
  //             Password
  //           </label>
  //           <input
  //             type="password"
  //             id="password"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             placeholder="Enter your password"
  //           />
  //         </div>
  //         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
  //         <button
  //           type="submit"
  //           className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           disabled={isLoading} // Disable button when loading
  //         >
  //           {isLoading ? (
  //             <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin mx-auto" />
  //           ) : (
  //             'Login'
  //           )}
  //         </button>
  //       </form>
  //     </div>
  //   </div>

  <div className="flex flex-col items-center align-top pt-2 h-screen bg-gradient-to-b from-gray-900 to-gray-700">
      <ToastContainer/>
      <h3 className="font-semibold text-slate-200 text-2xl sm:text-2xl lg:text-3xl font-serif">MCS <span className="px-1">BILLING</span> SYSTEM</h3>
      <div className="flex-grow flex items-center justify-center">
      <div className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-lg p-8 w-96 border border-gray-600">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-300 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-300 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
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
    </div>
  );
};

export default LoginPage;
