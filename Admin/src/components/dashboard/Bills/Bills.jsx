// Bills.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    axios.get('http://localhost:5000/api/user/bills', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(response => {
        setBills(response.data.bills);
      })
      .catch(error => {
        console.error('Error fetching bills:', error);
      });
  }, []);

  const filteredBills = bills.filter(bill =>
    bill.cms_id.toString().includes(searchTerm)
  );

  const handleCardClick = (formData) => {
    navigate('/viewBillDetails', { state: { formData } });
  };

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <button
        onClick={() => navigate('/adminDashboard')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4 text-white">Bills</h1>
      <input
        type="text"
        placeholder="Search by CMS ID"
        className="mb-4 p-2 border border-gray-300 rounded"
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBills.map(bill => (
          <div
            key={bill.id}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
            onClick={() => handleCardClick(bill)}
          >
            <h2 className="text-xl font-semibold text-gray-800">{bill.name}</h2>
            <p className="text-gray-600">CMS ID: {bill.cms_id}</p>
            <p className="text-gray-600">Total Amount: {bill.gTotal}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bills;
