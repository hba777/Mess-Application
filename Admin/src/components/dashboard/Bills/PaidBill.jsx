import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaidBills = () => {
  const [paidBills, setPaidBills] = useState([]); // ✅ Ensure it's an array
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    axios.get('http://localhost:5000/api/pay/bill-payments', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(response => {
        setPaidBills(response.data || []); // ✅ Use response.data directly, fallback to []
      })
      .catch(error => {
        console.error('Error fetching paid bills:', error);
        setPaidBills([]); // ✅ Prevents future undefined issues
      });
  }, []);

  const filteredPaidBills = paidBills?.filter(bill =>
    bill.payer_cms_id?.toString().includes(searchTerm)
  ) || []; // ✅ Prevents undefined errors

  const handleCardClick = (formData) => {
    navigate('/paidBillDetails', { state: { formData } });
  };

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <button
        onClick={() => navigate('/adminDashboard')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4 text-white">Paid Bills</h1>
      <input
        type="text"
        placeholder="Search by User ID"
        className="mb-4 p-2 border border-gray-300 rounded"
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPaidBills.map(bill => (
          <div
            key={bill.id}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
            onClick={() => handleCardClick(bill)}
          >
            <h2 className="text-xl font-semibold text-gray-800">Receipt No: {bill.receipt_number}</h2>
            <p className="text-gray-600">Payer User ID: {bill.payer_cms_id}</p>
            <p className="text-gray-600">Payment Amount: {bill.payment_amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaidBills;
