// src/components/UserBill.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const UserBill = () => {
  const [bill, setBill] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setReceipt(acceptedFiles[0]);
    },
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (!receipt) {
      alert('Please upload a receipt image.');
      return;
    }

    const formData = new FormData();
    formData.append('receipt', receipt);
    formData.append('billId', bill.id); // Include bill ID for reference

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Your Bill Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Bill Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><span className="font-medium">CMIS ID:</span> cmisId</p>
            <p><span className="font-medium">Rank:</span> rank</p>
            <p><span className="font-medium">Name:</span> name</p>
            <p><span className="font-medium">Course:</span> course</p>
            <p><span className="font-medium">Ser No:</span> serNo</p>
            {/* <p><span className="font-medium">CMIS ID:</span> {bill.cmisId}</p>
            <p><span className="font-medium">Rank:</span> {bill.rank}</p>
            <p><span className="font-medium">Name:</span> {bill.name}</p>
            <p><span className="font-medium">Course:</span> {bill.course}</p>
            <p><span className="font-medium">Ser No:</span> {bill.serNo}</p> */}
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Bill Breakdown</h2>
          <div className="space-y-2">

              <div className="flex justify-between">
                <p>Messing</p>
                <p>Rs : 5799</p>
              </div>
              <div className="flex justify-between">
                <p>Messing</p>
                <p>Rs : 5799</p>
              </div>
              <div className="flex justify-between">
                <p>Messing</p>
                <p>Rs : 5799</p>
              </div>
              <div className="flex justify-between">
                <p>Messing</p>
                <p>Rs : 5799</p>
              </div>
              <div className="flex justify-between">
                <p>Messing</p>
                <p>Rs : 5799</p>
              </div>
              <div className="flex justify-between">
                <p>Messing</p>
                <p>Rs : 5799</p>
              </div>
              <div className="flex justify-between">
                <p>Messing</p>
                <p>Rs : 5799</p>
              </div>
            {/* {bill.charges.map((charge, index) => (
              <div key={index} className="flex justify-between">
                <p>{charge.description}</p>
                <p>Rs {charge.amount}</p>
              </div>
            ))} */}
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>Rs : 50000</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Arrear:</span>
              <span>Rs : 28000</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Grand Total:</span>
              <span>Rs : 78000</span>
            </p>
          </div>
          {/* <div className="mt-4 border-t pt-4">
            <p className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>Rs {bill.total}</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Arrear:</span>
              <span>Rs {bill.arrear}</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Grand Total:</span>
              <span>Rs {bill.grandTotal}</span>
            </p>
          </div> */}
        </div>

        {/* Payment Status */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
          <p>
            Pending
          </p>
          {/* <p className={`text-lg font-medium ${bill.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
            {bill.status === 'Paid' ? 'Paid' : 'Pending'}
          </p> */}
        </div>

        {/* Upload Receipt */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
            <div className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer">
              <input />
                <p>Image here</p>
                <p>Drag & drop a receipt image here, or click to select one.</p>
            </div>
          </div>

        {/* {bill.status === 'Pending' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer">
              <input {...getInputProps()} />
              {receipt ? (
                <p>{receipt.name}</p>
              ) : (
                <p>Drag & drop a receipt image here, or click to select one.</p>
              )}
            </div>
          </div>
        )} */}

        {/* Submit Button */}

          <button
            // onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Submit Receipt
          </button>
          
        {/* {bill.status === 'Pending' && (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Submit Receipt
          </button>
        )} */}
      </div>
    </div>
  );
};

export default UserBill;