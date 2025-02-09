import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../../assets/MCSBackgroundRemoved.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const _validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const _validatePassword = (password) => password.length >= 6;

  const login = async () => {
    setIsLoading(true);
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
    navigate("/adminDashboard");
  };

  return (
    <div className="flex flex-col items-center pt-2 h-screen bg-gradient-to-b from-gray-900 to-gray-700">
      <ToastContainer />
      <h3 className="font-semibold text-slate-200 text-2xl font-serif">MCS <span className="px-1">BILLING</span> SYSTEM</h3>
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-lg p-8 w-96 border border-gray-600">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setError(""); login(); }}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 font-bold mb-2">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your email" />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-300 font-bold mb-2">Password</label>
              <input type={isPasswordVisible ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" placeholder="Enter your password" />
              <button type="button" className="absolute inset-y-0 mt-4 right-3 flex items-center text-gray-400 h-full" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={isLoading}>
              {isLoading ? <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin mx-auto" /> : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;