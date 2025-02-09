import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom"; // Import RouterProvider and createHashRouter
import App from "./App";
import LoginPage from "./pages/auth/Login";
import AddAdmin from "./components/dashboard/AddAdmin";
import AddUsr from "./components/dashboard/AddUsr";
import Admin from "./pages/admin/Admin";
import AddBills from "./components/dashboard/AddBills";
import VerifyBills from "./components/dashboard/VerifyBills";
import LandingPage from "./pages/admin/Landing";
import ErrorPage from "./components/ErrorPage";

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
      { path: "/addUser", element: <AddUsr /> },
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
