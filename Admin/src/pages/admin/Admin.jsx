import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import AddBills from '../../components/dashboard/AddBills';
import VerifyBills from '../../components/dashboard/VerifyBills';
import Summary from '../../components/dashboard/Summary';
import Header from '../../components/Header/Header';
import DateComponent from '../../components/Date';



export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row border border-white rounded-sm m-0 bg-slate-200 min-h-screen">
      <Header />
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center border-2 border-slate-500 p-3 bg-slate-100">
          <DateComponent />
          <p className="font-semibold font-mono text-sm sm:text-base lg:text-lg">User Name here</p>
        </div>
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/addBills" element={<AddBills />} />
          <Route path="/verifyBills" element={<VerifyBills />} />
        </Routes>
      </div>
    </div>
  )
}
