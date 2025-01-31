import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleAddUser = () => {
    navigate("/admin/adduser"); // Navigate to add user page
  };

  const handleSendBill = () => {
    navigate("/admin/sendBill"); // Navigate to send bill page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome, Admin!</h1>
      <p className="text-lg text-gray-600 mb-4">
        Manage users, send bills, and more.
      </p>

      {/* Buttons in one line */}
      <div className="flex space-x-4">
        <button
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-6 py-3 rounded-md border border-blue-700 hover:bg-blue-700 transition"
        >
          Add User
        </button>
        <button
          onClick={handleSendBill}
          className="bg-green-600 text-white px-6 py-3 rounded-md border border-green-700 hover:bg-green-700 transition"
        >
          Send Bill
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-3 rounded-md border border-red-700 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
