import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const useDialysisMachines = (showToast = null) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useRef to store the latest showToast function without causing re-renders
  const showToastRef = useRef(showToast);
  
  // Update the ref whenever showToast changes
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // Helper function to safely call toast
  const safeShowToast = useCallback((type, title, message) => {
    if (showToastRef.current && typeof showToastRef.current === 'function') {
      showToastRef.current(type, title, message);
    }
  }, []); // Empty dependency array - this function never changes

  // Real API calls - no mock data

  const fetchMachines = useCallback(async (silent = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to fetch dialysis machines
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:8080/api/dialysis/machines', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      setMachines(response.data);
      
      if (!silent) {
        safeShowToast('success', 'Machines Loaded', 'Dialysis machines loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching dialysis machines:', error);
      setError(error.message);
      
      if (!silent) {
        safeShowToast('error', 'Load Failed', 'Failed to load dialysis machines');
      }
    } finally {
      setLoading(false);
    }
  }, [safeShowToast]); // safeShowToast is stable

  const updateMachine = useCallback(async (machineId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to update machine
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.put(`http://localhost:8080/api/dialysis/machines/${machineId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state
      setMachines(prev => prev.map(machine => 
        machine.machineId === machineId 
          ? { ...machine, ...response.data }
          : machine
      ));
      
      safeShowToast('success', 'Machine Updated', 'Machine status updated successfully');
    } catch (error) {
      console.error('Error updating dialysis machine:', error);
      setError(error.message);
      
      safeShowToast('error', 'Update Failed', 'Failed to update machine');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [safeShowToast]); // safeShowToast is stable

  const addMachine = useCallback(async (machineData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to add new machine
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.post('http://localhost:8080/api/dialysis/machines', machineData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Add to local state
      const newMachine = {
        ...response.data,
        machineId: response.data.machineId || `M${Date.now()}`,
        status: response.data.status || 'active',
        lastMaintenance: response.data.lastMaintenance || new Date().toISOString().split('T')[0],
        nextMaintenance: response.data.nextMaintenance || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      setMachines(prev => [...prev, newMachine]);
      
      safeShowToast('success', 'Machine Added', 'New dialysis machine added successfully');
      
      return newMachine;
    } catch (error) {
      console.error('Error adding dialysis machine:', error);
      setError(error.message);
      
      safeShowToast('error', 'Add Failed', 'Failed to add dialysis machine');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [safeShowToast]); // safeShowToast is stable

  const deleteMachine = useCallback(async (machineId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to delete machine
      const jwtToken = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:8080/api/dialysis/machines/${machineId}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      
      // Update local state
      setMachines(prev => prev.filter(machine => machine.machineId !== machineId));
      
      safeShowToast('success', 'Machine Removed', 'Dialysis machine removed successfully');
    } catch (error) {
      console.error('Error deleting dialysis machine:', error);
      setError(error.message);
      
      safeShowToast('error', 'Delete Failed', 'Failed to remove machine');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [safeShowToast]); // safeShowToast is stable

  const scheduleMaintenance = useCallback(async (machineId, maintenanceData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to schedule maintenance
      const jwtToken = localStorage.getItem('jwtToken');
      await axios.post(`http://localhost:8080/api/dialysis/machines/${machineId}/maintenance`, 
        maintenanceData, 
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state with maintenance info
      setMachines(prev => prev.map(machine => 
        machine.machineId === machineId 
          ? { 
              ...machine, 
              status: 'maintenance',
              lastMaintenance: maintenanceData.scheduledDate,
              nextMaintenance: maintenanceData.nextMaintenanceDate,
              maintenanceHistory: [
                ...(machine.maintenanceHistory || []),
                {
                  date: maintenanceData.scheduledDate,
                  type: maintenanceData.type,
                  notes: maintenanceData.notes
                }
              ]
            }
          : machine
      ));
      
      safeShowToast('success', 'Maintenance Scheduled', 'Machine maintenance scheduled successfully');
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      setError(error.message);
      
      safeShowToast('error', 'Schedule Failed', 'Failed to schedule maintenance');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [safeShowToast]); // safeShowToast is stable

  const getMachineUtilization = useCallback((machineId, sessions) => {
    const today = new Date().toDateString();
    const machineSessions = sessions.filter(session => 
      session.machineId === machineId && 
      new Date(session.scheduledDate).toDateString() === today
    );

    const utilizationHours = machineSessions.reduce((total, session) => {
      const duration = session.duration || '0h 0m';
      const hours = parseFloat(duration.match(/(\d+)h/) || [0, 0])[1];
      const minutes = parseFloat(duration.match(/(\d+)m/) || [0, 0])[1];
      return total + hours + (minutes / 60);
    }, 0);

    return {
      sessions: machineSessions.length,
      hours: utilizationHours.toFixed(1),
      percentage: Math.round((utilizationHours / 16) * 100) // 16 hours max per day
    };
  }, []);

  const getAvailableMachines = useCallback(() => {
    // Return all active machines - in a real app this would check against scheduled sessions
    return machines.filter(machine => 
      machine.status === 'active'
    );
  }, [machines]);

  // Load machines on component mount - use empty dependency array to prevent infinite loops
  useEffect(() => {
    fetchMachines(true); // Silent load on mount
  }, [fetchMachines]); // fetchMachines is stable now

  return {
    machines,
    loading,
    error,
    fetchMachines,
    updateMachine,
    addMachine,
    deleteMachine,
    scheduleMaintenance,
    getMachineUtilization,
    getAvailableMachines
  };
};

export default useDialysisMachines;