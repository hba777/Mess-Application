import React, { useState, useEffect } from "react";
//import { addBill, getDepartments, getStudentsByDepartment, getUserByIdOrName } from '../services/api'; // These are the API functions you need to implement
import { useNavigate } from "react-router-dom";

const AddBills = () => {
  const [formData, setFormData] = useState({
    cmisId: "",
    rank: "",
    name: "",
    course: "",
    serNo: "",
    description: "",
    amount: "",
    additionalCharges: [
      { name: "Messing", amount: 0.0 },
      { name: "E-Messing", amount: 0.0 },
      { name: "Sui Gas Per Day", amount: 0.0 },
      { name: "Sui Gas 25 Percent", amount: 0.0 },
      { name: "Tea Bar MCS", amount: 0.0 },
      { name: "Dining Hall Charges", amount: 0.0 },
      { name: "SWPR", amount: 0.0 },
      { name: "Laundry", amount: 0.0 },
      { name: "Gar Mess", amount: 0.0 },
      { name: "Room Maint", amount: 0.0 },
      { name: "Elec Charges 160 Block", amount: 0.0 },
      { name: "Internet", amount: 0.0 },
      { name: "SVC Charges", amount: 0.0 },
      { name: "Sui Gas BOQs", amount: 0.0 },
      { name: "Sui Gas 166 CD", amount: 0.0 },
      { name: "Sui Gas 166 Block", amount: 0.0 },
      { name: "Lounge 160", amount: 0.0 },
      { name: "Rent Charges", amount: 0.0 },
      { name: "Fur Maint", amount: 0.0 },
      { name: "Sui Gas Elec FTS", amount: 0.0 },
      { name: "Mat Charges", amount: 0.0 },
      { name: "HC WA", amount: 0.0 },
      { name: "Gym", amount: 0.0 },
      { name: "Café Maint Charges", amount: 0.0 },
      { name: "Dine Out", amount: 0.0 },
      { name: "Payamber", amount: 0.0 },
      { name: "Student Societies Fund", amount: 0.0 },
      { name: "Dinner NI JSCMCC 69", amount: 0.0 },
      { name: "Current Bill", amount: 0.0 },
      { name: "Arrear", amount: 0.0 },
      { name: "M Subs", amount: 0.0 },
      { name: "Saving", amount: 0.0 },
      { name: "C Fund", amount: 0.0 },
    ],
    receipt_no: "",
    amount_received: 0.0,
    totalAmount: 0.0,
    grandTotal: 0.0,
  });

  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch departments when component mounts
  // useEffect(() => {
  //   const fetchDepartments = async () => {
  //     try {
  //       const deptData = await getDepartments(); // Endpoint to get list of departments
  //       setDepartments(deptData);
  //     } catch (error) {
  //       console.error('Error fetching departments:', error);
  //     }
  //   };
  //   fetchDepartments();
  // }, []);

  // Fetch students based on selected department
  // const handleDepartmentChange = async (e) => {
  //   const department = e.target.value;
  //   setSelectedDepartment(department);
  //   try {
  //     const studentData = await getStudentsByDepartment(department); // Endpoint to get students by department
  //     setStudents(studentData);
  //   } catch (error) {
  //     console.error('Error fetching students:', error);
  //   }
  // };

  // // Handle user search by name or CMIS ID
  // const handleSearchChange = async (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);
  //   try {
  //     const userData = await getUserByIdOrName(query); // Endpoint to search for a user by ID or name
  //     if (userData) {
  //       setFormData({
  //         ...formData,
  //         cmisId: userData.cmisId,
  //         name: userData.name,
  //         rank: userData.rank,
  //         course: userData.course,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error searching for user:', error);
  //   }
  // };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle amount changes in the additional charges fields
  const handleAmountChange = (index, e) => {
    const updatedCharges = [...formData.additionalCharges];
    updatedCharges[index].amount = e.target.value;
    setFormData({
      ...formData,
      additionalCharges: updatedCharges,
      totalAmount: updatedCharges.reduce(
        (acc, charge) => acc + Number(charge.amount),
        0
      ),
    });
  };

  // Handle form submission to add bill
  const handleSubmit = async (e) => {
    // e.preventDefault();
    // try {
    //   await addBill(formData); // Endpoint to add a bill
    //   alert('Bill added successfully!');
    //   setFormData({
    //     cmisId: '',
    //     rank: '',
    //     name: '',
    //     course: '',
    //     serNo: '',
    //     description: '',
    //     amount: '',
    //     additionalCharges: [],
    //     totalAmount: 0,
    //     arrear: 0,
    //     grandTotal: 0,
    //   });
    // } catch (error) {
    //   console.error('Error adding bill:', error);
    // }
  };

  const handleNavigateBack = () => {
    navigate("/adminDashboard");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto rounded-md text-slate-200">
      <div className="p-4 max-w-3xl mx-auto relative">
        <button
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md absolute left-0 border border-slate-200"
          onClick={handleNavigateBack}
        >
          Go Back
        </button>
        <h1 className="text-3xl font-bold font-serif text-center w-full ">
          Add Bill
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Department selection */}
        <div>
          <label htmlFor="department" className="block font-semibold">
            Select Department
          </label>
          <select
            id="department"
            name="department"
            value={selectedDepartment}
            //onChange={handleDepartmentChange}
            className="p-3 border rounded w-full"
            required
          >
            <option value="">Select Department</option>
            {/* {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))} */}
          </select>
        </div>

        {/* Search by Name or CMIS ID */}
        <div>
          <label htmlFor="search" className="block font-semibold">
            Search by Name or CMIS ID
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={searchQuery}
            //onChange={handleSearchChange}
            placeholder="Enter Name or CMIS ID"
            className="p-3 border rounded w-full"
          />
        </div>

        {/* User information fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="cmisId"
            placeholder="CMIS ID"
            value={formData.cmisId}
            onChange={handleChange}
            className="p-3 border rounded"
            required
          />
          <input
            type="text"
            name="rank"
            placeholder="Rank"
            value={formData.rank}
            onChange={handleChange}
            className="p-3 border rounded"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border rounded"
            required
          />
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            className="p-3 border rounded"
            required
          />
          <input
            type="text"
            name="serNo"
            placeholder="Ser No"
            value={formData.serNo}
            onChange={handleChange}
            className="p-3 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 border rounded w-full"
            rows="3"
          />
        </div>

        {/* Additional Charges Fields */}
        <div>
          <h2 className="font-semibold">Additional Charges</h2>
          {formData.additionalCharges.map((charge, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4"
            >
              <div>
                <label className="block font-medium">{charge.name}</label>
                <input
                  type="text"
                  value={charge.name}
                  readOnly
                  className="w-full p-3 border rounded bg-gray-200 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block font-medium">{`Enter ${charge.name} amount`}</label>
                <input
                  type="number"
                  value={charge.amount}
                  placeholder={`Enter ${charge.name} amount`}
                  onChange={(e) => handleAmountChange(index, e)}
                  className="w-full p-3 border rounded"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Total Amount */}
          <div>
            <label className="block font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="text"
              value="Total amount"
              readOnly
              className="w-full p-3 border rounded bg-gray-200"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Total Amount (Value)
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="w-full p-3 border rounded bg-gray-200"
            />
          </div>

          {/* Arrears */}
          <div>
            <label className="block font-medium">Arrears</label>
            <input
              type="text"
              value="Arrears"
              readOnly
              className="w-full p-3 border rounded bg-gray-200"
            />
          </div>
          <div>
            <label className="block font-medium">
              Enter Arrears
            </label>
            <input
              type="number"
              name="arrear"
              placeholder="Arrear"
              value={formData.arrear}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Grand Total */}
          <div>
            <label className="block font-medium">
              Grand Total
            </label>
            <input
              type="text"
              value="Grand Total"
              readOnly
              className="w-full p-3 border rounded bg-gray-200"
            />
          </div>
          <div>
            <label className="block font-medium">
              Grand Total (Value)
            </label>
            <input
              type="number"
              name="grandTotal"
              value={formData.grandTotal}
              readOnly
              className="w-full p-3 border rounded bg-gray-200"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4"
        >
          Add Bill
        </button>

        <p className="text-sm text-gray-200 mt-4">
          Bill to be paid by 5th of every month. In case of any queries, please
          report within three days after receipt of this bill. After that, no
          queries will be entertained.
        </p>
      </form>
    </div>
  );
};

export default AddBills;
