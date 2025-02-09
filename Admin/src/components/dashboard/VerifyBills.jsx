import React, { useEffect, useState } from "react";
//import { getBills, verifyBill } from '../services/api';
import { useNavigate } from "react-router-dom";
import recipt from "../../assets/recipt.jpeg";

const VerifyBills = () => {
  const [bills, setBills] = useState([]);

  // useEffect(() => {
  //   const fetchBills = async () => {
  //     try {
  //       const response = await getBills();
  //       setBills(response.data);
  //     } catch (error) {
  //       console.error('Error fetching bills:', error);
  //     }
  //   };

  //   fetchBills();
  // }, []);

  const navigate = useNavigate();

  const handleVerify = async (billId, status) => {
    // try {
    //   await verifyBill(billId, status);
    //   alert(`Bill marked as ${status}`);
    //   setBills(bills.map(bill => bill.id === billId ? { ...bill, status } : bill));
    // } catch (error) {
    //   console.error('Error verifying bill:', error);
    // }
  };

  const handleNavigateBack = () => {
    navigate("/adminDashboard");
  };

  return (
    // <div className="p-4">
    //   <h1 className="text-2xl font-bold mb-4">Verify Bills</h1>
    //   <div className="space-y-4">
    //     {bills.map((bill) => (
    //       <div key={bill.id} className="bg-white p-4 rounded-lg shadow-md">
    //         <h2 className="text-lg font-semibold">{bill.name}</h2>
    //         <p className="text-gray-600">Amount: Rs {bill.amount}</p>
    //         <img src={bill.receiptImage} alt="Receipt" className="w-32 h-32 object-cover mt-2" />
    //         <div className="mt-2">
    //           <button
    //             onClick={() => handleVerify(bill.id, 'Paid')}
    //             className="bg-green-500 text-white p-2 rounded mr-2"
    //           >
    //             Mark as Paid
    //           </button>
    //           <button
    //             onClick={() => handleVerify(bill.id, 'Unpaid')}
    //             className="bg-red-500 text-white p-2 rounded"
    //           >
    //             Mark as Unpaid
    //           </button>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>

    <div className="p-4 relative max-w-3xl min-h-full mx-auto">
      <div className="p-4 max-w-3xl mx-auto relative">
      <button 
        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md absolute left-0 border border-slate-200"
        onClick={handleNavigateBack}
      >
        Go Back
      </button>
        <h1 className="text-3xl font-bold font-serif text-center w-full text-slate-200">Verify Bill</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg text-gray-600 font-bold">Student Name : <span className="font-normal ">Husnain Anwar</span></h2>
          <p className="text-gray-600 font-bold">Amount : <span className="font-normal">Rs 3300</span></p>
          <img
            src= {recipt}
            alt="Receipt"
            className=" object-cover  mt-2"
          />
          <div className="mt-2 flex flex-wrap gap-2 sm:gap-4 justify-center">
            <button
              //onClick={() => handleVerify(bill.id, 'Paid')}
              className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-green-600"
            >
              Mark as Paid
            </button>
            <button
              //onClick={() => handleVerify(bill.id, 'Unpaid')}
              className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-600"
            >
              Mark as Unpaid
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default VerifyBills;
