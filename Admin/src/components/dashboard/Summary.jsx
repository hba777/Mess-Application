import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Summary() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPaidUsers, setTotalPaidUsers] = useState(0);
  const [chartData, setChartData] = useState(null);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${authToken}` };

        // Fetch total users
        const usersRes = await fetch(
          "http://localhost:5000/api/admin/total-users",
          { headers }
        );
        const usersData = await usersRes.json();
        setTotalUsers(usersData.total_users || 0);

        // Fetch total users who paid
        const paidUsersRes = await fetch(
          "http://localhost:5000/api/admin/total-users-who-paid",
          { headers }
        );
        const paidUsersData = await paidUsersRes.json();
        setTotalPaidUsers(paidUsersData.total_users_paid || 0);

        // Fetch pending and paid bills for pie chart
        const pendingBillsRes = await fetch(
          "http://localhost:5000/api/admin/total-pending-bills",
          { headers }
        );
        const pendingBillsData = await pendingBillsRes.json();

        const paidBillsRes = await fetch(
          "http://localhost:5000/api/admin/total-paid-bills",
          { headers }
        );
        const paidBillsData = await paidBillsRes.json();

        setChartData({
          labels: ["Pending Bills", "Paid Bills"],
          datasets: [
            {
              data: [
                parseFloat(pendingBillsData.total_pending),
                parseFloat(paidBillsData.total_paid),
              ],
              backgroundColor: ["#ff6b6b", "#4CAF50"],
              hoverBackgroundColor: ["#ff4d4d", "#388E3C"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [authToken]);

  return (
    <div className="min-h-screen bg-slate-700 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome to the Student Dashboard
        </h2>
        <h3 className="text-lg text-center mb-6">
          This is your Dashboard where you can see details about MCS Mess Bill.
        </h3>

        {/* Summary Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left Side (Stacked Total Users & Total Paid Users) */}
          <div className="flex flex-col gap-5">
            <div className="p-5 bg-gray-800 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-300">Total Users</h3>
              <p className="text-3xl font-bold text-blue-400">{totalUsers}</p>
            </div>
            <div className="p-5 bg-gray-800 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-300">Users Paid</h3>
              <p className="text-3xl font-bold text-green-400">{totalPaidUsers}</p>
            </div>
          </div>

          {/* Right Side (Pie Chart) */}
          <div className="p-5 bg-gray-800 rounded-lg shadow-lg flex justify-center items-center">
            {chartData ? <Pie data={chartData} /> : <p>Loading Chart...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
