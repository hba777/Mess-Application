import { useState } from "react";
import axios from "axios";

export default function AddAdmin() {
  const [cmsid, setCmsid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/admins", { cmsid, email, password });
      if (response.status === 201) {
        setMessage("Admin added successfully!");
        setCmsid("");
        setEmail("");
        setPassword("");
      } else {
        setMessage("Failed to add admin");
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || error.message));
    }

    setLoading(false);
  };

  return (
    <div className="p-4 relative max-w-3xl min-h-full mx-auto">
      <div className="p-4 max-w-3xl mx-auto relative">
        <button 
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md absolute left-0 border border-slate-200"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
        <h1 className="text-3xl font-bold font-serif text-center w-full text-slate-200">Add New Admin</h1>
      </div>
      <div className="space-y-4">
        <div className="bg-slate-200 p-4 rounded-lg shadow-md flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4 w-full">
              <label htmlFor="cmsid" className="block text-gray-700">User ID</label>
              <input
                id="cmsid"
                type="text"
                value={cmsid}
                onChange={(e) => setCmsid(e.target.value)}
                required
                className="w-full mt-1 border border-gray-400 bg-slate-100 p-2 rounded"
              />
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 border border-gray-400 bg-slate-100 p-2 rounded"
              />
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 border border-gray-400 bg-slate-100 p-2 rounded"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2 sm:gap-4 justify-center">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-green-600" disabled={loading}>
                {loading ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </form>
          {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
        </div>
      </div>
    </div>
  );
}