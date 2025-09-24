import React, { useState, useMemo } from 'react';
import {
  TestTube,
  Search,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Beaker,
  Droplets,
  Plus
} from 'lucide-react';

export default function SampleCollection({
  samples = [],
  testOrders = [],
  loading,
  onCollectSample,
  onUpdateStatus,
  onSearchSamples,
  stats
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedSample, setSelectedSample] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Filter samples
  const filteredSamples = useMemo(() => {
    let filtered = samples;

    if (searchTerm) {
      filtered = filtered.filter(sample =>
        sample.sampleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sample => sample.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(sample => sample.type === typeFilter);
    }

    return filtered;
  }, [samples, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'collected': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'blood': return <Droplets className="w-4 h-4" />;
      case 'urine': return <Beaker className="w-4 h-4" />;
      case 'serum': return <TestTube className="w-4 h-4" />;
      default: return <TestTube className="w-4 h-4" />;
    }
  };

  const handleCollectSample = (sampleData) => {
    const newSample = {
      sampleId: `SAMP-${Date.now()}`,
      patientId: sampleData.patientId,
      patientName: sampleData.patientName,
      type: sampleData.type,
      status: 'collected',
      collectionDate: new Date().toISOString(),
      collectedBy: 'Current User',
      tests: sampleData.tests
    };
    onCollectSample(newSample);
    setShowCollectionModal(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading samples...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sample Collection</h2>
            <p className="text-sm text-gray-600 mt-1">Collect and track laboratory samples</p>
          </div>

          <button
            onClick={() => setShowCollectionModal(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>Collect Sample</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by sample ID, patient name, or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="collected">Collected</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="blood">Blood</option>
            <option value="urine">Urine</option>
            <option value="serum">Serum</option>
            <option value="plasma">Plasma</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Samples</p>
              <p className="text-2xl font-bold text-gray-900">{samples.length}</p>
            </div>
            <TestTube className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Collected Today</p>
              <p className="text-2xl font-bold text-blue-600">{stats.todayCollections}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-purple-600">{stats.processingSamples}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejectedSamples}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejection Rate</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.sampleRejectionRate}%</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSamples.map((sample, index) => (
          <div key={sample.sampleId || index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(sample.type)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{sample.sampleId}</h3>
                  <p className="text-xs text-gray-500">{sample.type?.toUpperCase()} Sample</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(sample.status)}`}>
                {sample.status && sample.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{sample.patientName}</p>
                  <p className="text-xs text-gray-500">{sample.patientId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">
                    {sample.collectionDate ? new Date(sample.collectionDate).toLocaleString() : 'Not collected'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sample.collectedBy ? `Collected by: ${sample.collectedBy}` : 'Pending collection'}
                  </p>
                </div>
              </div>

              {sample.tests && (
                <div className="flex items-start space-x-2">
                  <TestTube className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">Tests:</p>
                    <p className="text-xs text-gray-600">
                      {Array.isArray(sample.tests) ? sample.tests.join(', ') : sample.tests}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              {sample.status === 'pending' && (
                <button
                  onClick={() => onUpdateStatus(sample.sampleId, 'collected')}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  Mark Collected
                </button>
              )}
              {sample.status === 'collected' && (
                <button
                  onClick={() => onUpdateStatus(sample.sampleId, 'processing')}
                  className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                >
                  Start Processing
                </button>
              )}
              {(sample.status === 'collected' || sample.status === 'processing') && (
                <button
                  onClick={() => onUpdateStatus(sample.sampleId, 'rejected')}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSamples.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <TestTube className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No samples found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by collecting a new sample'
            }
          </p>
        </div>
      )}

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collect New Sample</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sample Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500">
                  <option value="blood">Blood</option>
                  <option value="urine">Urine</option>
                  <option value="serum">Serum</option>
                  <option value="plasma">Plasma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tests Required</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter tests required"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCollectionModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCollectSample({
                  patientId: 'PAT-12345',
                  patientName: 'Sample Patient',
                  type: 'blood',
                  tests: ['Complete Blood Count']
                })}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Collect Sample
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}