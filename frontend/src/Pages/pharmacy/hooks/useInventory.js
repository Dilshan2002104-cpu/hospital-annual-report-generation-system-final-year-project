import { useState, useEffect, useCallback } from 'react';

export default function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock inventory data
  const generateMockInventory = () => {
    return [
      {
        drugId: 'INV001',
        drugName: 'Lisinopril',
        genericName: 'Lisinopril',
        category: 'cardiovascular',
        strength: '10mg',
        dosageForm: 'Tablet',
        manufacturer: 'Pfizer',
        batchNumber: 'LIS2024001',
        currentStock: 250,
        minimumStock: 50,
        maximumStock: 500,
        unitCost: 0.45,
        expiryDate: '2025-08-15',
        location: 'A-1-01',
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        drugId: 'INV002',
        drugName: 'Metformin',
        genericName: 'Metformin HCl',
        category: 'diabetes',
        strength: '500mg',
        dosageForm: 'Tablet',
        manufacturer: 'Teva',
        batchNumber: 'MET2024002',
        currentStock: 180,
        minimumStock: 100,
        maximumStock: 400,
        unitCost: 0.32,
        expiryDate: '2025-11-30',
        location: 'B-2-03',
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        drugId: 'INV003',
        drugName: 'Amoxicillin',
        genericName: 'Amoxicillin',
        category: 'antibiotics',
        strength: '500mg',
        dosageForm: 'Capsule',
        manufacturer: 'Sandoz',
        batchNumber: 'AMX2024003',
        currentStock: 75,
        minimumStock: 100,
        maximumStock: 300,
        unitCost: 1.25,
        expiryDate: '2025-06-20',
        location: 'C-1-02',
        lastUpdated: new Date().toISOString()
      },
      {
        drugId: 'INV004',
        drugName: 'Atorvastatin',
        genericName: 'Atorvastatin Calcium',
        category: 'cardiovascular',
        strength: '20mg',
        dosageForm: 'Tablet',
        manufacturer: 'Lipitor',
        batchNumber: 'ATO2024004',
        currentStock: 320,
        minimumStock: 80,
        maximumStock: 400,
        unitCost: 2.15,
        expiryDate: '2025-09-10',
        location: 'A-2-01',
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        drugId: 'INV005',
        drugName: 'Omeprazole',
        genericName: 'Omeprazole',
        category: 'gastrointestinal',
        strength: '20mg',
        dosageForm: 'Capsule',
        manufacturer: 'Dr. Reddy\'s',
        batchNumber: 'OME2024005',
        currentStock: 45,
        minimumStock: 60,
        maximumStock: 250,
        unitCost: 0.85,
        expiryDate: '2025-03-15',
        location: 'D-1-01',
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        drugId: 'INV006',
        drugName: 'Ibuprofen',
        genericName: 'Ibuprofen',
        category: 'analgesics',
        strength: '400mg',
        dosageForm: 'Tablet',
        manufacturer: 'Generic Co',
        batchNumber: 'IBU2024006',
        currentStock: 0,
        minimumStock: 100,
        maximumStock: 500,
        unitCost: 0.25,
        expiryDate: '2025-07-25',
        location: 'E-1-03',
        lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        drugId: 'INV007',
        drugName: 'Warfarin',
        genericName: 'Warfarin Sodium',
        category: 'cardiovascular',
        strength: '5mg',
        dosageForm: 'Tablet',
        manufacturer: 'Coumadin',
        batchNumber: 'WAR2024007',
        currentStock: 95,
        minimumStock: 30,
        maximumStock: 150,
        unitCost: 3.45,
        expiryDate: '2025-01-20',
        location: 'A-3-01',
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        drugId: 'INV008',
        drugName: 'Aspirin',
        genericName: 'Acetylsalicylic Acid',
        category: 'analgesics',
        strength: '81mg',
        dosageForm: 'Tablet',
        manufacturer: 'Bayer',
        batchNumber: 'ASP2024008',
        currentStock: 35,
        minimumStock: 50,
        maximumStock: 200,
        unitCost: 0.15,
        expiryDate: '2024-12-31',
        location: 'E-2-01',
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  // Initialize inventory
  useEffect(() => {
    const initializeInventory = () => {
      try {
        setLoading(true);
        const mockData = generateMockInventory();
        setInventory(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load inventory');
        console.error('Error loading inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeInventory();
  }, []);

  // Update stock
  const updateStock = useCallback(async (drugId, newStock, reason = '') => {
    try {
      setInventory(prev => prev.map(item => 
        item.drugId === drugId 
          ? { 
              ...item, 
              currentStock: newStock,
              lastUpdated: new Date().toISOString()
            }
          : item
      ));
      
      return { success: true };
    } catch (err) {
      setError('Failed to update stock');
      throw err;
    }
  }, []);

  // Add inventory item
  const addInventoryItem = useCallback(async (itemData) => {
    try {
      const newItem = {
        ...itemData,
        drugId: `INV${String(Date.now()).slice(-3)}`,
        lastUpdated: new Date().toISOString()
      };
      
      setInventory(prev => [newItem, ...prev]);
      return { success: true };
    } catch (err) {
      setError('Failed to add inventory item');
      throw err;
    }
  }, []);

  // Get low stock items
  const getLowStockItems = useCallback(() => {
    return inventory.filter(item => 
      item.currentStock <= item.minimumStock && item.currentStock > 0
    );
  }, [inventory]);

  // Get out of stock items
  const getOutOfStockItems = useCallback(() => {
    return inventory.filter(item => item.currentStock === 0);
  }, [inventory]);

  // Get expiring items (within 60 days)
  const getExpiringItems = useCallback((days = 60) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return inventory.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= cutoffDate;
    });
  }, [inventory]);

  // Search inventory
  const searchInventory = useCallback((searchTerm, category = 'all') => {
    return inventory.filter(item => {
      const matchesSearch = !searchTerm || 
        item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === 'all' || item.category === category;
      
      return matchesSearch && matchesCategory;
    });
  }, [inventory]);

  // Get inventory statistics
  const getStats = useCallback(() => {
    const totalItems = inventory.length;
    const lowStockCount = getLowStockItems().length;
    const outOfStockCount = getOutOfStockItems().length;
    const expiringCount = getExpiringItems(30).length; // Items expiring in 30 days
    
    const totalValue = inventory.reduce((total, item) => {
      return total + (item.currentStock * item.unitCost);
    }, 0);

    const categories = [...new Set(inventory.map(item => item.category))];
    
    return {
      totalItems,
      lowStockAlerts: lowStockCount,
      outOfStockAlerts: outOfStockCount,
      expiryAlerts: expiringCount,
      totalValue: Math.round(totalValue),
      categories,
      averageStockLevel: totalItems > 0 ? Math.round(
        inventory.reduce((sum, item) => sum + (item.currentStock / item.maximumStock * 100), 0) / totalItems
      ) : 0
    };
  }, [inventory, getLowStockItems, getOutOfStockItems, getExpiringItems]);

  // Reorder suggestions
  const getReorderSuggestions = useCallback(() => {
    return inventory.filter(item => {
      const stockPercent = (item.currentStock / item.maximumStock) * 100;
      return stockPercent <= 30; // Items with less than 30% stock
    }).map(item => ({
      ...item,
      suggestedOrder: item.maximumStock - item.currentStock,
      urgency: item.currentStock <= item.minimumStock ? 'high' : 'medium'
    }));
  }, [inventory]);

  // Batch operations
  const updateMultipleStock = useCallback(async (updates) => {
    try {
      setInventory(prev => prev.map(item => {
        const update = updates.find(u => u.drugId === item.drugId);
        return update ? {
          ...item,
          currentStock: update.newStock,
          lastUpdated: new Date().toISOString()
        } : item;
      }));
      
      return { success: true };
    } catch (err) {
      setError('Failed to update multiple stock items');
      throw err;
    }
  }, []);

  return {
    inventory,
    loading,
    error,
    updateStock,
    addInventoryItem,
    getLowStockItems,
    getOutOfStockItems,
    getExpiringItems,
    searchInventory,
    getStats,
    getReorderSuggestions,
    updateMultipleStock
  };
}