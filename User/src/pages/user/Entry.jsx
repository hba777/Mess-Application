import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MessBillEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(location.state?.formData || {
    cms_id: "", // Should be number if possible
    rank: "",
    name: "",
    course: "",
    m_subs: 0.0,
    saving: 0.0,
    c_fund: 0.0,
    messing: 0.0,
    e_messing: 0.0,
    sui_gas_per_day: 0.0,
    sui_gas_25_percent: 0.0,
    tea_bar_mcs: 0.0,
    dining_hall_charges: 0.0,
    swpr: 0.0,
    laundry: 0.0,
    gar_mess: 0.0,
    room_maint: 0.0,
    elec_charges_160_block: 0.0,
    internet: 0.0,
    svc_charges: 0.0,
    sui_gas_boqs: 0.0,
    sui_gas_166_cd: 0.0,
    sui_gas_166_block: 0.0,
    lounge_160: 0.0,
    rent_charges: 0.0,
    fur_maint: 0.0,
    sui_gas_elec_fts: 0.0,
    mat_charges: 0.0,
    hc_wa: 0.0,
    gym: 0.0,
    cafe_maint_charges: 0.0,
    dine_out: 0.0,
    payamber: 0.0,
    student_societies_fund: 0.0,
    dinner_ni_jscmcc_69: 0.0,
    current_bill: 0.0,
    arrear: 0.0,
    receipt_no: "",
    amount_received: 0.0,
    gTotal: 0.0,
    balAmount: 0.0,
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    const numericFields = [
      "m_subs",
      "saving",
      "c_fund",
      "messing",
      "e_messing",
      "sui_gas_per_day",
      "sui_gas_25_percent",
      "tea_bar_mcs",
      "dining_hall_charges",
      "swpr",
      "laundry",
      "gar_mess",
      "room_maint",
      "elec_charges_160_block",
      "internet",
      "svc_charges",
      "sui_gas_boqs",
      "sui_gas_166_cd",
      "sui_gas_166_block",
      "lounge_160",
      "rent_charges",
      "fur_maint",
      "sui_gas_elec_fts",
      "mat_charges",
      "hc_wa",
      "gym",
      "cafe_maint_charges",
      "dine_out",
      "payamber",
      "student_societies_fund",
      "dinner_ni_jscmcc_69",
      "current_bill",
      "arrear",
      "amount_received",
    ];
  
    if (numericFields.includes(name)) {
      // Disallow invalid characters such as `e`, `E`, `-`, `+`, etc.
      if (/^\d*\.?\d*$/.test(value)) {
        setErrorMessages((prev) => ({ ...prev, [name]: "" }));
        const updatedValue = parseFloat(value);
        const updatedFormData = { ...formData, [name]: updatedValue };
  
        // Recalculate gTotal
        const gTotal = numericFields.reduce(
          (total, field) => total + (parseFloat(updatedFormData[field]) || 0),
          0
        );
  
        setFormData({ ...updatedFormData, gTotal });
      } else {
        setErrorMessages((prev) => ({
          ...prev,
          [name]: "Please enter a valid positive number.",
        }));
      }
      return;
    }
  
    const charFields = ["rank", "name"];
    if (charFields.includes(name)) {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setErrorMessages((prev) => ({ ...prev, [name]: "" }));
        setFormData({ ...formData, [name]: value });
      } else {
        setErrorMessages((prev) => ({
          ...prev,
          [name]: "Please enter only alphabetic characters.",
        }));
      }
      return;
    }
  
    setFormData({ ...formData, [name]: value });
  };

  const handleReviewNav = (e) => {
    e.preventDefault();

    // List of required fields
    const requiredFields = [
      "cms_id",
      "rank",
      "name",
      "course",
      "receipt_no",
      "current_bill",
    ];
  
    // Check for missing fields
    const missingFields = requiredFields.filter(
      (field) => !formData[field]
    );
  
    if (missingFields.length > 0) {
      // Set error messages for missing fields
      const newErrorMessages = {};
      missingFields.forEach((field) => {
        newErrorMessages[field] = "This field is required.";
      });
      setErrorMessages((prev) => ({
        ...prev,
        ...newErrorMessages,
        general: "Please fill in all mandatory fields.",
      }));
      return;
    }
  
    // Proceed with form submission logic
    console.log("All required fields are present");

    const selectedKeys = [
      "m_subs",
      "saving",
      "c_fund",
      "messing",
      "e_messing",
      "sui_gas_per_day",
      "sui_gas_25_percent",
      "tea_bar_mcs",
      "dining_hall_charges",
      "swpr",
      "laundry",
      "gar_mess",
      "room_maint",
      "elec_charges_160_block",
      "internet",
      "svc_charges",
      "sui_gas_boqs",
      "sui_gas_166_cd",
      "sui_gas_166_block",
      "lounge_160",
      "rent_charges",
      "fur_maint",
      "sui_gas_elec_fts",
      "mat_charges",
      "hc_wa",
      "gym",
      "cafe_maint_charges",
      "dine_out",
      "payamber",
      "student_societies_fund",
      "dinner_ni_jscmcc_69",
      "current_bill",
      "arrear",
    ];

    console.log("Calculating total for selected keys:", selectedKeys);

    const calculatedTotal = selectedKeys.reduce((sum, key) => {
      const value = parseFloat(formData[key] || 0);
      console.log(`Adding ${key}:`, value);
      return sum + value;
    }, 0);

    console.log("Calculated total amount:", calculatedTotal);

    const amountReceived = parseFloat(formData.amount_received || 0);
    console.log("Amount received:", amountReceived);

    const balanceAmount = calculatedTotal - amountReceived;
    console.log("Balance amount:", balanceAmount);

    const newEntry = {
      ...formData,
      gTotal: calculatedTotal,
      balAmount: balanceAmount,
    };

    console.log("New entry to be sent:", newEntry);

    setTimeout(() => setSubmissionMessage(null), 5000);

    navigate("/reviewBill", { state: { formData } });
  };

  return (
    <div className="p-5 bg-slate-800 min-h-screen">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/userDashboard')} 
          className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg mr-4"
        >
          Back
        </button>
        <h1 className="text-4xl font-bold text-white text-center flex-grow">
          Mess Bill Entry
        </h1>
      </div>
  
      <form onSubmit={handleReviewNav} className="grid gap-5 max-w-4xl mx-auto grid-cols-1 md:grid-cols-2">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="font-semibold text-gray-300 mb-1">
              {key
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
              :
            </label>
            <input
              type={
                key === "receipt_no" ||
                ["rank", "name", "course", "current_bill"].includes(key)
                  ? "text"
                  : "number"
              }
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required={[
                "cms_id",
                "rank",
                "name",
                "course",
                "receipt_no",
                "current_bill",
              ].includes(key)}
              className="p-2 border border-gray-600 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessages[key] && (
              <span className="text-red-500 text-sm mt-1">{errorMessages[key]}</span>
            )}
          </div>
        ))}
  
        <div className="md:col-span-2">
          <button
            className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700"
            type="submit"
          >
            Review Bill
          </button>
        </div>
  
        {submissionMessage && (
          <div
            className={`md:col-span-2 mt-4 py-2 px-4 rounded-lg text-center ${
              submissionMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submissionMessage.text}
          </div>
        )}
      </form>

      
    </div>
  );
  
};

export default MessBillEntry;
