import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Calendar,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';

export default function InventoryManagement({
  inventory,
  loading,
  onUpdateStock,
  onAddMedication,
  onGenerateAlerts,
  stats,
  wsConnected
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [addingMedication, setAddingMedication] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Update stock states
  const [updatingStock, setUpdatingStock] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateValidationErrors, setUpdateValidationErrors] = useState({});
  
  // Toast notification state
  const [toasts, setToasts] = useState([]);

  // Simple toast notification functions
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Filter inventory based on search and filters
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = !searchTerm || 
        item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.includes(searchTerm);
      
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      
      let matchesStatus = true;
      if (filterStatus === 'low-stock') {
        matchesStatus = item.currentStock <= item.minimumStock;
      } else if (filterStatus === 'out-of-stock') {
        matchesStatus = item.currentStock === 0;
      } else if (filterStatus === 'expiring-soon') {
        const expiryDate = new Date(item.expiryDate);
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        matchesStatus = expiryDate <= thirtyDaysFromNow;
      } else if (filterStatus === 'expired') {
        const expiryDate = new Date(item.expiryDate);
        matchesStatus = expiryDate < new Date();
      }
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, searchTerm, filterCategory, filterStatus]);

  const getStockStatusColor = (item) => {
    if (item.currentStock === 0) return 'text-red-600 bg-red-50 border-red-200';
    if (item.currentStock <= item.minimumStock) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStockStatusText = (item) => {
    if (item.currentStock === 0) return 'Out of Stock';
    if (item.currentStock <= item.minimumStock) return 'Low Stock';
    return 'In Stock';
  };

  const getExpiryStatus = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    if (expiry < now) return { status: 'expired', color: 'text-red-600', text: 'Expired' };
    if (expiry <= thirtyDaysFromNow) return { status: 'expiring-soon', color: 'text-orange-600', text: 'Expires Soon' };
    return { status: 'good', color: 'text-green-600', text: 'Good' };
  };

  const handleUpdateStock = (medication) => {
    setSelectedMedication(medication);
    setShowUpdateModal(true);
  };

  const handleStockUpdate = async (medicationId, newStock, batchNumber) => {
    setUpdatingStock(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    setUpdateValidationErrors({});

    try {
      // Prepare data for validation
      const updateData = {
        newStock: parseInt(newStock) || 0,
        batchNumber: batchNumber?.trim() || ''
      };

      // Frontend validation
      const errors = validateUpdateData(updateData, selectedMedication);
      if (Object.keys(errors).length > 0) {
        setUpdateValidationErrors(errors);
        setUpdatingStock(false);
        return;
      }

      // Call API to update stock
      const result = await onUpdateStock(medicationId, {
        newStock: updateData.newStock,
        batchNumber: updateData.batchNumber
      });
      
      if (result && result.success !== false) {
        // Show success toast
        showToast('Stock added successfully!', 'success');
        
        // Close modal and reset states
        setShowUpdateModal(false);
        setSelectedMedication(null);
        setUpdateValidationErrors({});
        setUpdateError(null);
        setUpdateSuccess(null);
      } else {
        throw new Error(result?.message || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
      setUpdateError(error.message || 'Failed to update stock');
      showToast('Failed to update stock', 'error');
    } finally {
      setUpdatingStock(false);
    }
  };

  const categories = ['all', 'antibiotics', 'analgesics', 'cardiovascular', 'diabetes', 'respiratory', 'other'];

  // Helper function to get error class
  const getFieldErrorClass = (fieldName) => {
    return validationErrors[fieldName] 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-green-500 focus:border-green-500';
  };

  // Helper function to validate individual field on blur
  const handleFieldBlur = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    
    // Create a temporary object with current field value for validation
    const tempData = {
      [fieldName]: fieldName === 'currentStock' || fieldName === 'minimumStock' || fieldName === 'maximumStock' 
        ? parseInt(fieldValue) || 0
        : fieldName === 'unitCost' 
        ? parseFloat(fieldValue) || 0
        : fieldValue?.trim() || ''
    };
    
    // Validate only this field
    const errors = validateMedicationData(tempData);
    
    // Update validation errors state
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: errors[fieldName] || undefined
    }));
  };

  // Helper function to render field error
  const renderFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      return (
        <div className="mt-2 text-sm text-red-600 flex items-start">
          <span className="text-red-500 mr-1 mt-0.5">⚠️</span>
          <span className="font-medium">{validationErrors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  // Validation function
  const validateMedicationData = (data) => {
    const errors = {};

    // Required field validation
    if (!data.drugName || data.drugName.trim() === '') {
      errors.drugName = 'Brand/Drug name is required';
    } else if (data.drugName.trim().length < 2) {
      errors.drugName = 'Brand/Drug name must be at least 2 characters long';
    }

    if (!data.genericName || data.genericName.trim() === '') {
      errors.genericName = 'Generic name is required';
    } else if (data.genericName.trim().length < 2) {
      errors.genericName = 'Generic name must be at least 2 characters long';
    }

    if (!data.category || data.category === '') {
      errors.category = 'Please select a category';
    }

    if (!data.strength || data.strength.trim() === '') {
      errors.strength = 'Strength is required';
    } else if (data.strength && !/^\d+(\.\d+)?(mg|g|ml|mcg|IU|units?)$/i.test(data.strength.replace(/\s/g, ''))) {
      errors.strength = 'Strength format should be like: 10mg, 2.5g, 100ml, etc.';
    }

    if (!data.dosageForm || data.dosageForm === '') {
      errors.dosageForm = 'Please select a dosage form';
    }

    if (!data.batchNumber || data.batchNumber.trim() === '') {
      errors.batchNumber = 'Batch number is required';
    } else if (data.batchNumber.trim().length < 3) {
      errors.batchNumber = 'Batch number must be at least 3 characters long';
    } else if (!/^[A-Z0-9]+$/i.test(data.batchNumber)) {
      errors.batchNumber = 'Batch number should contain only letters and numbers';
    }

    // Stock validation - Current stock is now required
    if (isNaN(data.currentStock) || data.currentStock === '' || data.currentStock < 0) {
      if (isNaN(data.currentStock) || data.currentStock === '') {
        errors.currentStock = 'Current stock is required';
      } else if (data.currentStock < 0) {
        errors.currentStock = 'Current stock cannot be negative';
      }
    }

    if (isNaN(data.minimumStock) || data.minimumStock === '') {
      errors.minimumStock = 'Minimum stock is required';
    } else if (data.minimumStock < 0) {
      errors.minimumStock = 'Minimum stock cannot be negative';
    }

    if (isNaN(data.maximumStock) || data.maximumStock === '') {
      errors.maximumStock = 'Maximum stock is required';
    } else if (data.maximumStock <= 0) {
      errors.maximumStock = 'Maximum stock must be greater than 0';
    }

    // Cross-field validation (only if individual fields are valid)
    if (!isNaN(data.minimumStock) && !isNaN(data.maximumStock) && data.minimumStock >= data.maximumStock) {
      errors.minimumStock = 'Minimum stock must be less than maximum stock';
      errors.maximumStock = 'Maximum stock must be greater than minimum stock';
    }

    if (!isNaN(data.currentStock) && !isNaN(data.maximumStock) && data.currentStock > data.maximumStock) {
      errors.currentStock = 'Current stock cannot exceed maximum stock';
    }

    // Cost validation
    if (isNaN(data.unitCost) || data.unitCost === '' || data.unitCost <= 0) {
      errors.unitCost = 'Unit cost is required and must be greater than 0';
    } else if (data.unitCost > 10000) {
      errors.unitCost = 'Unit cost seems too high (max: $10,000)';
    }

    // Date validation
    if (!data.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(data.expiryDate);
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      if (expiryDate <= today) {
        errors.expiryDate = 'Expiry date must be in the future';
      } else if (expiryDate <= thirtyDaysFromNow) {
        errors.expiryDate = 'Warning: Medication expires within 30 days';
      }
    }

    // Batch number format validation (basic pattern)
    if (data.batchNumber && !/^[A-Z0-9]+$/i.test(data.batchNumber)) {
      errors.batchNumber = 'Batch number should contain only letters and numbers';
    }

    // Strength format validation (basic pattern)
    if (data.strength && !/^\d+(\.\d+)?(mg|g|ml|mcg|IU|units?)$/i.test(data.strength.replace(/\s/g, ''))) {
      errors.strength = 'Strength format should be like: 10mg, 2.5g, 100ml, etc.';
    }

    return errors;
  };

  // Update stock validation function
  const validateUpdateData = (data, selectedMedication) => {
    const errors = {};

    // Stock quantity to add validation
    if (data.newStock === '' || isNaN(data.newStock)) {
      errors.newStock = 'Stock quantity to add is required';
    } else if (data.newStock < 0) {
      errors.newStock = 'Stock quantity to add cannot be negative';
    } else if (data.newStock > 999999) {
      errors.newStock = 'Stock quantity to add seems too high (max: 999,999)';
    }

    // Batch number validation (optional but if provided, should be valid)
    if (data.batchNumber && data.batchNumber.trim()) {
      if (data.batchNumber.trim().length < 3) {
        errors.batchNumber = 'Batch number must be at least 3 characters long';
      } else if (!/^[A-Z0-9]+$/i.test(data.batchNumber.trim())) {
        errors.batchNumber = 'Batch number should contain only letters and numbers';
      }
    }

    // Cross-validation with medication limits (check if adding would exceed maximum)
    if (selectedMedication && !isNaN(data.newStock)) {
      const currentStock = selectedMedication.currentStock || 0;
      const newTotal = currentStock + parseInt(data.newStock);
      if (newTotal > selectedMedication.maximumStock) {
        errors.newStock = `Adding ${data.newStock} units would exceed maximum limit (${selectedMedication.maximumStock}). Current: ${currentStock}`;
      }
    }

    return errors;
  };

  // Helper function to render update field errors
  const renderUpdateFieldError = (fieldName) => {
    if (updateValidationErrors[fieldName]) {
      return (
        <div className="mt-2 text-sm text-red-600 flex items-start">
          <span className="text-red-500 mr-1 mt-0.5">⚠️</span>
          <span className="font-medium">{updateValidationErrors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  // Helper function to get update field error class
  const getUpdateFieldErrorClass = (fieldName) => {
    return updateValidationErrors[fieldName] 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-green-500 focus:border-green-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading inventory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalMedications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-3xl font-bold text-orange-600">{stats.lowStockItems}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{stats.outOfStockItems}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.expiringItems}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="expiring-soon">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onGenerateAlerts()}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Alerts</span>
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Medication Inventory</h3>
            <div className="flex items-center space-x-4">
              {/* Real-time connection status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-600">
                  {wsConnected ? 'Real-time updates active' : 'Connecting...'}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {filteredInventory.length} of {inventory.length} items
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Medication</th>
                <th className="text-left p-4 font-medium text-gray-900">Category</th>
                <th className="text-left p-4 font-medium text-gray-900">Stock Level</th>
                <th className="text-left p-4 font-medium text-gray-900">Batch Info</th>
                <th className="text-left p-4 font-medium text-gray-900">Expiry Status</th>
                <th className="text-left p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((medication) => {
                const expiryStatus = getExpiryStatus(medication.expiryDate);
                
                return (
                  <tr key={medication.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{medication.drugName}</div>
                        <div className="text-sm text-gray-600">{medication.genericName}</div>
                        <div className="text-xs text-gray-500">{medication.strength}</div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm capitalize">
                        {medication.category}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{medication.currentStock}</span>
                          <span className="text-gray-500">/ {medication.maximumStock}</span>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded border ${getStockStatusColor(medication)}`}>
                          {getStockStatusText(medication)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Min: {medication.minimumStock}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">Batch:</span> {medication.batchNumber}</div>
                        <div><span className="font-medium">MFG:</span> {new Date(medication.manufacturingDate).toLocaleDateString()}</div>
                        <div><span className="font-medium">Supplier:</span> {medication.supplier}</div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className={`text-sm font-medium ${expiryStatus.color}`}>
                          {expiryStatus.text}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(medication.expiryDate).toLocaleDateString()}
                        </div>
                        {expiryStatus.status === 'expiring-soon' && (
                          <div className="text-xs text-orange-600">
                            {Math.ceil((new Date(medication.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateStock(medication)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span className="text-xs">Update</span>
                        </button>
                        
                        <button
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          <BarChart3 className="w-3 h-3" />
                          <span className="text-xs">History</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredInventory.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medications Found</h3>
              <p className="text-gray-600">
                {inventory.length === 0 
                  ? "No medications in inventory yet." 
                  : "No medications match your current search criteria."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add New Medication</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddError(null);
                  setAddSuccess(null);
                  setAddingMedication(false);
                  setValidationErrors({});
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              {/* Success Message */}
              {addSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                  {addSuccess}
                </div>
              )}

              {/* Error Message */}
              {addError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full mr-3"></div>
                  {addError}
                </div>
              )}

              <form noValidate onSubmit={async (e) => {
                e.preventDefault();
                
                setAddingMedication(true);
                setAddError(null);
                setAddSuccess(null);
                setValidationErrors({});
                
                try {
                  const formData = new FormData(e.target);
                  const medicationData = {
                    drugName: formData.get('drugName')?.trim() || '',
                    genericName: formData.get('genericName')?.trim() || '',
                    category: formData.get('category') || '',
                    strength: formData.get('strength')?.trim() || '',
                    dosageForm: formData.get('dosageForm') || '',
                    manufacturer: formData.get('manufacturer')?.trim() || null,
                    batchNumber: formData.get('batchNumber')?.trim() || '',
                    currentStock: parseInt(formData.get('currentStock')) || 0,
                    minimumStock: parseInt(formData.get('minimumStock')) || 0,
                    maximumStock: parseInt(formData.get('maximumStock')) || 0,
                    unitCost: parseFloat(formData.get('unitCost')) || 0,
                    expiryDate: formData.get('expiryDate') || ''
                  };
                  
                  // Frontend validation
                  const errors = validateMedicationData(medicationData);
                  if (Object.keys(errors).length > 0) {
                    setValidationErrors(errors);
                    setAddingMedication(false);
                    return;
                  }
                  
                  const result = await onAddMedication(medicationData);
                  
                  if (result.success) {
                    // Show simple success toast
                    showToast('Medication added successfully!', 'success');
                    
                    // Clear form and close modal immediately
                    setValidationErrors({});
                    setAddError(null);
                    setAddSuccess(null);
                    e.target.reset();
                    setShowAddModal(false);
                  }
                } catch (error) {
                  setAddError(error.message || 'Failed to add medication');
                  // Show simple error toast
                  showToast('Failed to add medication', 'error');
                } finally {
                  setAddingMedication(false);
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-green-600" />
                      Basic Information
                    </h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand/Drug Name *
                    </label>
                    <input
                      name="drugName"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('drugName')}`}
                      placeholder="e.g., Lisinopril"
                      onBlur={handleFieldBlur}
                    />
                    {renderFieldError('drugName')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Generic Name *
                    </label>
                    <input
                      name="genericName"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('genericName')}`}
                      placeholder="e.g., Lisinopril"
                      onBlur={handleFieldBlur}
                    />
                    {renderFieldError('genericName')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('category')}`}
                    >
                      <option value="">Select Category</option>
                      <option value="antibiotics">Antibiotics</option>
                      <option value="analgesics">Analgesics</option>
                      <option value="cardiovascular">Cardiovascular</option>
                      <option value="diabetes">Diabetes</option>
                      <option value="respiratory">Respiratory</option>
                      <option value="neurological">Neurological</option>
                      <option value="gastrointestinal">Gastrointestinal</option>
                      <option value="hormonal">Hormonal</option>
                      <option value="other">Other</option>
                    </select>
                    {renderFieldError('category')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Strength *
                    </label>
                    <input
                      name="strength"
                      type="text"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('strength')}`}
                      placeholder="e.g., 10mg, 500mg"
                      onBlur={handleFieldBlur}
                    />
                    {renderFieldError('strength')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage Form *
                    </label>
                    <select
                      name="dosageForm"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('dosageForm')}`}
                    >
                      <option value="">Select Form</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Cream">Cream</option>
                      <option value="Ointment">Ointment</option>
                      <option value="Drops">Drops</option>
                      <option value="Powder">Powder</option>
                    </select>
                    {renderFieldError('dosageForm')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer
                    </label>
                    <input
                      name="manufacturer"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('manufacturer')}`}
                      placeholder="e.g., Pfizer, Teva"
                    />
                    {renderFieldError('manufacturer')}
                  </div>

                  {/* Stock Information */}
                  <div className="col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Stock Information
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Number *
                    </label>
                    <input
                      name="batchNumber"
                      type="text"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('batchNumber')}`}
                      placeholder="e.g., BAT2024001"
                    />
                    {renderFieldError('batchNumber')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stock *
                    </label>
                    <input
                      name="currentStock"
                      type="number"
                      required
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('currentStock')}`}
                      placeholder="Enter current stock quantity"
                      onBlur={handleFieldBlur}
                    />
                    {renderFieldError('currentStock')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Stock Level *
                    </label>
                    <input
                      name="minimumStock"
                      type="number"
                      required
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('minimumStock')}`}
                      placeholder="50"
                    />
                    {renderFieldError('minimumStock')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Stock Level *
                    </label>
                    <input
                      name="maximumStock"
                      type="number"
                      required
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('maximumStock')}`}
                      placeholder="500"
                    />
                    {renderFieldError('maximumStock')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Cost ($) *
                    </label>
                    <input
                      name="unitCost"
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('unitCost')}`}
                      placeholder="0.00"
                      onBlur={handleFieldBlur}
                    />
                    {renderFieldError('unitCost')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      name="expiryDate"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldErrorClass('expiryDate')}`}
                    />
                    {renderFieldError('expiryDate')}
                  </div>

                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setAddError(null);
                      setAddSuccess(null);
                      setAddingMedication(false);
                      setValidationErrors({});
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingMedication || addSuccess}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {addingMedication && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>
                      {addingMedication ? 'Adding...' : addSuccess ? 'Added Successfully!' : 'Add Medication'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showUpdateModal && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Update Stock</h2>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedMedication(null);
                  setUpdateError(null);
                  setUpdateSuccess(null);
                  setUpdateValidationErrors({});
                  setUpdatingStock(false);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {/* Medication Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">{selectedMedication.drugName}</h3>
                <p className="text-sm text-gray-600">{selectedMedication.genericName}</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-500">Current Stock: <span className="font-medium">{selectedMedication.currentStock}</span></span>
                  <span className="text-gray-500">Max Limit: <span className="font-medium">{selectedMedication.maximumStock}</span></span>
                </div>
              </div>

              {/* Error Message */}
              {updateError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full mr-3"></div>
                  {updateError}
                </div>
              )}

              {/* Success Message */}
              {updateSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                  {updateSuccess}
                </div>
              )}
              
              <form noValidate onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await handleStockUpdate(
                  selectedMedication.id,
                  formData.get('newStock'),
                  formData.get('batchNumber')
                );
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Stock Quantity *
                    </label>
                    <div className="mb-1 text-xs text-gray-500">
                      Current stock: {selectedMedication?.currentStock || 0} units
                    </div>
                    <input
                      name="newStock"
                      type="number"
                      min="0"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getUpdateFieldErrorClass('newStock')}`}
                      placeholder="Enter quantity to add"
                      defaultValue=""
                    />
                    {renderUpdateFieldError('newStock')}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Number (Optional)
                    </label>
                    <input
                      name="batchNumber"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getUpdateFieldErrorClass('batchNumber')}`}
                      placeholder="Enter batch number if new stock"
                    />
                    {renderUpdateFieldError('batchNumber')}
                    <p className="text-xs text-gray-500 mt-1">Only required when adding new batch of medication</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedMedication(null);
                      setUpdateError(null);
                      setUpdateSuccess(null);
                      setUpdateValidationErrors({});
                      setUpdatingStock(false);
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingStock || updateSuccess}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {updatingStock && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>
                      {updatingStock ? 'Updating...' : updateSuccess ? 'Updated Successfully!' : 'Update Stock'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Simple Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-5 right-5 z-[9999]">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`
                flex items-center justify-between p-4 mb-3 rounded-lg shadow-xl
                ${toast.type === 'success' 
                  ? 'bg-green-600 text-white border-l-4 border-green-400' 
                  : 'bg-red-600 text-white border-l-4 border-red-400'
                }
                min-w-[350px] transition-all duration-300 ease-in-out
              `}
              style={{ 
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transform: 'translateX(0)',
                animation: 'slideInFromRight 0.3s ease-out'
              }}
            >
              <div className="flex items-center">
                <div className="mr-3 text-2xl">
                  {toast.type === 'success' ? '✅' : '❌'}
                </div>
                <span className="text-lg font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-white hover:text-gray-200 text-2xl font-bold hover:bg-white hover:bg-opacity-20 rounded px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}