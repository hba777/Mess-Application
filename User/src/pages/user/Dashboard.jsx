import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const UserBill = () => {
  const [cmsId, setCmsId] = useState("");
  const [bill, setBill] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchBill = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user/bills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.bills) {
        const matchedBill = response.data.bills.find((b) => b.cms_id.toString() === cmsId);
        if (matchedBill) {
          setBill(matchedBill);
          localStorage.setItem("userBill", JSON.stringify(matchedBill));
          handleGenerateBillNavigation();
        } else {
          setError("No bill found for the entered CMS ID.");
          setBill(null);
        }
      }
    } catch (err) {
      setError("Failed to fetch bills. Please try again.");
    }
    setIsLoading(false);
  };

  const handleGenerateBillNavigation = () => {
    navigate("/addBill");
  };

  return (
    <div className="p-6 bg-slate-800 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-white mb-6 mt-4">Welcome User</h1>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          value={cmsId}
          onChange={(e) => setCmsId(e.target.value)}
          placeholder="Enter CMS ID"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchBill}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Generate Bill
        </button>
      </div>

      {isLoading && <p className="text-white">Loading bill details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-x-6">
        <button
          onClick={handleGenerateBillNavigation}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Add New Bill
        </button>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserBill;