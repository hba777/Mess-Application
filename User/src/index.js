import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom"; // Import RouterProvider and createHashRouter
import App from "./App";
import LoginPage from "./pages/auth/Login";
import LandingPage from "./pages/user/Landing";
import UserBill from "./pages/admin/Dashboard";

// Create the router with route configuration
const router = createHashRouter([
  {
    path: "/",
    element: <App />, // App is used as a layout
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/userDashboard", element: <UserBill /> },
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
