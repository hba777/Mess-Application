import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import logo from "../../../assets/AppLogo.jpg";
import { toast, ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const BillDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state;
  const BILL_ID_LABEL = process.env.REACT_APP_BILL_ID_LABEL || "1-Link Bill ID";

  console.log(formData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [isBillPaid, setIsBillPaid] = useState(false);

  const [paymentDetails] = useState({
    transaction_id: uuidv4(),
    payer_cms_id: formData.cms_id || "",
    payment_amount: formData.amount_received || "",
    payment_method: "1-Link",
    receipt_number: formData.receipt_no || "",
  });

  const authToken = localStorage.getItem("authToken");

  const generatePDF = () => {
    console.log("Bill ID" + BILL_ID_LABEL);
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
    // doc.text(
    //   `Rank:              ${formData.rank || ""}`,
    //   20,
    //   detailsYStart + detailSpacing
    // );
    // doc.text(
    //   `Name:              ${formData.name || ""}`,
    //   20,
    //   detailsYStart + detailSpacing * 2
    // );
    doc.text(
      `Course:           ${formData.course || ""}`,
      20,
      detailsYStart + detailSpacing * 1.5
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
      { label: "Dinner (NI/JSCMCC-69)", value: formData.dinner_ni_jscmcc_69 },
       { label: "Current Bill", value: formData.current_bill },
      //  { label: "Arrears", value: formData.arrear },
      { label: "1-Link Bill ID", value: BILL_ID_LABEL },
      //  { label: "Annual Corps Fund", value: formData.annual_corps_fund },
      //  { label: "ACW (Medical Fund)", value: formData.acw_med_fund },
      //  { label: "Total Amount", value: formData.gTotal },
      { label: "Amount Received", value: formData.amount_received },

    ];

    // Table content with page handling
    billItems.forEach((item) => {
      if (currentY + rowHeight > pageHeight - 20) {
        doc.addPage();
        drawPageBorder();
        tableHeight = 120;
        verticaLine = 71;
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
    doc.text(
      "3. This is a computerized bill and does not require a signature",
      tableXStart + 5,
      currentY + 8
    );
    doc.text(
      "4. Queries, if any, should be reported to the Mess Secretary within two days of receipt of this bill.",
      tableXStart + 5,
      currentY + 12
    );
    doc.text(
      "5. No queries will be entertained after the two-day period.",
      tableXStart + 5,
      currentY + 16
    );
    doc.text(
      "6. All outstation cheques should include bank commission at the current rate.",
      tableXStart + 5,
      currentY + 20
    );

    // Save PDF
    doc.save(`CID ${formData.cms_id} Mess_Bill.pdf`);
  };

  const deleteBill = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/bill/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setIsModalOpen(false);
        navigate(-1);
      } else {
        toast.error("Failed to delete bill");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast.error("Failed to add entry to the server: " + error.message);
    }
  };

  const payBill = async () => {
    try {
      const requestData = {
        bill_id: formData.id,
        ...paymentDetails,
        status: "Paid",
      };
      console.log("Sending payment data:", requestData);

      const response = await fetch(
        "http://localhost:5000/api/pay/bill-payment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      if (response.ok) {
        toast.success("Bill payment successful");
        setIsPaymentModalOpen(false);
        setIsBillPaid(true);
      } else {
        toast.error("Failed to process bill payment");
      }
    } catch (error) {
      console.error("Error processing bill payment:", error);
      toast.error("An error occurred while processing the bill payment");
    }
  };

  const sendToWhatsApp = async () => {
    try {
      const authToken = localStorage.getItem("authToken"); // Retrieve Bearer token
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const users = response.data; // Assuming the response contains an array of users
      const user = users.find((u) => u.cms_id === formData.cms_id); // Match CMS ID

      if (!user || !user.phone_number) {
        alert("Phone number not found for this CMS ID.");
        return;
      }

      let phoneNumber = user.phone_number.replace(/\D/g, ""); // Remove non-numeric characters

      // Ensure correct Pakistani format
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "92" + phoneNumber.slice(1);
      } else if (!phoneNumber.startsWith("92")) {
        phoneNumber = "92" + phoneNumber;
      }

      console.log("Final Phone Number:", phoneNumber); // Debugging
      console.log("User Data:", user); // Debugging

      const message = encodeURIComponent(
        `Bill Details:\n${Object.entries(formData)
          .filter(([key]) => key !== "id")
          .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
          .join("\n")}`
      );

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
      console.log("WhatsApp URL:", whatsappURL); // Debugging

      window.open(whatsappURL, "_blank"); // WhatsApp API link
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to fetch user details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-6">
      <ToastContainer />
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
                <th className="py-2 px-4 border-b border-gray-600 text-gray-300">
                  Details
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-right text-gray-300">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData)
                .filter(([key]) => !["id", "rank", "name"].includes(key)) // Exclude id, rank, and name
                .map(([key, value], index) => (
                  <tr
                    key={key}
                    className={index % 2 === 0 ? "bg-gray-800" : ""}
                  >
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

        {/* Action Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => generatePDF()}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Generate PDF
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className={`py-2 px-4 text-white rounded-lg ${
              isBillPaid
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isBillPaid}
          >
            Pay Bill
          </button>
          <button
            onClick={() => {
              setBillToDelete(formData.id);
              setIsModalOpen(true);
            }}
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Bill
          </button>
          <button
            onClick={sendToWhatsApp}
            className="py-2 px-4 bg-green-400 text-white rounded-lg hover:bg-green-500"
          >
            Send to WhatsApp
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm text-white text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this bill?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => deleteBill(billToDelete)}
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm text-white text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Payment</h3>
            <div className="flex justify-center space-x-4">
              <button
                className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={payBill}
              >
                Pay
              </button>
              <button
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setIsPaymentModalOpen(false)}
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

export default BillDetails;
