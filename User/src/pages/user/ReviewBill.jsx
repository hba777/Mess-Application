import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

function DetailComponent() {
  const location = useLocation();
  const { formData } = location.state;

  const navigate = useNavigate();

  const handleBackNav = ()=>{
    navigate("/addBill");
  }
  const [errorMessages, setErrorMessages] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    if (
        !formData.cms_id ||
        !formData.rank ||
        !formData.name ||
        !formData.course ||
        !formData.receipt_no ||
        !formData.current_bill || formData.current_bill == 0.0
    ) {
        console.error("Validation failed: Missing required fields");
        setErrorMessages((prev) => ({
            ...prev,
            general: "Please fill in all mandatory fields.",
        }));
        return;
    }

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

    try {
        const token = localStorage.getItem("token");
        console.log("Retrieved token:", token);

        const response = await fetch("http://localhost:5000/api/user/bill", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newEntry),
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
            const responseBody = await response.text();
            console.error("Server error:", responseBody);
            throw new Error("Failed to send data to the server: " + responseBody);
        }

        console.log("Data successfully sent to server");

        setErrorMessages({});

        setSubmissionMessage({
            type: "success",
            text: "Entry successfully added to the database.",
        });
    } catch (error) {
        console.error("Error in submitting data:", error);
        setSubmissionMessage({
            type: "error",
            text: "Failed to add entry to the server: " + error.message,
        });
    }

    setTimeout(() => setSubmissionMessage(null), 5000);
};
  return (
    <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Receipt</h2>

      {/* Personal Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="font-medium">CMS ID:</span>
            <span>{formData.cms_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Rank:</span>
            <span>{formData.rank}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Course:</span>
            <span>{formData.course}</span>
          </div>
        </div>
      </div>

      {/* Financial Details Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Financial Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            key !== 'cms_id' && key !== 'rank' && key !== 'name' && key !== 'course' && (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{formatLabel(key)}:</span>
                <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
              </div>
            )
          ))}
        </div>
      </div>

      <button
          onClick={handleSubmit}
          className="mt-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600"
        >
          Add Entry
        </button>

      <button onClick={handleBackNav} className="mt-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-green-600">Back</button>
    </div>
    
  );
}

// Helper function to format labels
function formatLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export default DetailComponent;
