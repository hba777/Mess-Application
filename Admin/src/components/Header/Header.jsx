import React from 'react'
import { useNavigate , Link } from 'react-router'

const Header = () => {
  const navigate = useNavigate();

  function handleSignOut() {
    navigate('/');
  }

  return (
    <div className="bg-slate-800 text-slate-200 px-4 py-6 sm:py-8 sm:px-6 lg:px-8 min-w-52">
      {/* Logo Section */}
      <div className="text-center sm:text-left flex space-x-2 flex-wrap justify-center sm:block">
        <h1 className="font-extrabold text-2xl sm:text-5xl lg:text-6xl font-serif">MCS</h1>
        <h2 className="font-semibold text-2xl sm:text-xl lg:text-2xl font-serif">BILLING</h2>
        <h2 className="font-semibold text-2xl sm:text-xl lg:text-2xl font-serif">SYSTEM</h2>
      </div>


      {/* Navigation Section */}
      <nav className="mt-5 sm:flex sm:flex-col items-center sm:items-center space-y-5">
        <ul className="flex sm:flex-col space-x-4 sm:space-x-0 items-center justify-center sm:space-y-4 text-white">
          <li>
            <Link
              to="/adminDashboard"
              className="hover:text-blue-400 transition-colors duration-200 text-base sm:text-lg lg:text-xl"
            >
              Summary
            </Link>
          </li>
          <li>
            <Link
              to="/addBills"
              className="hover:text-blue-400 transition-colors duration-200 text-base sm:text-lg lg:text-xl"
            >
              Add Bills
            </Link>
          </li>
          <li>
            <Link
              to="/verifyBills"
              className="hover:text-blue-400 transition-colors duration-200 text-base sm:text-lg lg:text-xl"
            >
              Verify Bills
            </Link>
          </li>
          <li>
            <Link
              to="/addUser"
              className="hover:text-blue-400 transition-colors duration-200 text-base sm:text-lg lg:text-xl"
            >
              Add User
            </Link>
          </li>
          <li>
            <Link
              to="/addAdmin"
              className="hover:text-blue-400 transition-colors duration-200 text-base sm:text-lg lg:text-xl"
            >
              Add Admin
            </Link>
          </li>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-transform transform hover:scale-105 text-sm sm:text-base lg:text-lg sm:block sm:items-center "
          >
            Sign Out
          </button>
        </ul>
      </nav>
    </div>
  );
};

export default Header;

