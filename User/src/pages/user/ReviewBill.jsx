import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import logo from "../../assets/MCSLogo.png";

function DetailComponent() {
  const location = useLocation();
  const { formData } = location.state;
  const [newEntry, setNewEntry] = useState({});
  const navigate = useNavigate();

  const handleBackNav = () => {
    navigate("/addBill", { state: { formData }});
  };
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

    setNewEntry(newEntry);

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

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    console.log(formData);
    // Page Border
    doc.rect(10, 10, pageWidth - 20, pageHeight - 15);

    // Logo and title
    const logoWidth = 75;
    const logoHeight = 40;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, "JPEG", logoX, 15, logoWidth, logoHeight);

    // Add the specified text below the logo
    const textY = 15 + logoHeight + 10; // 10 units below the logo
    const text = "(Up to 25 Nov 2025)";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(text, pageWidth / 2, textY, { align: "center" });

    // Personal details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const detailsYStart = 70;
    const detailSpacing = 6;

    doc.text(
      `CMS ID:              ${formData.cms_id || ""}`,
      20,
      detailsYStart
    );
    doc.text(
      `Rank:              ${formData.rank || ""}`,
      20,
      detailsYStart + detailSpacing
    );
    doc.text(
      `Name:              ${formData.name || ""}`,
      20,
      detailsYStart + detailSpacing * 2
    );
    doc.text(
      `Course:           ${formData.course || ""}`,
      20,
      detailsYStart + detailSpacing * 3
    );
    doc.text(
      `Membership No: ${formData.membershipNo || ""}`,
      20,
      detailsYStart + detailSpacing * 4
    );

    // Table headers and border
    const tableXStart = 20;
    const tableWidth = pageWidth - 40;
    const tableYStart = 97;
    const tableHeight = 170;

    // Draw table border
    doc.rect(tableXStart, tableYStart, tableWidth, tableHeight);

    // Vertical line (centered within table border)
    const verticalLineX = tableXStart + tableWidth / 2;
    doc.line(
      verticalLineX,
      tableYStart,
      verticalLineX,
      tableYStart + tableHeight
    );

    // Header Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Description", tableXStart + 5, tableYStart + 5);
    doc.text("Amount (Rs)", verticalLineX + 5, tableYStart + 5);

    // Horizontal line under headers
    doc.line(
      tableXStart,
      tableYStart + 10,
      tableXStart + tableWidth,
      tableYStart + 10
    );

    // Table content
    const billItems = [
      { label: "Mess Subs", value: formData.m_subs },
      { label: "Offrs Saving", value: formData.saving },
      { label: "Regt Subs (C/Fund)", value: formData.c_fund },
      { label: "Messing", value: formData.messing },
      { label: "Extra Messing", value: formData.e_messing },
      { label: "Sui Gas-Messing", value: formData.sui_gas_per_day },
      { label: "25% Gas-E/Messing", value: formData.sui_gas_25_percent },
      { label: "Tea Bar MCS", value: formData.tea_bar_mcs },
      {
        label: "Elec Charges (Dining Hall)",
        value: formData.dining_hall_charges,
      },
      { label: "Swpr Wages", value: formData.swpr },
      { label: "Laundry Charges", value: formData.laundry },
      { label: "Gar Mess", value: formData.gar_mess },
      { label: "Room Maint", value: formData.room_maint },
      { label: "Internet", value: formData.internet },
      { label: "Lounge 160", value: formData.lounge_160 },
      { label: "Rent Charges", value: formData.rent_charges },
      { label: "Fur Maint Charges", value: formData.fur_maint },
      { label: "Gym Subs", value: formData.gym },
      { label: "Café Maint Charges (MCS)", value: formData.cafe_maint_charges },
      { label: "Annual Corps Fund", value: formData.annual_corps_fund },
      { label: "ACW (Med) Fund", value: formData.acw_med_fund },
      { label: "Student Society Fund", value: formData.student_societies_fund },
      { label: "1 Bill Charges (1 Link)", value: formData.bill_charges_1_link },
    ];

    let currentY = tableYStart + 15;
    const rowHeight = 6;

    billItems.forEach((item) => {
      const value = item.value ? item.value.toString() : "";
      doc.setFont("helvetica", "normal");
      doc.text(item.label, tableXStart + 5, currentY);
      doc.text(value, verticalLineX + 15, currentY, { align: "right" }); // Increased horizontal position by 5 units
      currentY += rowHeight;

      // Add horizontal line after each entry
      doc.line(
        tableXStart,
        currentY - 4,
        tableXStart + tableWidth,
        currentY - 4
      );
    });

    // Totals section
    doc.setFont("helvetica", "bold");
    doc.text("Total:", tableXStart + 5, currentY);
    doc.text(`${formData.current_bill || ""}`, verticalLineX + 15, currentY, {
      align: "right",
    });
    currentY += rowHeight;
    doc.text("Arrear:", tableXStart + 5, currentY);
    doc.text(`${formData.arrear || ""}`, verticalLineX + 15, currentY, {
      align: "right",
    });
    doc.line(tableXStart, currentY - 4, tableXStart + tableWidth, currentY - 4);
    currentY += rowHeight;
    doc.text("G. Total:", tableXStart + 5, currentY);
    doc.text(`${formData.gTotal || ""}`, verticalLineX + 15, currentY, {
      align: "right",
    });
    doc.line(tableXStart, currentY - 4, tableXStart + tableWidth, currentY - 4);

    // Footer notes with alignment to the right border of the table
    currentY += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Maj", pageWidth - 40, currentY, { align: "right" });
    doc.text("Mess Secy", pageWidth - 40, currentY + 4, { align: "right" });
    currentY += 12;
    doc.text(
      "1. Bill to be paid before 8th of each month in cash.",
      tableXStart,
      currentY
    );
    doc.text(
      "2. Query if any will be reported within three days after receipt of this bill.",
      tableXStart,
      currentY + 4
    );

    // Save PDF
    doc.save("Mess_Bill.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-6">
      <div className="max-w-lg w-full p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white">
        
        {/* Back Button */}
        <button
          onClick={handleBackNav}
          className="mb-4 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          ← Back
        </button>
  
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">Receipt</h2>
  
        {/* Personal Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {["cms_id", "rank", "name", "course"].map((key) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key.replace(/_/g, " ").toUpperCase()}:</span>
                <span className="text-gray-300">{formData[key]}</span>
              </div>
            ))}
          </div>
        </div>
  
        {/* Financial Details Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">Financial Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600 text-gray-300">Details</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-right text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData).map(
                  ([key, value]) =>
                    !["cms_id", "rank", "name", "course"].includes(key) && (
                      <tr key={key} className="even:bg-gray-800">
                        <td className="py-2 px-4 border-b border-gray-700">{formatLabel(key)}</td>
                        <td className="py-2 px-4 border-b border-gray-700 text-right">
                          {typeof value === "number" ? value.toFixed(2) : value}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Entry
          </button>
          <button
            onClick={() => generatePDF(formData)}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Generate PDF
          </button>
          
        </div>
  
      </div>
    </div>
  );
  
}

// Helper function to format labels
function formatLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default DetailComponent;
