import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Utility function to calculate totals
const calculateTotals = (formData) => {
  // Fields that make up the current bill
  const chargeFields = [
    "m_subs", "saving", "c_fund", "messing", "e_messing",
    "sui_gas_per_day", "sui_gas_25_percent", "tea_bar_mcs",
    "dining_hall_charges", "swpr", "laundry", "gar_mess",
    "room_maint", "elec_charges_160_block", "internet",
    "svc_charges", "sui_gas_boqs", "sui_gas_166_cd",
    "sui_gas_166_block", "lounge_160", "rent_charges",
    "fur_maint", "sui_gas_elec_fts", "mat_charges",
    "hc_wa", "gym", "cafe_maint_charges", "dine_out",
    "payamber", "student_societies_fund", "dinner_ni_jscmcc_69"
  ];

  // Always calculate fresh
  const currentBill = chargeFields.reduce((sum, key) => {
    return sum + (parseFloat(formData[key]) || 0);
  }, 0);

  const arrear = parseFloat(formData.arrear) || 0;
  const gtotal = currentBill + arrear;

  const amountReceived = parseFloat(formData.amount_received) || 0;
  const balamount = gtotal - amountReceived;

  return {
    ...formData,
    current_bill: currentBill.toFixed(2),
    gtotal,
    balamount,
  };
};


const getDefaultFormData = () => ({
  cms_id: "",
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
  gtotal: 0.0,
  balamount: 0.0,
});

const getStoredFormData = () => {
  const savedData = localStorage.getItem("userBill");
  if (!savedData) return null;

  const parsedData = JSON.parse(savedData);

  const { gtotal, balamount, rank, name, ...rest } = parsedData;

  // Force reset totals before passing to calculator
  return calculateTotals({
    ...rest,
    gtotal: 0,
    balamount: 0,
  });
};

const MessBillEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(() => {
    // Don't calculate totals here yet — we'll do it in useEffect
    return (
      location.state?.formData || getStoredFormData() || getDefaultFormData()
    );
  });

  useEffect(() => {
    const isStored = !location.state?.formData && getStoredFormData();
    if (!isStored || !formData.cms_id) return;

    const fetchPendingAmount = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/pending-amounts/${formData.cms_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let arrear = 0;
        if (response.ok) {
          const data = await response.json();
          console.log("Pending amount data:", data);
          arrear = data.pending_amount || 0;
        } else {
          console.warn("Failed to fetch pending amount. Defaulting to 0.");
        }

        let updated = {
          ...formData,
          arrear,
          gtotal: 0,
          balamount: 0,
        };

        // 💡 If arrear is 0, then reset totals to 0
        if (arrear == 0) {
          updated = {
            ...updated,
            gtotal: 0,
            balamount: 0,
          };
        }

        setFormData(calculateTotals(updated));
      } catch (err) {
        console.error("Error fetching pending amount", err);
      }
    };

    fetchPendingAmount();
  }, []);

  const [errorMessages, setErrorMessages] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert numeric fields to number
    const numberFields = [
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

    const parsedValue = numberFields.includes(name)
      ? parseFloat(value) || 0
      : value;

    const updatedData = {
      ...formData,
      [name]: parsedValue,
      gtotal: 0,
      balamount: 0,
      arrear: formData.arrear || 0,
    };

    setFormData(calculateTotals(updatedData));
  };

  const handleReviewNav = async (e) => {
    e.preventDefault();

    const requiredFields = ["cms_id", "course"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
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

    
    navigate("/reviewBill", { state: { formData: formData } });
  };

  const handleNavigateToDashboard = () => {
    localStorage.removeItem("userBill"); // Clears local storage userBill
    navigate("/userDashboard");
  };

  return (
    <div className="p-5 bg-slate-800 min-h-screen">
      <div className="flex items-center mb-8">
        <button
          onClick={() => handleNavigateToDashboard()}
          className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg mr-4"
        >
          Back
        </button>
        <h1 className="text-4xl font-bold text-white text-center flex-grow">
          Mess Bill Entry
        </h1>
      </div>

      <form
        onSubmit={handleReviewNav}
        className="grid gap-5 max-w-4xl mx-auto grid-cols-1 md:grid-cols-2"
      >
        {Object.keys(formData).map((key) => {
          if (["due_date", "created_at", "status", "receipt_no", "id"].includes(key))
            return null; // Skip these fields

          const isReadOnly = ["balAmount", "gTotal"].includes(key);

          return (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="font-semibold text-gray-300 mb-1">
                {key === "cms_id"
                  ? "User ID"
                  : key === "dinner_ni_jscmcc_69"
                  ? "Dinner Night"
                  : key
                      .replace(/([a-z])([A-Z])/g, "$1 $2")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                :
              </label>

              <input
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required={["cms_id", "course"].includes(key)}
                readOnly={isReadOnly}
                className={`p-2 border border-gray-600 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isReadOnly ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              />
              {errorMessages[key] && (
                <span className="text-red-500 text-sm mt-1">
                  {errorMessages[key]}
                </span>
              )}
            </div>
          );
        })}

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
