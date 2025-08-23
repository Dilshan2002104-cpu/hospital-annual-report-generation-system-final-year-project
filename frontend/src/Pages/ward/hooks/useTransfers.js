import { useState, useCallback } from 'react';
import axios from 'axios';

const useTransfers = (showToast = null) => {
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState(null);

  const instantTransfer = useCallback(async (transferData) => {
    try {
      setLoading(true);
      setLastError(null);
      
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await axios.post('http://localhost:8080/api/transfers/instant', transferData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (showToast) {
        showToast('success', 'Transfer Successful', 
          `Patient ${response.data.patientName} transferred from ${response.data.fromWardName} to ${response.data.toWardName}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error processing transfer:', error);
      
      let errorMessage = 'Failed to process transfer. ';
      
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to transfer patients.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid transfer request. Please check the details.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Patient admission or ward not found.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Transfer conflict - bed may be occupied or patient already transferred.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (showToast) {
        if (error.response?.status === 401) {
          showToast('error', 'Session Expired', errorMessage);
        } else if (error.response?.status === 403) {
          showToast('error', 'Access Denied', errorMessage);
        } else if (error.response?.status === 400) {
          showToast('error', 'Invalid Request', errorMessage);
        } else if (error.response?.status === 404) {
          showToast('error', 'Not Found', errorMessage);
        } else if (error.response?.status === 409) {
          showToast('error', 'Transfer Conflict', errorMessage);
        } else if (error.response?.status === 500) {
          showToast('error', 'Server Error', errorMessage);
        } else {
          showToast('error', 'Transfer Failed', errorMessage);
        }
      }
      
      setLastError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    loading,
    lastError,
    instantTransfer,
    setLastError
  };
};

export default useTransfers;