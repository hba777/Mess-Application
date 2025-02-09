import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MessBillEntry = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const [formData, setFormData] = useState({
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
    console.log("Form submitted:", formData);

    if (
      !formData.cms_id ||
      !formData.rank ||
      !formData.name ||
      !formData.course ||
      !formData.receipt_no ||
      !formData.current_bill ||
      formData.current_bill == 0.0
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

    setTimeout(() => setSubmissionMessage(null), 5000);

    navigate("/reviewBill", { state: { formData } });
  };

  return (
    <div className="p-5">
      <h1 className="text-4xl text-center mb-8 font-bold">Mess Bill Entry</h1>

      <form onSubmit={handleReviewNav} className="grid gap-5 max-w-lg mx-auto">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="font-semibold text-gray-700">
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
              className="p-2 border border-gray-300 rounded-lg"
            />
            {errorMessages[key] && (
              <span className="text-red-500 text-sm">{errorMessages[key]}</span>
            )}
          </div>
        ))}

        <button
          className="mt-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600"
          type="submit"
        >
          Review Bill
        </button>

        {submissionMessage && (
          <div
            className={`mt-4 py-2 px-4 rounded-lg text-center ${
              submissionMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submissionMessage.text}
          </div>
        )}
      </form>

      <h2 className="text-3xl text-center mt-8 mb-4">Entries</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            {Object.keys(formData).map((key) => (
              <th key={key} className="border px-4 py-2">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index} className="border-t">
              {Object.keys(entry).map((key) => (
                <td key={key} className="border px-4 py-2">
                  {entry[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleLogout}
        className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default MessBillEntry;
