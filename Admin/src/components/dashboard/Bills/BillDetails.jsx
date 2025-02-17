import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import logo from "../../../assets/MCSLogo.png";

const BillDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state;

  console.log(formData);

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
    const logoWidth = 75;
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
      day: "numeric",
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
        value: formData.student_societies_fund,
      },
      { label: "Dinner (NI/JSCMCC-69)", value: formData.dinner_ni_jscmcc_69 },
      //  { label: "Current Bill", value: formData.current_bill },
      //  { label: "Arrears", value: formData.arrear },
      //  { label: "1-Link Bill Charges", value: formData.bill_charges_1_link },
      //  { label: "Annual Corps Fund", value: formData.annual_corps_fund },
      //  { label: "ACW (Medical Fund)", value: formData.acw_med_fund },
      //  { label: "Total Amount", value: formData.gTotal },
      { label: "Amount Received", value: formData.amount_received },
      { label: "Balance Amount", value: formData.balamount },
    ];

    // Table content with page handling
    billItems.forEach((item) => {
      if (currentY + rowHeight > pageHeight - 20) {
        doc.addPage();
        drawPageBorder();
        tableHeight = 110;
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
    doc.text("Total:", tableXStart + 5, currentY);
    doc.text(`${formData.current_bill || ""}`, verticalLineX + 20, currentY, {
      align: "right",
    });
    currentY += rowHeight;
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
    doc.line(tableXStart, currentY - 4, tableXStart + tableWidth, currentY - 4);

    // Footer notes
    currentY += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Maj", pageWidth - 40, currentY, { align: "right" });
    doc.text("Mess Secy", pageWidth - 40, currentY + 4, { align: "right" });
    currentY += 12;
    doc.text(
      "1. Bill to be paid before 8th of each month in cash.",
      tableXStart + 5,
      currentY
    );
    doc.text(
      "2. Query if any will be reported within three days after receipt of this bill.",
      tableXStart + 5,
      currentY + 4
    );

    // Save PDF
    doc.save(`CID ${formData.cms_id} Mess_Bill.pdf`);
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
