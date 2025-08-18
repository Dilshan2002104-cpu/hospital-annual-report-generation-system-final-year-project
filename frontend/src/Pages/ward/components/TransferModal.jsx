import React, { useState } from 'react';

const TransferModal = ({ isOpen, onClose, patient }) => {
  const [transfer, setTransfer] = useState({
    destination: '',
    reason: '',
    urgency: 'routine',
    notes: ''
  });

  if (!isOpen) return null;

  const destinationOptions = [
    { value: 'Ward 1 - General', beds: 8 },
    { value: 'Ward 2 - ICU', beds: 2 },
    { value: 'Ward 3 - Nephrology', beds: 3 },
    { value: 'Ward 4 - Dialysis', beds: 2 },
    { value: 'Clinic - Nephrology', beds: 'N/A' },
    { value: 'Clinic - Cardiology', beds: 'N/A' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Transfer submitted:', transfer);
    onClose();
  };

  const handleClose = () => {
    setTransfer({
      destination: '',
      reason: '',
      urgency: 'routine',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Transfer Patient</h2>
          <p className="text-sm text-gray-600">Patient: {patient?.name} - Current Location: {patient?.ward}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={transfer.destination}
              onChange={(e) => setTransfer({...transfer, destination: e.target.value})}
            >
              <option value="">Select Destination</option>
              {destinationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value} {typeof option.beds === 'number' ? `(${option.beds} beds available)` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Transfer</label>
            <textarea
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={transfer.reason}
              onChange={(e) => setTransfer({...transfer, reason: e.target.value})}
              placeholder="Medical reason for transfer..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={transfer.urgency}
              onChange={(e) => setTransfer({...transfer, urgency: e.target.value})}
            >
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={transfer.notes}
              onChange={(e) => setTransfer({...transfer, notes: e.target.value})}
              placeholder="Any additional notes or accompanying records..."
            />
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 mb-2">Transfer Checklist</h4>
            <div className="space-y-1 text-sm text-yellow-700">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Patient chart and medical records</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Current medications list</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Recent lab results and imaging</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Nursing care plan</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Initiate Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;