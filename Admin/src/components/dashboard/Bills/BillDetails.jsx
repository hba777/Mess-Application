import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import logo from "../../../assets/MCSLogo.png";

const BillDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state;

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
    doc.text(`${formData.gtotal || ""}`, verticalLineX + 15, currentY, {
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
    <div className="bg-slate-800 min-h-screen p-4 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Bill Details</h1>
      <div className="overflow-x-auto p-8">
        <table className="min-w-full bg-white text-gray-800">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Details
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(formData).map(([key, value], index) => (
              <tr
                key={key}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="px-6 py-4 font-medium">{key}</td>
                <td className="px-6 py-4">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => generatePDF()}
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-slate-600"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default BillDetails;
