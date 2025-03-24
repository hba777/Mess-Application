import { useState } from "react";
import axios from "axios";

export default function AddUser() {
  const [cms_id, setCmsId] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [link_id, setLinkId] = useState("");
  const [is_clerk, setIsClerk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Validate Form Before Submission
  const validateForm = () => {
    if (!cms_id.trim() || !phone_number.trim()) {
      setMessage("CMS ID and Phone Number are required.");
      return false;
    }

    if (is_clerk && !password.trim()) {
      setMessage("Password is required for clerks.");
      return false;
    }

    const phoneRegex = /^03\d{9}$/; // Pakistani phone format: 03001234567
    if (!phoneRegex.test(phone_number)) {
      setMessage("Invalid phone number format. Use: 03XXXXXXXXX");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/api/admin/user",
        {
          cms_id,
          password: is_clerk ? password : null,
          phone_number,
          link_id,
          is_clerk,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setMessage("User added successfully!");
        setCmsId("");
        setPassword("");
        setPhoneNumber("");
        setLinkId("");
        setIsClerk(false);
      } else {
        setMessage("Failed to add user");
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
        <h1 className="text-3xl font-bold font-serif text-center w-full text-slate-200">
          Add New User
        </h1>
      </div>
      <div className="space-y-4">
        <div className="bg-slate-200 p-4 rounded-lg shadow-md flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {[ 
              { id: "cms_id", label: "User ID", state: cms_id, setState: setCmsId },
              { id: "phone_number", label: "Phone Number", state: phone_number, setState: setPhoneNumber },
              { id: "link_id", label: "Link ID", state: link_id, setState: setLinkId },
            ].map((field) => (
              <div key={field.id} className="mb-4 w-full">
                <label htmlFor={field.id} className="block text-gray-700">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type="text"
                  value={field.state}
                  onChange={(e) => field.setState(e.target.value)}
                  required
                  className="w-full mt-1 border border-gray-400 p-2 rounded bg-slate-100"
                />
              </div>
            ))}
            <div className="mb-4 w-full flex items-center">
              <input
                id="is_clerk"
                type="checkbox"
                checked={is_clerk}
                onChange={(e) => setIsClerk(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="is_clerk" className="text-gray-700">Clerk</label>
            </div>
            {is_clerk && (
              <div className="mb-4 w-full">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={is_clerk}
                  className="w-full mt-1 border border-gray-400 p-2 rounded bg-slate-100"
                />
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2 sm:gap-4 justify-center">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-green-600"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add User"}
              </button>
            </div>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700 border border-white p-2 rounded-md">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}