import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const MessBillEntry = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     navigate("/"); // Redirect to login page after logout
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //   }
  // };

  const [formData, setFormData] = useState({
    armyNo: "",
    rank: "",
    name: "",
    course: "",
    mSubs: "",
    saving: "",
    cFund: "",
    messing: "",
    eMessing: "",
    suiGasPerDay: "",
    suiGas25Percent: "",
    teaBarMCS: "",
    diningHallCharges: "",
    swpr: "",
    laundry: "",
    garMess: "",
    roomMaint: "",
    elecCharges160Block: "",
    internet: "",
    svcCharges: "",
    suiGasBOQs: "",
    suiGas166CD: "",
    suiGas166Block: "",
    lounge160: "",
    rentCharges: "",
    furMaint: "",
    suiGasElecFTs: "",
    matCharges: "",
    hcWA: "",
    gym: "",
    cafeMaintCharges: "",
    dineOut: "",
    payamber: "",
    studentSocietiesFund: "",
    dinnerNiJSCMCC69: "",
    currentBill: "",
    arrear: "",
    receiptNo: "",
    amountReceived: "",
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "mSubs",
      "saving",
      "cFund",
      "messing",
      "eMessing",
      "suiGasPerDay",
      "suiGas25Percent",
      "teaBarMCS",
      "diningHallCharges",
      "swpr",
      "laundry",
      "garMess",
      "roomMaint",
      "elecCharges160Block",
      "internet",
      "svcCharges",
      "suiGasBOQs",
      "suiGas166CD",
      "suiGas166Block",
      "lounge160",
      "rentCharges",
      "furMaint",
      "suiGasElecFTs",
      "matCharges",
      "hcWA",
      "gym",
      "cafeMaintCharges",
      "dineOut",
      "payamber",
      "studentSocietiesFund",
      "dinnerNiJSCMCC69",
      "currentBill",
      "arrear",
      "amountReceived",
      "receiptNo", // Ensuring receiptNo is treated as numeric
    ];

    if (numericFields.includes(name)) {
      // Disallow invalid characters such as `e`, `E`, `-`, `+`, etc.
      if (/^\d*\.?\d*$/.test(value)) {
        setErrorMessages((prev) => ({ ...prev, [name]: "" }));
        setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.armyNo ||
      !formData.rank ||
      !formData.name ||
      !formData.course ||
      !formData.receiptNo
    ) {
      setErrorMessages((prev) => ({
        ...prev,
        general: "Please fill in all mandatory fields.",
      }));
      return;
    }

    const calculatedTotal = Object.keys(formData)
      .filter((key) =>
        [
          "mSubs",
          "saving",
          "cFund",
          "messing",
          "eMessing",
          "suiGasPerDay",
          "suiGas25Percent",
          "teaBarMCS",
          "diningHallCharges",
          "swpr",
          "laundry",
          "garMess",
          "roomMaint",
          "elecCharges160Block",
          "internet",
          "svcCharges",
          "suiGasBOQs",
          "suiGas166CD",
          "suiGas166Block",
          "lounge160",
          "rentCharges",
          "furMaint",
          "suiGasElecFTs",
          "matCharges",
          "hcWA",
          "gym",
          "cafeMaintCharges",
          "dineOut",
          "payamber",
          "studentSocietiesFund",
          "dinnerNiJSCMCC69",
          "currentBill",
          "arrear",
        ].includes(key)
      )
      .reduce((sum, key) => sum + parseFloat(formData[key] || 0), 0);

    const balanceAmount =
      calculatedTotal - parseFloat(formData.amountReceived || 0);

    const newEntry = {
      ...formData,
      gTotal: calculatedTotal,
      balAmount: balanceAmount,
    };

    try {
      //await addDoc(collection(db, "messBillEntries"), newEntry);
      setErrorMessages({});
      setEntries([...entries, newEntry]);
      setSubmissionMessage({
        type: "success",
        text: "Entry successfully added to the database.",
      });
    } catch (error) {
      setSubmissionMessage({
        type: "error",
        text: "Failed to add entry to Firebase: " + error.message,
      });
    }

    setTimeout(() => setSubmissionMessage(null), 5000);

    setFormData({
      armyNo: "",
      rank: "",
      name: "",
      course: "",
      mSubs: "",
      saving: "",
      cFund: "",
      messing: "",
      eMessing: "",
      suiGasPerDay: "",
      suiGas25Percent: "",
      teaBarMCS: "",
      diningHallCharges: "",
      swpr: "",
      laundry: "",
      garMess: "",
      roomMaint: "",
      elecCharges160Block: "",
      internet: "",
      svcCharges: "",
      suiGasBOQs: "",
      suiGas166CD: "",
      suiGas166Block: "",
      lounge160: "",
      rentCharges: "",
      furMaint: "",
      suiGasElecFTs: "",
      matCharges: "",
      hcWA: "",
      gym: "",
      cafeMaintCharges: "",
      dineOut: "",
      payamber: "",
      studentSocietiesFund: "",
      dinnerNiJSCMCC69: "",
      currentBill: "",
      arrear: "",
      receiptNo: "",
      amountReceived: "",
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-4xl text-center mb-8 font-bold">Mess Bill Entry</h1>

      <form onSubmit={handleSubmit} className="grid gap-5 max-w-lg mx-auto">
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
                key === "receiptNo" || ["rank", "name", "course"].includes(key)
                  ? "text"
                  : "number"
              }
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required={[
                "armyNo",
                "rank",
                "name",
                "course",
                "receiptNo",
              ].includes(key)}
              className="p-2 border border-gray-300 rounded-lg"
            />
            {errorMessages[key] && (
              <span className="text-red-500 text-sm">{errorMessages[key]}</span>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600"
        >
          Add Entry
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
