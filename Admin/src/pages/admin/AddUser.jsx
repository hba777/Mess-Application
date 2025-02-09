import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin'); // Navigate back to the admin page
  };

  const handleCreateUser = async () => {
    if (!email || !password) {
      setSnackbarMessage('Please fill in both fields.');
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);
        
    try {
      

      setSnackbarMessage('User added successfully');
      setSnackbarOpen(true);
      setIsLoading(false);

      // Optionally clear the fields
      setEmail('');
      setPassword('');
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <div className="flex justify-between mb-6">
          <button onClick={handleBack} className="text-blue-500 text-lg">
            Back
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Add User</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user password"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={handleCreateUser}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin mx-auto" />
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </div>

      {/* Snackbar for success/error message */}
      {snackbarOpen && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          <p>{snackbarMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AddUser;
