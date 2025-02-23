import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaidBillDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state;

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-6">
      <div className="max-w-lg w-full p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">Bill Details</h2>

        {/* Bill Details Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-2 px-4 border-b border-gray-600 text-gray-300">Details</th>
                <th className="py-2 px-4 border-b border-gray-600 text-right text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData)
                .filter(([key]) => key !== "id" && key !== "bill_id" && key !== "transaction_id")
                .map(([key, value], index) => (
                  <tr key={key} className={index % 2 === 0 ? "bg-gray-800" : ""}>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700 text-right">
                      {typeof value === "number" ? value.toFixed(2) : value}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaidBillDetails;