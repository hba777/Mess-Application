import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom"; // Import RouterProvider and createHashRouter
import App from "./App";
import LoginPage from "./pages/auth/Login";
import AddAdmin from "./components/dashboard/AddAdmin";
import Admin from "./pages/admin/Admin";
import AddBills from "./components/dashboard/AddBills";
import VerifyBills from "./components/dashboard/VerifyBills";
import LandingPage from "./pages/admin/Landing";
import ErrorPage from "./components/ErrorPage";
import AddUser from "./components/dashboard/AddUser";
import Bills from "./components/dashboard/Bills/Bills";
import BillDetails from "./components/dashboard/Bills/BillDetails";

// Create the router with route configuration
const router = createHashRouter([
  {
    path: "/",
    element: <App />, // App is used as a layout
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      // { path: "/admin", element: <AdminPage /> },
      // { path: "/admin/addUser", element: <AddUser /> },
      // { path: "/admin/sendBill", element: <SendBill /> },
      // { path: "/user", element: <MessBillEntry /> },
      { path: "/adminDashboard", element: <Admin /> },
      { path: "/addBills", element: <AddBills /> },
      { path: "/verifyBills", element: <VerifyBills /> },
      { path: "/addAdmin", element: <AddAdmin /> },
      { path: "/addUser", element: <AddUser /> },
      { path: "/getBills", element: <Bills/>},
      { path: "/viewBillDetails", element: <BillDetails /> },
      { path: "/*", element: <ErrorPage /> },

    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Wrap the App with RouterProvider and pass the router */}
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Optional: If you want to measure performance, uncomment the following line.
// reportWebVitals(console.log);
