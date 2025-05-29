import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnpaidConfirm, setShowUnpaidConfirm] = useState(false);
  const [secondDeleteConfirm, setSecondDeleteConfirm] = useState(false);
  const [secondUnpaidConfirm, setSecondUnpaidConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    axios
      .get("http://localhost:5000/api/user/bills", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setBills(response.data.bills);
      })
      .catch((error) => {
        console.error("Error fetching bills:", error);
      });
  }, []);

  const filteredBills = bills.filter((bill) =>
    bill.cms_id.toString().includes(searchTerm)
  );

  const handleCardClick = (formData) => {
    navigate("/viewBillDetails", { state: { formData } });
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
    { label: "Dinner Night", key: "dinner_ni_jscmcc_69" },
    { label: "1LINK Bill ID", key: "BILL_ID_LABEL" },
    { label: "Amount Received", key: "amount_received" },
    { label: "Balance Amount", key: "balamount" },
  ];

  const exportToExcel = async () => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const authToken = localStorage.getItem("authToken");
    const BILL_ID_VALUE = process.env.REACT_APP_BILL_ID_VALUE || "123456789"; // Default fallback

    try {
      // Fetch user details
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const users = await response.json(); // Expecting an array of user objects

      // Create a user lookup by cms_id
      const userLookup = {};
      users.forEach((user) => {
        userLookup[user.cms_id] = {
          phone_number: user.phone_number || "",
          link_id: user.link_id || BILL_ID_VALUE, // Use API link_id, fallback to BILL_ID_VALUE
        };
      });

      // Format data for Excel
      const data = bills.map((bill, index) => {
        const userData = userLookup[bill.cms_id] || {}; // Get user details or empty object

        let formattedBill = {
          SerNo: index + 1,
          "User ID": bill.cms_id || "",
          "Phone Number": userData.phone_number || "",
          "G.Total": bill.gtotal || "",
          "1LINK Bill ID": userData.link_id, // Use matched user's link_id
        };

        // Maintain the rest of the entries
        billItems.forEach(({ label, key }) => {
          if (!["BILL_ID_LABEL", "cms_id", "gtotal"].includes(key)) {
            formattedBill[label] = bill[key] || "";
          }
        });

        return formattedBill;
      });

      const worksheet = XLSX.utils.json_to_sheet([{}]);

      // Add title row
      XLSX.utils.sheet_add_aoa(worksheet, [[`Bills for ${currentMonth}`]], {
        origin: "A1",
      });

      // Merge title row across columns
      worksheet["!merges"] = [
        {
          s: { r: 0, c: 0 },
          e: { r: 0, c: Object.keys(data[0] || {}).length },
        },
      ];

      // Add data starting from row 3
      XLSX.utils.sheet_add_json(worksheet, data, {
        origin: "A3",
        skipHeader: false,
      });

      // Create and save the workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");
      XLSX.writeFile(workbook, `${currentMonth} Bill.xlsx`);
    } catch (error) {
      console.error("Error exporting Excel file:", error);
    }
  };

  const deleteOldBills = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.delete("http://localhost:5000/api/admin/delete-old-bills", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Old bills deleted successfully.");
      window.location.reload(); // Or re-fetch bills instead
    } catch (error) {
      console.error("Error deleting old bills:", error);
      toast.error("Failed to delete old bills.");
    }
  };

  const markBillsAsUnpaid = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.patch(
        "http://localhost:5000/api/admin/mark-overdue-bills",
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success("All bills marked as unpaid.");
    } catch (error) {
      console.error("Error marking bills as unpaid:", error);
      toast.error("Failed to mark bills as unpaid.");
    }
  };

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <ToastContainer />

      <button
        onClick={() => navigate("/adminDashboard")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4 text-white">Bills</h1>
      <div className="flex mb-4 gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search by User ID"
          className="p-2 border border-gray-300 rounded"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Old Bills
        </button>
        <button
          onClick={() => setShowUnpaidConfirm(true)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Mark Bills Unpaid
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
            <h2 className="text-xl font-semibold text-gray-800">
              User ID:{bill.cms_id}
            </h2>
            {/* <p className="text-gray-600">User ID: {bill.cms_id}</p> */}
            <p className="text-gray-600">Total Amount: {bill.gtotal}</p>
          </div>
        ))}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && !secondDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Delete Old Bills from last 6 months?
            </h2>
            <p className="mb-6">Please export to Excel first. Proceed?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setSecondDeleteConfirm(true);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second Delete Confirmation Modal */}
      {secondDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Final Warning: This cannot be undone!
            </h2>
            <p className="mb-6">Are you absolutely sure?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  deleteOldBills();
                  setShowDeleteConfirm(false);
                  setSecondDeleteConfirm(false);
                }}
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
              >
                Yes, Delete Permanently
              </button>
              <button
                onClick={() => {
                  setSecondDeleteConfirm(false);
                  setShowDeleteConfirm(false);
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Unpaid Confirmation Modal */}
      {/* First Unpaid Confirmation Modal */}
      {showUnpaidConfirm && !secondUnpaidConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Mark All Bills Unpaid?
            </h2>
            <p className="mb-6">Are you sure you want to proceed?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setSecondUnpaidConfirm(true);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowUnpaidConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second Unpaid Confirmation Modal */}
      {secondUnpaidConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Final Action: Mark All Bills Unpaid
            </h2>
            <p className="mb-6">
              This will mark all due bills as unpaid. Are you sure?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  markBillsAsUnpaid();
                  setShowUnpaidConfirm(false);
                  setSecondUnpaidConfirm(false);
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Yes, Mark Unpaid
              </button>
              <button
                onClick={() => {
                  setSecondUnpaidConfirm(false);
                  setShowUnpaidConfirm(false);
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
