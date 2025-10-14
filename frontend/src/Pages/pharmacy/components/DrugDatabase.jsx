import React, { useState, useCallback, useEffect } from 'react';
import {
  Database,
  Search,
  Filter,
  AlertTriangle,
  Info,
  Pill,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DrugDatabase({
  drugDatabase,
  searchResults,
  loading,
  pagination,
  error,
  onSearchDrug,
  onFetchAllDrugs,
  onGetDrugInfo,
  onGetCategories,
  onClearSearch,
  wsConnected
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showDrugInfo, setShowDrugInfo] = useState(false);
  // Remove local currentPage state - use pagination state from hook instead
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('drugName,asc');
  const [searchLoading, setSearchLoading] = useState(false);

  // Get available categories
  const categories = onGetCategories ? onGetCategories() : [
    'all', 'Antibiotic', 'Analgesic', 'Cardiovascular', 'Diabetes',
    'Respiratory', 'Neurological', 'Gastrointestinal', 'Hormonal', 'Other'
  ];

  // Perform search when filters change
  const performSearch = useCallback(async (term = searchTerm, category = filterCategory, page = pagination?.pageNumber || 0) => {
    if (!onSearchDrug) return;

    try {
      setSearchLoading(true);
      await onSearchDrug(term, category, page, pageSize, sortBy);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [onSearchDrug, pageSize, sortBy, filterCategory, pagination?.pageNumber, searchTerm]);

  // Sync page size from hook
  useEffect(() => {
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
  }, [pagination?.pageSize, pageSize, pagination]);

  // Initial load on component mount
  useEffect(() => {
    if (onFetchAllDrugs) {
      const initialLoad = async () => {
        try {
          setSearchLoading(true);
          await onFetchAllDrugs(0, pageSize, sortBy);
        } catch (error) {
          console.error('Initial load failed:', error);
        } finally {
          setSearchLoading(false);
        }
      };
      initialLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search input change with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm, filterCategory, 0);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterCategory, performSearch]);

  // Handle pagination change
  const handlePageChange = (newPage) => {
    performSearch(searchTerm, filterCategory, newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    performSearch(searchTerm, filterCategory, 0);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    performSearch(searchTerm, filterCategory, 0);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setFilterCategory('all');
    if (onClearSearch) {
      onClearSearch();
    }
    performSearch('', 'all', 0);
  };

  const handleDrugSelect = async (drug) => {
    setSelectedDrug(drug);
    setShowDrugInfo(true);
    try {
      const detailedInfo = await onGetDrugInfo(drug.id);
      setSelectedDrug({ ...drug, ...detailedInfo });
    } catch (error) {
      console.error('Failed to fetch drug details:', error);
    }
  };

  // Use search results or fallback to drugDatabase
  const displayedDrugs = searchResults && searchResults.length > 0 ? searchResults : drugDatabase;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading drug database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drug Information Lookup */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-green-600" />
          Drug Information Database
        </h3>
        
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search medications by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

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

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="drugName,asc">Name (A-Z)</option>
              <option value="drugName,desc">Name (Z-A)</option>
              <option value="createdAt,desc">Newest First</option>
              <option value="createdAt,asc">Oldest First</option>
            </select>
          </div>

          {(searchTerm || filterCategory !== 'all') && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Drug Database Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Medication Search Results</h3>
            <div className="flex items-center space-x-4">
              {/* Real-time connection status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-600">
                  {wsConnected ? 'Real-time updates' : 'Connecting...'}
                </span>
              </div>
              {pagination && (
                <span className="text-sm text-gray-600">
                  Showing {pagination.pageNumber * pagination.pageSize + 1} - {Math.min((pagination.pageNumber + 1) * pagination.pageSize, pagination.totalElements)} of {pagination.totalElements} medications
                </span>
              )}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Page size:</label>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {(loading || searchLoading) && (
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Searching medications...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !searchLoading && !error && (
          <div className="p-6">
            {displayedDrugs && displayedDrugs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDrugs.map((drug) => (
                  <div
                    key={drug.id}
                    onClick={() => handleDrugSelect(drug)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Pill className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{drug.drugName || 'Unknown Drug'}</h4>
                        <p className="text-sm text-gray-600 truncate">{drug.genericName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{drug.strength || 'N/A'} • {drug.dosageForm || 'N/A'}</p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                            {drug.category || 'General'}
                          </span>
                          <span className="text-xs text-gray-500">${drug.unitCost || '0.00'}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            (drug.currentStock || 0) <= (drug.minimumStock || 0) ? 'bg-red-100 text-red-800' :
                            (drug.currentStock || 0) === 0 ? 'bg-gray-100 text-gray-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            Stock: {drug.currentStock || 0}
                          </span>
                          <span className="text-xs text-gray-500">
                            Exp: {drug.expiryDate ? new Date(drug.expiryDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>

                        <div className="mt-2">
                          <p className="text-xs text-gray-500 truncate">
                            Mfr: {drug.manufacturer || 'Unknown'} • Batch: {drug.batchNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medications Found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterCategory !== 'all'
                    ? "No medications match your current search criteria."
                    : "Start searching to find medications in the database."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && !loading && !searchLoading && (
          <div className="p-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* Results info */}
              <div className="text-sm text-gray-600">
                Showing {pagination.pageNumber * pagination.pageSize + 1} - {Math.min((pagination.pageNumber + 1) * pagination.pageSize, pagination.totalElements)} of {pagination.totalElements} results
              </div>

              {/* Pagination controls */}
              <div className="flex items-center space-x-1">
                {/* First page */}
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={pagination?.first || (pagination?.pageNumber || 0) === 0}
                  className="flex items-center px-2 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
                  title="First page"
                >
                  ⟨⟨
                </button>

                {/* Previous page */}
                <button
                  onClick={() => handlePageChange((pagination?.pageNumber || 0) - 1)}
                  disabled={pagination?.first || (pagination?.pageNumber || 0) === 0}
                  className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page numbers with ellipsis */}
                <div className="flex space-x-1">
                  {(() => {
                    const current = pagination?.pageNumber || 0;
                    const total = pagination?.totalPages || 1;
                    const pages = [];

                    if (total <= 7) {
                      // Show all pages if total is 7 or less
                      for (let i = 0; i < total; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Always show first page
                      pages.push(0);

                      if (current <= 3) {
                        // Near beginning: show 1,2,3,4...last
                        for (let i = 1; i <= 4; i++) {
                          pages.push(i);
                        }
                        if (total > 5) {
                          pages.push('ellipsis');
                          pages.push(total - 1);
                        }
                      } else if (current >= total - 4) {
                        // Near end: show 1...n-3,n-2,n-1,n
                        if (total > 5) {
                          pages.push('ellipsis');
                        }
                        for (let i = total - 4; i < total; i++) {
                          if (i > 0) pages.push(i);
                        }
                      } else {
                        // Middle: show 1...current-1,current,current+1...last
                        pages.push('ellipsis');
                        for (let i = current - 1; i <= current + 1; i++) {
                          pages.push(i);
                        }
                        pages.push('ellipsis');
                        pages.push(total - 1);
                      }
                    }

                    return pages.map((page, index) => {
                      if (page === 'ellipsis') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-400">
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            page === current
                              ? 'bg-green-600 text-white shadow-sm'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {page + 1}
                        </button>
                      );
                    });
                  })()}
                </div>

                {/* Next page */}
                <button
                  onClick={() => handlePageChange((pagination?.pageNumber || 0) + 1)}
                  disabled={pagination?.last || (pagination?.pageNumber || 0) >= (pagination?.totalPages || 1) - 1}
                  className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>

                {/* Last page */}
                <button
                  onClick={() => handlePageChange((pagination?.totalPages || 1) - 1)}
                  disabled={pagination?.last || (pagination?.pageNumber || 0) >= (pagination?.totalPages || 1) - 1}
                  className="flex items-center px-2 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
                  title="Last page"
                >
                  ⟩⟩
                </button>
              </div>

              {/* Page size selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Items per page:</label>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drug Information Modal */}
      {showDrugInfo && selectedDrug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedDrug.drugName || 'Unknown Drug'}</h2>
                <p className="text-green-100 text-sm">{selectedDrug.genericName || 'N/A'}</p>
                <p className="text-green-200 text-xs">{selectedDrug.strength || 'N/A'} • {selectedDrug.dosageForm || 'N/A'}</p>
              </div>
              <button
                onClick={() => setShowDrugInfo(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Basic Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-gray-700">Drug Name</p>
                          <p className="text-gray-900">{selectedDrug.drugName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Generic Name</p>
                          <p className="text-gray-900">{selectedDrug.genericName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Strength</p>
                          <p className="text-gray-900">{selectedDrug.strength || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Form</p>
                          <p className="text-gray-900">{selectedDrug.dosageForm || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Category</p>
                          <p className="text-gray-900 capitalize">{selectedDrug.category || 'General'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Manufacturer</p>
                          <p className="text-gray-900">{selectedDrug.manufacturer || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Batch Number</p>
                          <p className="text-gray-900">{selectedDrug.batchNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Unit Cost</p>
                          <p className="text-gray-900">${selectedDrug.unitCost || '0.00'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stock Information */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-semibold text-blue-900 mb-2">Stock Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-blue-700">Current Stock</p>
                          <p className="text-blue-900">{selectedDrug.currentStock || 0}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-700">Minimum Stock</p>
                          <p className="text-blue-900">{selectedDrug.minimumStock || 0}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-700">Maximum Stock</p>
                          <p className="text-blue-900">{selectedDrug.maximumStock || 0}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-700">Total Value</p>
                          <p className="text-blue-900">${selectedDrug.totalValue?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expiry Information */}
                    <div className={`rounded-lg p-3 ${
                      (selectedDrug.daysUntilExpiry || 0) < 30 ? 'bg-red-50' :
                      (selectedDrug.daysUntilExpiry || 0) < 90 ? 'bg-yellow-50' : 'bg-green-50'
                    }`}>
                      <h4 className={`font-semibold mb-2 ${
                        (selectedDrug.daysUntilExpiry || 0) < 30 ? 'text-red-900' :
                        (selectedDrug.daysUntilExpiry || 0) < 90 ? 'text-yellow-900' : 'text-green-900'
                      }`}>Expiry Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className={`font-medium ${
                            (selectedDrug.daysUntilExpiry || 0) < 30 ? 'text-red-700' :
                            (selectedDrug.daysUntilExpiry || 0) < 90 ? 'text-yellow-700' : 'text-green-700'
                          }`}>Expiry Date</p>
                          <p className={`${
                            (selectedDrug.daysUntilExpiry || 0) < 30 ? 'text-red-900' :
                            (selectedDrug.daysUntilExpiry || 0) < 90 ? 'text-yellow-900' : 'text-green-900'
                          }`}>
                            {selectedDrug.expiryDate ? new Date(selectedDrug.expiryDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className={`font-medium ${
                            (selectedDrug.daysUntilExpiry || 0) < 30 ? 'text-red-700' :
                            (selectedDrug.daysUntilExpiry || 0) < 90 ? 'text-yellow-700' : 'text-green-700'
                          }`}>Days Until Expiry</p>
                          <p className={`${
                            (selectedDrug.daysUntilExpiry || 0) < 30 ? 'text-red-900' :
                            (selectedDrug.daysUntilExpiry || 0) < 90 ? 'text-yellow-900' : 'text-green-900'
                          }`}>
                            {selectedDrug.daysUntilExpiry || 'Unknown'} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinical Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Clinical Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    {selectedDrug.indications && (
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Indications</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {selectedDrug.indications.map((indication, index) => (
                            <li key={index}>{indication}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedDrug.dosage && (
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Typical Dosage</p>
                        <p className="text-gray-600">{selectedDrug.dosage}</p>
                      </div>
                    )}
                    
                    {selectedDrug.route && (
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Route of Administration</p>
                        <p className="text-gray-600">{selectedDrug.route}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Warnings and Contraindications */}
              {(selectedDrug.warnings || selectedDrug.contraindications) && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                    Warnings & Contraindications
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {selectedDrug.warnings && (
                      <div>
                        <p className="font-medium text-gray-700 mb-2">Warnings</p>
                        <div className="space-y-2">
                          {selectedDrug.warnings.map((warning, index) => (
                            <div key={index} className="bg-orange-50 border border-orange-200 rounded p-3">
                              <p className="text-orange-800 text-sm">{warning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedDrug.contraindications && (
                      <div>
                        <p className="font-medium text-gray-700 mb-2">Contraindications</p>
                        <div className="space-y-2">
                          {selectedDrug.contraindications.map((contraindication, index) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                              <p className="text-red-800 text-sm">{contraindication}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Side Effects */}
              {selectedDrug.sideEffects && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Side Effects</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {selectedDrug.sideEffects.common && (
                      <div>
                        <p className="font-medium text-gray-700 mb-2">Common</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {selectedDrug.sideEffects.common.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedDrug.sideEffects.serious && (
                      <div>
                        <p className="font-medium text-gray-700 mb-2">Serious</p>
                        <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                          {selectedDrug.sideEffects.serious.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedDrug.sideEffects.rare && (
                      <div>
                        <p className="font-medium text-gray-700 mb-2">Rare</p>
                        <ul className="list-disc list-inside text-sm text-orange-600 space-y-1">
                          {selectedDrug.sideEffects.rare.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDrugInfo(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}