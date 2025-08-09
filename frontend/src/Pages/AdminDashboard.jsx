import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

// Toast notification types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuration constants
const CONFIG = {
  API_BASE: 'http://localhost:8080', // In production, this would come from environment variables
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300,
  TOKEN_KEY: 'adminToken'
};

// Updated roles with more specific hospital roles
const ROLES = [
  { value: 'ADMIN', label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-200', category: 'admin' },
  { value: 'WARD_DOCTOR', label: 'Ward Doctor', color: 'bg-blue-100 text-blue-700 border-blue-200', category: 'doctor' },
  { value: 'WARD_NURSE', label: 'Ward Nurse', color: 'bg-green-100 text-green-700 border-green-200', category: 'nurse' },
  { value: 'CLINIC_DOCTOR', label: 'Clinic Doctor', color: 'bg-blue-100 text-blue-700 border-blue-200', category: 'doctor' },
  { value: 'CLINIC_NURSE', label: 'Clinic Nurse', color: 'bg-green-100 text-green-700 border-green-200', category: 'nurse' },
  { value: 'DIALYSIS_DOCTOR', label: 'Dialysis Doctor', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', category: 'doctor' },
  { value: 'DIALYSIS_NURSE', label: 'Dialysis Nurse', color: 'bg-teal-100 text-teal-700 border-teal-200', category: 'nurse' },
  { value: 'LAB_TECH', label: 'Lab Technician', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', category: 'support' },
  { value: 'PHARMACIST', label: 'Pharmacist', color: 'bg-red-100 text-red-700 border-red-200', category: 'support' }
];

// Role categories for filtering
const ROLE_CATEGORIES = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctors' },
  { value: 'nurse', label: 'Nurses' },
  { value: 'support', label: 'Support Staff' }
];

const API_ENDPOINTS = {
  ALL_USERS: '/api/auth/allUsers',
  REGISTER: '/api/auth/register',
  UPDATE: '/api/auth/update',
  DELETE: '/api/auth/delete'
};

// Utility functions
const getFromStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('localStorage not available:', error);
    return null;
  }
};

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

const getErrorMessage = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message;
  
  switch (status) {
    case 401:
      return "Session expired. Please login again.";
    case 403:
      return "Insufficient permissions to perform this action.";
    case 409:
      return "User already exists with this Employee ID or Username.";
    case 422:
      return "Invalid input data. Please check all fields.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return message || "An unexpected error occurred. Please try again.";
  }
};

const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }
  return null;
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Toast Component
const Toast = ({ toast, onClose }) => {
  const getToastStyles = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-white border-l-4 border-green-500 shadow-lg';
      case TOAST_TYPES.ERROR:
        return 'bg-white border-l-4 border-red-500 shadow-lg';
      case TOAST_TYPES.WARNING:
        return 'bg-white border-l-4 border-yellow-500 shadow-lg';
      case TOAST_TYPES.INFO:
        return 'bg-white border-l-4 border-blue-500 shadow-lg';
      default:
        return 'bg-white border-l-4 border-gray-500 shadow-lg';
    }
  };

  const getToastIcon = (type) => {
    const baseClasses = "w-5 h-5";
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className={`${baseClasses} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case TOAST_TYPES.ERROR:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className={`${baseClasses} text-red-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case TOAST_TYPES.WARNING:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className={`${baseClasses} text-yellow-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case TOAST_TYPES.INFO:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className={`${baseClasses} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getProgressBarColor = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-green-500';
      case TOAST_TYPES.ERROR:
        return 'bg-red-500';
      case TOAST_TYPES.WARNING:
        return 'bg-yellow-500';
      case TOAST_TYPES.INFO:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <div className={`max-w-sm w-full rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out ${getToastStyles(toast.type)}`}>
      {/* Progress bar */}
      <div className="relative">
        <div className={`h-1 ${getProgressBarColor(toast.type)} animate-pulse`}></div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start">
          {getToastIcon(toast.type)}
          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {toast.title}
              </p>
            )}
            <p className="text-sm text-gray-700 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onClose(toast.id)}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md p-1 transition-colors"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
};

