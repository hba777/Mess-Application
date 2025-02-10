// src/components/UserBill.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const UserBill = () => {
  const [bill, setBill] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  // Fetch bill data from the backend
  // useEffect(() => {
  //   const fetchBill = async () => {
  //     try {
  //       const response = await axios.get('/api/bills/user/123'); // Replace with actual user ID or dynamic value
  //       setBill(response.data);
  //     } catch (err) {
  //       setError('Failed to fetch bill details.');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchBill();
  // }, []);

  // Handle file upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setReceipt(acceptedFiles[0]);
    },
  });

  const handleGenerateBillNavigation = () => {
    navigate("/addBill"); // Navigate back to the admin page
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!receipt) {
      alert("Please upload a receipt image.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", receipt);
    formData.append("billId", bill.id); // Include bill ID for reference

    // try {
    //   const response = await axios.post('/api/bills/submit-receipt', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   alert('Receipt submitted successfully!');
    //   setBill({ ...bill, status: 'Paid' }); // Update bill status locally
    // } catch (err) {
    //   alert('Failed to submit receipt. Please try again.');
    // }
  };

  if (isLoading) return <p>Loading bill details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleGenerateBillNavigation}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Generate Bill
        </button>
        <h1 className="text-2xl font-bold text-white">Your Bill Details</h1>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <span className="font-medium">CMIS ID:</span> cmisId
            </p>
            <p>
              <span className="font-medium">Rank:</span> rank
            </p>
            <p>
              <span className="font-medium">Name:</span> name
            </p>
            <p>
              <span className="font-medium">Course:</span> course
            </p>
            <p>
              <span className="font-medium">Ser No:</span> serNo
            </p>
          </div>
        </div>
  
        {/* Bill Breakdown */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Bill Breakdown</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>Messing</p>
              <p>Rs: 5799</p>
            </div>
            {/* Repeat similar blocks for other charges */}
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>Rs: 50000</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Arrear:</span>
              <span>Rs: 28000</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Grand Total:</span>
              <span>Rs: 78000</span>
            </p>
          </div>
        </div>
  
        {/* Payment Status */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
          <p>Pending</p>
        </div>
  
        {/* Upload Receipt */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
          <div className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer">
            <input type="file" className="hidden" />
            <p>Drag & drop a receipt image here, or click to select one.</p>
          </div>
        </div>
  
        {/* Submit Button */}
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Submit Receipt
        </button>
      </div>
    </div>
  );
  
};

export default UserBill;
