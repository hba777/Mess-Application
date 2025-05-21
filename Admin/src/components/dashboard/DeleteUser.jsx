import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteUser = () => {
  const [cmsId, setCmsId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);

  const handleDeleteRequest = (e) => {
    e.preventDefault();
    if (!cmsId) {
      toast.error("Please enter a User ID");
      return;
    }
    setShowFirstConfirm(true);
  };

  const proceedToSecondConfirm = () => {
    setShowFirstConfirm(false);
    setShowSecondConfirm(true);
  };

  const confirmDelete = async () => {
    setShowSecondConfirm(false);
    setLoading(true);

    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.delete(`http://localhost:5000/api/admin/user/${cmsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User deleted successfully");
      setCmsId("");
    } catch (err) {
      const msg = err.response?.data?.message || "Error deleting user";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 relative max-w-3xl min-h-full mx-auto">
      {/* Go Back + Header */}
      <div className="p-4 max-w-3xl mx-auto relative">
        <button
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md absolute left-0 border border-slate-200"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
        <h1 className="text-3xl font-bold font-serif text-center w-full text-slate-200">
          Delete User
        </h1>
      </div>

      {/* Main Form */}
      <div className="space-y-4">
        <div className="bg-slate-200 p-4 rounded-lg shadow-md flex flex-col items-center">
          <form onSubmit={handleDeleteRequest} className="w-full max-w-md">
            <div className="mb-4 w-full">
              <label htmlFor="cms_id" className="block text-gray-700">
                User ID
              </label>
              <input
                id="cms_id"
                type="text"
                value={cmsId}
                onChange={(e) => setCmsId(e.target.value)}
                required
                className="w-full mt-1 border border-gray-400 p-2 rounded bg-slate-100"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2 sm:gap-4 justify-center">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showFirstConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Are you sure you want to delete this user? All bill data will also be lost forever.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowFirstConfirm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={proceedToSecondConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {showSecondConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <p className="text-lg font-medium text-gray-800 mb-4">
              This action is irreversible. Confirm again to delete the user.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSecondConfirm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default DeleteUser;