// Custom hooks
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function AdminDashboard() {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  
  // Search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("empId");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(CONFIG.ITEMS_PER_PAGE);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [newUser, setNewUser] = useState({
    empId: "",
    username: "",
    password: "",
    role: "",
  });
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Selection for bulk operations
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, CONFIG.DEBOUNCE_DELAY);

  // Toast functions
  const addToast = useCallback((message, type = TOAST_TYPES.INFO, title = null, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, title, duration };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = 'Success') => {
    addToast(message, TOAST_TYPES.SUCCESS, title);
  }, [addToast]);

  const showError = useCallback((message, title = 'Error') => {
    addToast(message, TOAST_TYPES.ERROR, title);
  }, [addToast]);

  const showWarning = useCallback((message, title = 'Warning') => {
    addToast(message, TOAST_TYPES.WARNING, title);
  }, [addToast]);

  const showInfo = useCallback((message, title = 'Info') => {
    addToast(message, TOAST_TYPES.INFO, title);
  }, [addToast]);

  // API functions
  const makeApiCall = useCallback(async (method, endpoint, data = null) => {
    const token = getFromStorage(CONFIG.TOKEN_KEY);
    
    if (!token || isTokenExpired(token)) {
      throw new Error('Session expired. Please login again.');
    }

    const config = {
      method,
      url: `${CONFIG.API_BASE}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    return await axios(config);
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setFetchError(null);

    try {
      const response = await makeApiCall('GET', API_ENDPOINTS.ALL_USERS);
      
      const usersWithIds = response.data.map((user, index) => ({
        ...user,
        id: user.empId || `user-${index}`,
        createdAt: user.createdAt || new Date().toISOString()
      }));

      setUsers(usersWithIds);
      setSelectedUsers(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setFetchError(getErrorMessage(error));
    } finally {
      setIsLoadingUsers(false);
    }
  }, [makeApiCall]);

  // Filtering and sorting
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = !debouncedSearchTerm || 
        user.empId?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesRole = !roleFilter || user.role === roleFilter;
      
      const matchesCategory = !categoryFilter || 
        ROLES.find(r => r.value === user.role)?.category === categoryFilter;
      
      return matchesSearch && matchesRole && matchesCategory;
    });

    // Sort users
    filtered.sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, debouncedSearchTerm, roleFilter, categoryFilter, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Updated statistics to include all new roles
  const statistics = useMemo(() => {
    const counts = {
      total: users.length,
      admin: users.filter(u => u.role === 'ADMIN').length,
      doctors: users.filter(u => ROLES.find(r => r.value === u.role)?.category === 'doctor').length,
      nurses: users.filter(u => ROLES.find(r => r.value === u.role)?.category === 'nurse').length,
      support: users.filter(u => ROLES.find(r => r.value === u.role)?.category === 'support').length,
      // Individual role counts
      wardDoctor: users.filter(u => u.role === 'WARD_DOCTOR').length,
      wardNurse: users.filter(u => u.role === 'WARD_NURSE').length,
      clinicDoctor: users.filter(u => u.role === 'CLINIC_DOCTOR').length,
      clinicNurse: users.filter(u => u.role === 'CLINIC_NURSE').length,
      dialysisDoctor: users.filter(u => u.role === 'DIALYSIS_DOCTOR').length,
      dialysisNurse: users.filter(u => u.role === 'DIALYSIS_NURSE').length,
      labTech: users.filter(u => u.role === 'LAB_TECH').length,
      pharmacist: users.filter(u => u.role === 'PHARMACIST').length,
    };
    return counts;
  }, [users]);

  // Form validation
  const validateForm = (userData, isEditing = false) => {
    const errors = {};
    
    if (!userData.empId?.trim()) {
      errors.empId = "Employee ID is required";
    } else if (!/^[A-Z0-9-]+$/.test(userData.empId.trim())) {
      errors.empId = "Employee ID should only contain uppercase letters, numbers, and hyphens";
    }
    
    if (!userData.username?.trim()) {
      errors.username = "Username is required";
    } else if (userData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }
    
    if (!isEditing && !userData.password?.trim()) {
      errors.password = "Password is required";
    } else if (userData.password && validatePassword(userData.password)) {
      errors.password = validatePassword(userData.password);
    }
    
    if (!userData.role?.trim()) {
      errors.role = "Role is required";
    }
    
    return errors;
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  // Event handlers
  const handleEditUser = (user) => {
    setEditingUser({
      id: user.id,
      empId: user.empId,
      username: user.username,
      role: user.role,
      password: ''
    });
    setValidationErrors({});
    setIsEditModalOpen(true);
  };

  const handleCreateUser = async () => {
    const errors = validateForm(newUser);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await makeApiCall('POST', API_ENDPOINTS.REGISTER, {
        empId: newUser.empId.trim().toUpperCase(),
        username: newUser.username.trim(),
        password: newUser.password.trim(),
        role: newUser.role,
      });

      if (response.data.isSuccess) {
        setNewUser({ empId: "", username: "", password: "", role: "" });
        setIsCreateModalOpen(false);
        setValidationErrors({});
        setPasswordStrength(0);
        await fetchUsers();
        
        showSuccess('User created successfully!', 'User Created');
      } else {
        setValidationErrors({ general: response.data.message || "Failed to create user" });
      }
    } catch (error) {
      console.error(error);
      setValidationErrors({ general: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    const errors = validateForm(editingUser, true);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        username: editingUser.username.trim(),
        role: editingUser.role,
      };

      if (editingUser.password?.trim()) {
        updateData.password = editingUser.password.trim();
      }

      const response = await makeApiCall(
        'PATCH',
        `${API_ENDPOINTS.UPDATE}/${editingUser.empId}`,
        updateData
      );

      if (response.data.isSuccess) {
        setIsEditModalOpen(false);
        setEditingUser(null);
        setValidationErrors({});
        await fetchUsers();
        showSuccess('User updated successfully!', 'User Updated');
      } else {
        setValidationErrors({ general: response.data.message || "Failed to update user" });
      }
    } catch (error) {
      console.error(error);
      setValidationErrors({ general: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        const response = await makeApiCall('DELETE', `${API_ENDPOINTS.DELETE}/${userId}`);

        if (response.data.isSuccess) {
          setUsers(users.filter((user) => user.empId !== userId));
          setSelectedUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
          showSuccess(`User "${username}" deleted successfully!`, 'User Deleted');
        } else {
          showError(response.data.message || "Failed to delete user", 'Delete Failed');
        }
      } catch (error) {
        console.error("Delete user error:", error);
        showError(getErrorMessage(error), 'Delete Failed');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;
    
    const usernames = users
      .filter(user => selectedUsers.has(user.empId))
      .map(user => user.username)
      .join(', ');
    
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.size} users: ${usernames}? This action cannot be undone.`)) {
      setIsLoading(true);
      let successCount = 0;
      let failCount = 0;
      
      for (const userId of selectedUsers) {
        try {
          const response = await makeApiCall('DELETE', `${API_ENDPOINTS.DELETE}/${userId}`);
          if (response.data.isSuccess) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Failed to delete user ${userId}:`, error);
          failCount++;
        }
      }
      
      setIsLoading(false);
      await fetchUsers();
      
      if (successCount > 0 && failCount === 0) {
        showSuccess(`Successfully deleted ${successCount} users.`, 'Bulk Delete Complete');
      } else if (successCount > 0 && failCount > 0) {
        showWarning(`Successfully deleted ${successCount} users. Failed to delete ${failCount} users.`, 'Bulk Delete Partial');
      } else {
        showError(`Failed to delete all ${failCount} users.`, 'Bulk Delete Failed');
      }
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(user => user.empId)));
    }
    setSelectAll(!selectAll);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Employee ID', 'Username', 'Role', 'Category', 'Created At'],
      ...filteredUsers.map(user => [
        user.empId,
        user.username,
        user.role,
        ROLES.find(r => r.value === user.role)?.category || 'Unknown',
        new Date(user.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospital_users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showSuccess(`Exported ${filteredUsers.length} users to CSV file.`, 'Export Complete');
  };

  const getRoleBadgeColor = (role) => {
    const roleConfig = ROLES.find(r => r.value === role);
    return roleConfig ? roleConfig.color : "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Medium';
    return 'Strong';
  };

  // Initialize component
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newUser.password));
  }, [newUser.password]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
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
            
            {/* Enhanced Statistics */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total', value: statistics.total, color: 'bg-blue-100 text-blue-700' },
                { label: 'Doctors', value: statistics.doctors, color: 'bg-blue-100 text-blue-700' },
                { label: 'Nurses', value: statistics.nurses, color: 'bg-green-100 text-green-700' },
                { label: 'Support', value: statistics.support, color: 'bg-yellow-100 text-yellow-700' }
              ].map((stat) => (
                <div key={stat.label} className={`${stat.color} rounded-lg px-3 py-2 text-center`}>
                  <div className="text-lg font-bold">{isLoadingUsers ? '...' : stat.value}</div>
                  <div className="text-xs font-medium">{stat.label}</div>
                </div>
              ))}
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
          </div>

          {/* Detailed Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Admin</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.admin}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">All Doctors</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.doctors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">All Nurses</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.nurses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Support Staff</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.support}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Staff</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Employee ID or Username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setRoleFilter(''); // Clear role filter when category changes
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {ROLE_CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specific Roles</option>
                  {ROLES
                    .filter(role => !categoryFilter || role.category === categoryFilter)
                    .map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                {/* Bulk Actions */}
                {selectedUsers.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Selected ({selectedUsers.size})</span>
                  </button>
                )}

                <button
                  onClick={exportUsers}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={fetchUsers}
                  disabled={isLoadingUsers}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create User</span>
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || categoryFilter || roleFilter) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {categoryFilter && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Category: {ROLE_CATEGORIES.find(c => c.value === categoryFilter)?.label}
                    <button
                      onClick={() => setCategoryFilter('')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {roleFilter && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Role: {ROLES.find(r => r.value === roleFilter)?.label}
                    <button
                      onClick={() => setRoleFilter('')}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                    setRoleFilter('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {fetchError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{fetchError}</span>
                <button
                  onClick={fetchUsers}
                  className="ml-auto text-red-600 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* User Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    {[
                      { key: 'empId', label: 'Employee ID' },
                      { key: 'username', label: 'Username' },
                      { key: 'role', label: 'Role' },
                      { key: 'createdAt', label: 'Created' }
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{label}</span>
                          {sortBy === key && (
                            <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingUsers ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="animate-spin w-8 h-8 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-lg font-medium">Loading users...</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.has(user.empId)}
                            onChange={() => handleSelectUser(user.empId)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.empId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                              <span className="text-white font-medium text-sm">{user.username[0].toUpperCase()}</span>
                            </div>
                            {user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                            {ROLES.find(r => r.value === user.role)?.label || user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md text-sm transition-colors border border-blue-200"
                              title="Edit user"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.empId, user.username)}
                              className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md text-sm transition-colors border border-red-200"
                              title="Delete user"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-lg font-medium mb-2">
                            {searchTerm || roleFilter || categoryFilter ? 'No users match your filters' : 'No users found'}
                          </p>
                          <p className="text-sm">
                            {searchTerm || roleFilter || categoryFilter ? 'Try adjusting your search criteria' : 'Get started by creating a new user'}
                          </p>
                          {(searchTerm || roleFilter || categoryFilter) && (
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setRoleFilter('');
                                setCategoryFilter('');
                              }}
                              className="mt-2 text-blue-600 hover:text-blue-800 underline"
                            >
                              Clear filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                        let pageNumber;
                        if (totalPages <= 7) {
                          pageNumber = index + 1;
                        } else {
                          if (currentPage <= 4) {
                            pageNumber = index + 1;
                          } else if (currentPage >= totalPages - 3) {
                            pageNumber = totalPages - 6 + index;
                          } else {
                            pageNumber = currentPage - 3 + index;
                          }
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNumber
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
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
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewUser({ empId: "", username: "", password: "", role: "" });
                  setValidationErrors({});
                  setPasswordStrength(0);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }} className="p-6 space-y-4">
              {/* General Error */}
              {validationErrors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 text-sm">{validationErrors.general}</span>
                  </div>
                </div>
              )}

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., EMP-2024-001"
                  value={newUser.empId}
                  onChange={(e) => setNewUser({ ...newUser, empId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.empId ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-describedby={validationErrors.empId ? 'empId-error' : undefined}
                />
                {validationErrors.empId && (
                  <p id="empId-error" className="mt-1 text-sm text-red-600">{validationErrors.empId}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-describedby={validationErrors.username ? 'username-error' : undefined}
                />
                {validationErrors.username && (
                  <p id="username-error" className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-describedby={validationErrors.password ? 'password-error' : 'password-help'}
                />
                
                {/* Password Strength Indicator */}
                {newUser.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength < 50 ? 'text-red-600' : 
                        passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                  </div>
                )}
                
                {validationErrors.password ? (
                  <p id="password-error" className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                ) : (
                  <p id="password-help" className="mt-1 text-sm text-gray-500">
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.role ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-describedby={validationErrors.role ? 'role-error' : undefined}
                >
                  <option value="">Select role</option>
                  <optgroup label="Administration">
                    <option value="ADMIN">Admin</option>
                  </optgroup>
                  <optgroup label="Doctors">
                    <option value="WARD_DOCTOR">Ward Doctor</option>
                    <option value="CLINIC_DOCTOR">Clinic Doctor</option>
                    <option value="DIALYSIS_DOCTOR">Dialysis Doctor</option>
                  </optgroup>
                  <optgroup label="Nurses">
                    <option value="WARD_NURSE">Ward Nurse</option>
                    <option value="CLINIC_NURSE">Clinic Nurse</option>
                    <option value="DIALYSIS_NURSE">Dialysis Nurse</option>
                  </optgroup>
                  <optgroup label="Support Staff">
                    <option value="LAB_TECH">Lab Technician</option>
                    <option value="PHARMACIST">Pharmacist</option>
                  </optgroup>
                </select>
                {validationErrors.role && (
                  <p id="role-error" className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewUser({ empId: "", username: "", password: "", role: "" });
                    setValidationErrors({});
                    setPasswordStrength(0);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
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
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md border border-gray-200">
            <div className="bg-blue-500 px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit User</span>
              </h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                  setValidationErrors({});
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }} className="p-6 space-y-4">
              {/* General Error */}
              {validationErrors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 text-sm">{validationErrors.general}</span>
                  </div>
                </div>
              )}

              {/* Employee ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <input
                  type="text"
                  value={editingUser?.empId || ''}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  disabled
                  readOnly
                />
                <p className="mt-1 text-sm text-gray-500">Employee ID cannot be changed</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={editingUser?.username || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-describedby={validationErrors.username ? 'edit-username-error' : undefined}
                />
                {validationErrors.username && (
                  <p id="edit-username-error" className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                )}
              </div>

              {/* Password (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={editingUser?.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-describedby={validationErrors.password ? 'edit-password-error' : 'edit-password-help'}
                />
                {validationErrors.password ? (
                  <p id="edit-password-error" className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                ) : (
                  <p id="edit-password-help" className="mt-1 text-sm text-gray-500">
                    Leave empty to keep current password
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingUser?.role || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.role ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-describedby={validationErrors.role ? 'edit-role-error' : undefined}
                >
                  <option value="">Select role</option>
                  <optgroup label="Administration">
                    <option value="ADMIN">Admin</option>
                  </optgroup>
                  <optgroup label="Doctors">
                    <option value="WARD_DOCTOR">Ward Doctor</option>
                    <option value="CLINIC_DOCTOR">Clinic Doctor</option>
                    <option value="DIALYSIS_DOCTOR">Dialysis Doctor</option>
                  </optgroup>
                  <optgroup label="Nurses">
                    <option value="WARD_NURSE">Ward Nurse</option>
                    <option value="CLINIC_NURSE">Clinic Nurse</option>
                    <option value="DIALYSIS_NURSE">Dialysis Nurse</option>
                  </optgroup>
                  <optgroup label="Support Staff">
                    <option value="LAB_TECH">Lab Technician</option>
                    <option value="PHARMACIST">Pharmacist</option>
                  </optgroup>
                </select>
                {validationErrors.role && (
                  <p id="edit-role-error" className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                    setValidationErrors({});
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-md transition-colors flex items-center space-x-2"
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isLoading ? 'Updating...' : 'Update User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}