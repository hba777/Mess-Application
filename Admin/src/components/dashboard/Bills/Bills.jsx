import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

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

  const billItems = [
    { label: "Mess Subs", key: "m_subs" },
    { label: "Offrs Saving", key: "saving" },
    { label: "Regt Subs (C/Fund)", key: "c_fund" },
    { label: "Messing", key: "messing" },
    { label: "Extra Messing", key: "e_messing" },
    { label: "Sui Gas (Messing)", key: "sui_gas_per_day" },
    { label: "25% Gas (Extra Messing)", key: "sui_gas_25_percent" },
    { label: "Tea Bar (MCS)", key: "tea_bar_mcs" },
    { label: "Dining Hall (Electric Charges)", key: "dining_hall_charges" },
    { label: "Sweeper Wages", key: "swpr" },
    { label: "Laundry Charges", key: "laundry" },
    { label: "Gar Mess", key: "gar_mess" },
    { label: "Room Maintenance", key: "room_maint" },
    { label: "Electric Charges (160 Block)", key: "elec_charges_160_block" },
    { label: "Internet Charges", key: "internet" },
    { label: "Service Charges", key: "svc_charges" },
    { label: "Sui Gas (BOQs)", key: "sui_gas_boqs" },
    { label: "Sui Gas (166 CD)", key: "sui_gas_166_cd" },
    { label: "Sui Gas (166 Block)", key: "sui_gas_166_block" },
    { label: "Lounge (160 Block)", key: "lounge_160" },
    { label: "Rent Charges", key: "rent_charges" },
    { label: "Furniture Maintenance", key: "fur_maint" },
    { label: "Sui Gas & Electricity (FTS)", key: "sui_gas_elec_fts" },
    { label: "Material Charges", key: "mat_charges" },
    { label: "HC/WA Charges", key: "hc_wa" },
    { label: "Gym Subscription", key: "gym" },
    { label: "Café Maintenance (MCS)", key: "cafe_maint_charges" },
    { label: "Dine Out", key: "dine_out" },
    { label: "Payamber Fund", key: "payamber" },
    { label: "Student Societies Fund", key: "student_societies_fund" },
    { label: "Dinner (NI/JSCMCC-69)", key: "dinner_ni_jscmcc_69" },
    { label: "1-Link Bill ID", key: "BILL_ID_LABEL" },
    { label: "Amount Received", key: "amount_received" },
    { label: "Balance Amount", key: "balamount" },
  ];

  const exportToExcel = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const data = bills.map((bill, index) => {
      let formattedBill = { SerNo: index + 1 };
      billItems.forEach(({ label, key }) => {
        formattedBill[label] = bill[key] || '';
      });
      return formattedBill;
    });

    const worksheet = XLSX.utils.json_to_sheet([{}]);
    XLSX.utils.sheet_add_aoa(worksheet, [[`Bills for ${currentMonth}`]], { origin: "A1", font: { bold: true } });
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(data[0] || {}).length } }];
    XLSX.utils.sheet_add_json(worksheet, data, { origin: "A3", skipHeader: false });
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills');
    XLSX.writeFile(workbook, `${currentMonth} Bill.xlsx`);
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
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by CMS ID"
          className="p-2 border border-gray-300 rounded"
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBills.map((bill, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
            onClick={() => handleCardClick(bill)}
          >
            {/* <h2 className="text-xl font-semibold text-gray-800">{bill.name}</h2> */}
            <h2 className="text-xl font-semibold text-gray-800">CMS ID: {bill.cms_id}</h2>
            {/* <p className="text-gray-600">CMS ID: {bill.cms_id}</p> */}
            <p className="text-gray-600">Total Amount: {bill.gtotal}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bills;
