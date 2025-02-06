import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/MCSLogo.png";

const SendBill = () => {
  const [paNumber, setPaNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const fetchBillData = async (paNumber) => {
    if (!paNumber) {
      toast.error("Please enter a valid PA number.");
      return;
    }

    setLoading(true);

    try {
      //const billsRef = collection(db, "messBillEntries");
      //const q = query(billsRef, where("armyNo", "==", paNumber));
      //const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const fetchedBills = [];
        querySnapshot.forEach((doc) =>
          fetchedBills.push({ id: doc.id, ...doc.data() })
        );
        setBills(fetchedBills);
        toast.success(`${fetchedBills.length} bill(s) found.`);
      } else {
        setBills([]);
        toast.info("No bill data found for this PA number.");
      }
    } catch (err) {
      console.error("Error fetching bill data:", err);
      toast.error("Error fetching bill data.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (bill) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Page Border
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Logo and title
    const logoWidth = 75;
    const logoHeight = 40;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, "JPEG", logoX, 15, logoWidth, logoHeight);

    // Personal details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const detailsYStart = 65;
    const detailSpacing = 6;
    doc.text(`PA No:              ${bill.armyNo || ""}`, 20, detailsYStart);
    doc.text(
      `Rank:              ${bill.rank || ""}`,
      20,
      detailsYStart + detailSpacing
    );
    doc.text(
      `Name:              ${bill.name || ""}`,
      20,
      detailsYStart + detailSpacing * 2
    );
    doc.text(
      `Course:           ${bill.course || ""}`,
      20,
      detailsYStart + detailSpacing * 3
    );
    doc.text(
      `Membership No: ${bill.membershipNo || ""}`,
      20,
      detailsYStart + detailSpacing * 4
    );

    // "Up to Nov 2025" text bold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const text = "(Up to 25 Nov 2025)";

    // Set the position
    const textX = pageWidth / 2;
    const textY = detailsYStart + detailSpacing * 5 - 2;

    // Draw the text
    doc.text(text, textX, textY, { align: "center" });

    // Draw the horizontal line under the text
    const lineStartX = textX - doc.getTextWidth(text) / 2; // Align the line with the text width
    const lineEndX = lineStartX + doc.getTextWidth(text);
    const lineY = textY + 2; // Adjust the position to place the line right below the text
    doc.line(lineStartX, lineY, lineEndX, lineY);

    // Table headers and border
    const tableXStart = 20;
    const tableWidth = pageWidth - 40;
    const tableYStart = 95;
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
      { label: "Mess Subs", value: bill.mSubs },
      { label: "Offrs Saving", value: bill.offrsSaving },
      { label: "Regt Subs (C/Fund)", value: bill.regtSubsCFund },
      { label: "Messing", value: bill.messing },
      { label: "Extra Messing", value: bill.extraMessing },
      { label: "Sui Gas-Messing", value: bill.suiGasMessing },
      { label: "25% Gas-E/Messing", value: bill.gasEMessing },
      { label: "Tea Bar MCS", value: bill.teaBarMCS },
      {
        label: "Elec Charges (Dining Hall)",
        value: bill.elecChargesDiningHall,
      },
      { label: "Swpr Wages", value: bill.swprWages },
      { label: "Laundry Charges", value: bill.laundryCharges },
      { label: "Gar Mess", value: bill.garMess },
      { label: "Room Maint", value: bill.roomMaint },
      { label: "Internet", value: bill.internet },
      { label: "Lounge 160", value: bill.lounge160 },
      { label: "Rent Charges", value: bill.rentCharges },
      { label: "Fur Maint Charges", value: bill.furMaintCharges },
      { label: "Gym Subs", value: bill.gymSubs },
      { label: "Café Maint Charges (MCS)", value: bill.cafeMaintCharges },
      { label: "Annual Corps Fund", value: bill.annualCorpsFund },
      { label: "ACW (Med) Fund", value: bill.acwMedFund },
      { label: "Student Society Fund", value: bill.studentSocietyFund },
      { label: "1 Bill Charges (1 Link)", value: bill.billCharges1Link },
    ];

    let currentY = tableYStart + 15;
    const rowHeight = 6;

    billItems.forEach((item) => {
      const value = item.value ? item.value.toString() : "";
      doc.setFont("helvetica", "normal");
      doc.text(item.label, tableXStart + 5, currentY);
      doc.text(value, verticalLineX + 5, currentY, { align: "right" });
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
    doc.text(`${bill.total || ""}`, verticalLineX + 10, currentY, {
      align: "right",
    });
    currentY += rowHeight;
    doc.text("Arrear:", tableXStart + 5, currentY);
    doc.text(`${bill.arrear || ""}`, verticalLineX + 10, currentY, {
      align: "right",
    });
    doc.line(tableXStart, currentY - 4, tableXStart + tableWidth, currentY - 4);
    currentY += rowHeight;
    doc.text("G. Total:", tableXStart + 5, currentY);
    doc.text(`${bill.gTotal || ""}`, verticalLineX + 10, currentY, {
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

  const sendWhatsAppMessage = (bill) => {
    if (!whatsAppNumber) {
      toast.error("Please enter a valid WhatsApp number.");
      return;
    }

    generatePDF(bill);
    setPdfData(bill);
    const message = encodeURIComponent(
      "Here’s your bill. Please check the attached PDF."
    );
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsAppNumber}&text=${message}`;

    window.open(whatsappUrl, "_blank");
    if (pdfData) window.open(pdfData, "_blank");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-center mb-6">Send Bill</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-lg font-medium" htmlFor="paNumber">
            Enter Army Number:
          </label>
          <input
            type="text"
            id="paNumber"
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Army Number"
            value={paNumber}
            onChange={(e) => setPaNumber(e.target.value)}
          />
        </div>

        {/* <div>
          <label className="block text-lg font-medium" htmlFor="whatsAppNumber">
            Enter WhatsApp Number:
          </label>
          <input
            type="text"
            id="whatsAppNumber"
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            placeholder="WhatsApp Number"
            value={whatsAppNumber}
            onChange={(e) => setWhatsAppNumber(e.target.value)}
          />
        </div> */}

        <button
          type="button"
          onClick={() => fetchBillData(paNumber)}
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Fetch Bill Data"}
        </button>

        {bills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium">Bill Details:</h3>
            <ul className="space-y-4">
              {bills.map((bill) => (
                <li key={bill.id} className="p-4 border rounded-md shadow-sm">
                  <p>PA No: {bill.armyNo}</p>
                  <p>Name: {bill.name}</p>
                  <p>Total: {bill.total}</p>
                  <div className="mt-2 space-x-4">
                    <button
                      onClick={() => generatePDF(bill)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Generate PDF
                    </button>
                    {/* <button
                      onClick={() => sendWhatsAppMessage(bill)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Send via WhatsApp
                    </button> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoBack}
          className="w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mt-4"
        >
          Go Back
        </button>
      </form>
    </div>
  );
};

export default SendBill;
