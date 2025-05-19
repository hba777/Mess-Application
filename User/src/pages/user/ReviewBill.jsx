import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import logo from "../../assets/AppLogo.jpg";
import { toast, ToastContainer } from "react-toastify";

function DetailComponent() {
  const location = useLocation();
  const { formData } = location.state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const BILL_ID_LABEL = process.env.REACT_APP_BILL_ID_LABEL || "1-Link Bill ID";

  const handleBackNav = () => {
    navigate("/addBill", { state: { formData } });
  };
  const [errorMessages, setErrorMessages] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    if (
      !formData.cms_id ||
      // !formData.rank ||
      // !formData.name ||
      !formData.course ||
      !formData.receipt_no
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
      gtotal: calculatedTotal,
      balamount: balanceAmount,
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
      toast.success("Bill was added successfully.");
      setLoading(true); // Disable button
    } catch (error) {
      console.error("Error in submitting data:", error);
      toast.error("Failed to add entry to the server: " + error.message);
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Page Border
    const drawPageBorder = () => {
      doc.rect(10, 10, pageWidth - 20, pageHeight - 15);
    };

    drawPageBorder(); // Draw border on the first page

    // Logo and title
    const logoWidth = 40;
    const logoHeight = 40;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, "JPEG", logoX, 15, logoWidth, logoHeight);

    // Add date text below the logo
    const textY = 15 + logoHeight + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 8); // 8th of next month
    const formattedDate = nextMonth.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });

    doc.text(`(Up to ${formattedDate})`, pageWidth / 2, textY, {
      align: "center",
    });

    // Personal details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const detailsYStart = 70;
    const detailSpacing = 6;

    doc.text(`User ID: ${formData.cms_id || ""}`, 20, detailsYStart);
    doc.text(
      `1LINK ID: ${BILL_ID_LABEL || ""}`,
      20,
      detailsYStart + detailSpacing * 1.5
    );
    // doc.text(
    //   `Name:              ${formData.name || ""}`,
    //   20,
    //   detailsYStart + detailSpacing * 2
    // );
    doc.text(
      `Course: ${formData.course || ""}`,
      20,
      detailsYStart + detailSpacing * 3
    );

    // Table properties
    const tableXStart = 20;
    const tableWidth = pageWidth - 40;
    const tableYStart = 97;
    var tableHeight = 180;
    const rowHeight = 6;
    var verticaLine = tableHeight;

    let currentY = tableYStart + 15; // Start of table content
    const verticalLineX = tableXStart + tableWidth / 2;

    // Draw table header on new page
    const drawTableHeader = (yPosition) => {
      doc.rect(tableXStart, yPosition, tableWidth, tableHeight);
      doc.line(
        verticalLineX,
        yPosition,
        verticalLineX,
        yPosition + verticaLine
      );
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Description", tableXStart + 5, yPosition + 5);
      doc.text("Amount (Rs)", verticalLineX + 5, yPosition + 5);
      doc.line(
        tableXStart,
        yPosition + 10,
        tableXStart + tableWidth,
        yPosition + 10
      );
      return yPosition + 15;
    };

    // Draw first table header
    drawTableHeader(tableYStart);

    const billItems = [
      { label: "Mess Subs", value: formData.m_subs },
      { label: "Offrs Saving", value: formData.saving },
      { label: "Regt Subs (C/Fund)", value: formData.c_fund },
      { label: "Messing", value: formData.messing },
      { label: "Extra Messing", value: formData.e_messing },
      { label: "Sui Gas (Messing)", value: formData.sui_gas_per_day },
      { label: "25% Gas (Extra Messing)", value: formData.sui_gas_25_percent },
      { label: "Tea Bar (MCS)", value: formData.tea_bar_mcs },
      {
        label: "Dining Hall (Electric Charges)",
        value: formData.dining_hall_charges,
      },
      { label: "Sweeper Wages", value: formData.swpr },
      { label: "Laundry Charges", value: formData.laundry },
      { label: "Gar Mess", value: formData.gar_mess },
      { label: "Room Maintenance", value: formData.room_maint },
      {
        label: "Electric Charges (160 Block)",
        value: formData.elec_charges_160_block,
      },
      { label: "Internet Charges", value: formData.internet },
      { label: "Service Charges", value: formData.svc_charges },
      { label: "Sui Gas (BOQs)", value: formData.sui_gas_boqs },
      { label: "Sui Gas (166 CD)", value: formData.sui_gas_166_cd },
      { label: "Sui Gas (166 Block)", value: formData.sui_gas_166_block },
      { label: "Lounge (160 Block)", value: formData.lounge_160 },
      { label: "Rent Charges", value: formData.rent_charges },
      { label: "Furniture Maintenance", value: formData.fur_maint },
      {
        label: "Sui Gas & Electricity (FTS)",
        value: formData.sui_gas_elec_fts,
      },
      { label: "Material Charges", value: formData.mat_charges },
      { label: "HC/WA Charges", value: formData.hc_wa },
      { label: "Gym Subscription", value: formData.gym },
      { label: "Café Maintenance (MCS)", value: formData.cafe_maint_charges },
      { label: "Dine Out", value: formData.dine_out },
      { label: "Payamber Fund", value: formData.payamber },
      {
        label: "Student Societies Fund",
        value: formData.student_societies_fund?.toString() ?? "0",
      },
      { label: "Dinner Night", value: formData.dinner_ni_jscmcc_69 },
      { label: "Current Bill", value: formData.current_bill },
      //  { label: "Arrears", value: formData.arrear },
      // { label: "1-Link Bill ID", value: BILL_ID_LABEL },
      //  { label: "Annual Corps Fund", value: formData.annual_corps_fund },
      //  { label: "ACW (Medical Fund)", value: formData.acw_med_fund },
      //  { label: "Total Amount", value: formData.gtotal },
      { label: "Amount Received", value: formData.amount_received },
      // { label: "Balance Amount", value: formData.balamount },
    ];

    // Table content with page handling
    billItems.forEach((item) => {
      if (currentY + rowHeight > pageHeight - 20) {
        doc.addPage();
        drawPageBorder();
        tableHeight = 120;
        verticaLine = 65;
        currentY = drawTableHeader(20);
      }

      doc.setFont("helvetica", "normal");
      doc.text(item.label, tableXStart + 5, currentY);
      doc.text(
        item.value ? item.value.toString() : "",
        verticalLineX + 20,
        currentY,
        { align: "right" }
      );

      currentY += rowHeight;
      doc.line(
        tableXStart,
        currentY - 4,
        tableXStart + tableWidth,
        currentY - 4
      );
    });

    // Totals section
    doc.setFont("helvetica", "bold");
    doc.text("Arrear:", tableXStart + 5, currentY);
    doc.text(`${formData.arrear || ""}`, verticalLineX + 20, currentY, {
      align: "right",
    });
    doc.line(tableXStart, currentY - 4, tableXStart + tableWidth, currentY - 4);
    currentY += rowHeight;
    doc.text("G. Total:", tableXStart + 5, currentY);
    doc.text(`${formData.gtotal || ""}`, verticalLineX + 20, currentY, {
      align: "right",
    });
    doc.line(tableXStart, currentY - 4, tableXStart + tableWidth, currentY - 4);
    currentY += rowHeight;
    doc.text("Balance Amount:", tableXStart + 5, currentY);
    doc.text(`${formData.balamount || ""}`, verticalLineX + 20, currentY, {
      align: "right",
    });
    doc.line(tableXStart, currentY - 4, tableXStart + tableWidth, currentY - 4);
    currentY += rowHeight;
    doc.line(tableXStart, currentY - 4, tableXStart + tableWidth, currentY - 4);

    // Footer notes
    doc.setFont("helvetica", "normal");
    currentY += 12;
    doc.text(
      "1. Bill to be paid before 8th of each month in cash/1LINK.",
      tableXStart + 5,
      currentY
    );
    doc.text(
      "2. This is a computerized bill and does not require a signature",
      tableXStart + 5,
      currentY + 4
    );

    doc.text(
      "3. Queries, if any, should be reported to the Mess Secretary within two days of receipt of this bill.",
      tableXStart + 5,
      currentY + 8
    );
    doc.text(
      "4. No queries will be entertained after the two-day period.",
      tableXStart + 5,
      currentY + 12
    );

    // Save PDF
    doc.save(`CID ${formData.cms_id} Mess_Bill.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-6">
      {/* ToastContainer for notifications */}
      <ToastContainer />
      <div className="max-w-lg w-full p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white">
        {/* Back Button */}
        <button
          onClick={handleBackNav}
          className="mb-4 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">Receipt</h2>

        {/* Personal Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "cms_id", label: "User ID" },
              { key: "course", label: "Course" },
            ].map(({ key, label }) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{label}:</span>
                <span className="text-gray-300">{formData[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Details Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">
            Financial Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600 text-gray-300">
                    Details
                  </th>
                  <th className="py-2 px-4 border-b border-gray-600 text-right text-gray-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData).map(
                  ([key, value]) =>
                    ![
                      "cms_id",
                      //  "rank",
                      //   "name",
                      "course",
                    ].includes(key) && (
                      <tr key={key} className="even:bg-gray-800">
                        <td className="py-2 px-4 border-b border-gray-700">
                          {formatLabel(key)}
                        </td>
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
            className={`py-2 px-4 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={loading}
          >
            {loading ? "Bill Added" : "Add Entry"}
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
