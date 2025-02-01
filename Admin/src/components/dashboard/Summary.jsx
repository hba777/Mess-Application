import React, { useEffect, useState } from 'react';
//import { getBills } from '../services/api';

const Summary = () => {
  const [bills, setBills] = useState([]);

  // useEffect(() => {
  //   const fetchBills = async () => {
  //     try {
  //       const response = await getBills();
  //       setBills(response.data);
  //     } catch (error) {
  //       console.error('Error fetching bills:', error);
  //     }
  //   };

  //   fetchBills();
  // }, []);

  const departments = [
    'Software Department',
    'Electrical Department',
    'Internet Security Department',
    'Combat Division',
    'Combined Bill Summary',
  ];

  return (
    // <div className="p-4 bg-gray-200 min-h-screen">
    //   <h1 className="text-2xl font-bold mb-4 text-black font-serif</h1>
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {departments.map((department, index) => (
    //       <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-gray-700">
    //         <h2 className="text-lg font-semibold text-white">{department}</h2>
    //         <p className="text-gray-400 mt-2">Total Pending: Rs {bills.filter(bill => bill.department === department).length}</p>
    //         <p className="text-gray-400 mt-2">Total No of Students : {bills.filter(bill => bill.department === department).length}</p>
                // <div className="mt-4">
                //     <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                //         View Details
                //     </button>
                // </div>
    //       </div>

    //     ))}
    //   </div>

// Oper wala uncomment kar lena yaar when using with endpoints
    <div className="p-4 bg-gray-200 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-black font-serif">Pending Bills Summary</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-gray-700">
                <h2 className="text-lg font-semibold text-white">Software Department</h2>
                <p className="text-gray-400 mt-2">Total Pending Students: 27</p>
                <p className="text-gray-400">Total Pending: Rs 570,000</p>
                <div className="mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                      View Details
                    </button>
                </div>
            </div>

            {/* Card 2 */}
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-gray-700">
                <h2 className="text-lg font-semibold text-white">Electrical Department</h2>
                <p className="text-gray-400 mt-2">Total Pending Students: 15</p>
                <p className="text-gray-400">Total Pending: Rs 320,000</p>
                <div className="mt-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                    View Details
                  </button>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-gray-700">
              <h2 className="text-lg font-semibold text-white">Internet Security Department</h2>
              <p className="text-gray-400 mt-2">Total Pending Students: 10</p>
              <p className="text-gray-400">Total Pending: Rs 210,000</p>
              <div className="mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                  View Details
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-gray-700">
              <h2 className="text-lg font-semibold text-white">Combat Division</h2>
              <p className="text-gray-400 mt-2">Total Pending Students: 8</p>
              <p className="text-gray-400">Total Pending: Rs 150,000</p>
              <div className="mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                  View Details
                </button>
              </div>
            </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-gray-700 mt-6">
                <h2 className="text-lg font-semibold text-white">Complete Summary</h2>
                <p className="text-gray-400 mt-2">Total Pending Students: 57</p>
                <p className="text-gray-400">Total Pending: Rs 570,000</p>
                <div className="mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                      View Details
                    </button>
                </div>
            </div>
    </div>
  );
};

export default Summary;