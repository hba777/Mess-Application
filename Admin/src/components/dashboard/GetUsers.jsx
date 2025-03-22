import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    console.log(authToken);
    axios.get('http://localhost:5000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(response => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.includes(searchTerm)
  );

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <button
        onClick={() => navigate('/adminDashboard')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by Name"
          className="p-2 border border-gray-300 rounded"
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">CMS ID: {user.cms_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetUsers;
