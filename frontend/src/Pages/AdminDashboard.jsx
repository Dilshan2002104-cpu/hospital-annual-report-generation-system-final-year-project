import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    empId: "",
    username: "",
    password: "",
    role: "",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8080/api/auth/users");
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch users", error);
  //   }
  // };

  const handleCreateUser = async () => {
    // Input validation
    if (!newUser.empId?.trim()) {
      alert("Employee ID is required");
      return;
    }
    if (!newUser.username?.trim()) {
      alert("Username is required");
      return;
    }
    if (!newUser.password?.trim()) {
      alert("Password is required");
      return;
    }
    if (!newUser.role?.trim()) {
      alert("Role is required");
      return;
    }
      if (!newUser.empId?.trim() || !newUser.username?.trim() || !newUser.password?.trim() || !newUser.role?.trim()) {
    alert("All fields are required");
    return;
  }
    setIsLoading(true);

    try {
      const tocken = localStorage.getItem("adminTocken");

      const response = await axios.post("http://localhost:8080/api/auth/register", {
        empId: newUser.empId.trim(),
        username: newUser.username.trim(),
        password: newUser.password.trim(),
        role: newUser.role,
      },{
        headers: {
          Authorization: `Bearer ${tocken}`,
        },
      });

      if (response.data.isSuccess) {
        alert("User created successfully!");
        setNewUser({ empId: "", username: "", password: "", role: "" });
        setIsCreateModalOpen(false);
        // fetchUsers();  // Refresh user list after creation
      } else {
        alert(response.data.message || "Failed to create user");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "DOCTOR":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "NURSE":
        return "bg-green-100 text-green-700 border border-green-200";
      case "ADMIN":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hospital Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">National Institute of Nephrology, Dialysis and Transplantation</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-4 py-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gray-700 font-medium">{users.length} Total Users</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <p className="text-gray-600 mt-1">Manage staff members and their system access</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create User</span>
            </button>
          </div>

          {/* User Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.empId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                              <span className="text-white font-medium text-sm">{user.username[0].toUpperCase()}</span>
                            </div>
                            {user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => alert("Edit functionality coming soon!")}
                              className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md text-sm transition-colors border border-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md text-sm transition-colors border border-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-lg font-medium mb-2">No users found</p>
                          <p className="text-sm">Get started by creating a new user</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md border border-gray-200">
            <div className="bg-blue-500 px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New User</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-white hover:text-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <input
                  type="text"
                  placeholder="Enter Employee ID"
                  value={newUser.empId}
                  onChange={(e) => setNewUser({ ...newUser, empId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateUser}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-md transition-colors flex items-center space-x-2"
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isLoading ? 'Creating...' : 'Create User'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
