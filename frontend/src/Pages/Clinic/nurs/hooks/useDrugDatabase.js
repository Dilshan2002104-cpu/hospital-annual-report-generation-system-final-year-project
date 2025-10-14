import { useState, useMemo } from 'react';

const useDrugDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);

  // Sample drug database for clinic use
  const drugs = useMemo(() => [
    // Common antibiotics
    {
      id: 1,
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      commonDose: '500mg',
      commonRoute: 'oral',
      category: 'Antibiotic'
    },
    {
      id: 2,
      name: 'Azithromycin',
      genericName: 'Azithromycin',
      commonDose: '250mg',
      commonRoute: 'oral',
      category: 'Antibiotic'
    },
    {
      id: 3,
      name: 'Cephalexin',
      genericName: 'Cephalexin',
      commonDose: '500mg',
      commonRoute: 'oral',
      category: 'Antibiotic'
    },
    
    // Pain relievers
    {
      id: 4,
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      commonDose: '200mg',
      commonRoute: 'oral',
      category: 'Pain Relief'
    },
    {
      id: 5,
      name: 'Acetaminophen',
      genericName: 'Paracetamol',
      commonDose: '500mg',
      commonRoute: 'oral',
      category: 'Pain Relief'
    },
    {
      id: 6,
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      commonDose: '325mg',
      commonRoute: 'oral',
      category: 'Pain Relief'
    },
    
    // Cardiovascular medications
    {
      id: 7,
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      commonDose: '10mg',
      commonRoute: 'oral',
      category: 'Cardiovascular'
    },
    {
      id: 8,
      name: 'Amlodipine',
      genericName: 'Amlodipine',
      commonDose: '5mg',
      commonRoute: 'oral',
      category: 'Cardiovascular'
    },
    {
      id: 9,
      name: 'Atorvastatin',
      genericName: 'Atorvastatin',
      commonDose: '20mg',
      commonRoute: 'oral',
      category: 'Cardiovascular'
    },
    
    // Diabetes medications
    {
      id: 10,
      name: 'Metformin',
      genericName: 'Metformin',
      commonDose: '500mg',
      commonRoute: 'oral',
      category: 'Diabetes'
    },
    {
      id: 11,
      name: 'Insulin',
      genericName: 'Insulin',
      commonDose: '10 units',
      commonRoute: 'injection',
      category: 'Diabetes'
    },
    
    // Respiratory medications
    {
      id: 12,
      name: 'Albuterol Inhaler',
      genericName: 'Salbutamol',
      commonDose: '90mcg per puff',
      commonRoute: 'inhalation',
      category: 'Respiratory'
    },
    {
      id: 13,
      name: 'Prednisolone',
      genericName: 'Prednisolone',
      commonDose: '10mg',
      commonRoute: 'oral',
      category: 'Respiratory'
    },
    
    // Gastrointestinal
    {
      id: 14,
      name: 'Omeprazole',
      genericName: 'Omeprazole',
      commonDose: '20mg',
      commonRoute: 'oral',
      category: 'Gastrointestinal'
    },
    {
      id: 15,
      name: 'Ranitidine',
      genericName: 'Ranitidine',
      commonDose: '150mg',
      commonRoute: 'oral',
      category: 'Gastrointestinal'
    },
    
    // Antihistamines
    {
      id: 16,
      name: 'Cetirizine',
      genericName: 'Cetirizine',
      commonDose: '10mg',
      commonRoute: 'oral',
      category: 'Antihistamine'
    },
    {
      id: 17,
      name: 'Loratadine',
      genericName: 'Loratadine',
      commonDose: '10mg',
      commonRoute: 'oral',
      category: 'Antihistamine'
    },
    
    // Topical medications
    {
      id: 18,
      name: 'Hydrocortisone Cream',
      genericName: 'Hydrocortisone',
      commonDose: '1%',
      commonRoute: 'topical',
      category: 'Topical'
    },
    {
      id: 19,
      name: 'Mupirocin Ointment',
      genericName: 'Mupirocin',
      commonDose: '2%',
      commonRoute: 'topical',
      category: 'Topical'
    },
    
    // Cough and cold
    {
      id: 20,
      name: 'Dextromethorphan Syrup',
      genericName: 'Dextromethorphan',
      commonDose: '15mg/5ml',
      commonRoute: 'oral',
      category: 'Cough & Cold'
    },
    {
      id: 21,
      name: 'Throat Lozenges',
      genericName: 'Benzocaine',
      commonDose: '15mg',
      commonRoute: 'oral',
      category: 'Cough & Cold'
    },
    
    // Vitamins and supplements
    {
      id: 22,
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      commonDose: '1000 IU',
      commonRoute: 'oral',
      category: 'Vitamin'
    },
    {
      id: 23,
      name: 'Vitamin B12',
      genericName: 'Cyanocobalamin',
      commonDose: '1000mcg',
      commonRoute: 'oral',
      category: 'Vitamin'
    },
    {
      id: 24,
      name: 'Iron Supplement',
      genericName: 'Ferrous Sulfate',
      commonDose: '325mg',
      commonRoute: 'oral',
      category: 'Supplement'
    },
    
    // Eye and ear medications
    {
      id: 25,
      name: 'Antibiotic Eye Drops',
      genericName: 'Chloramphenicol',
      commonDose: '0.5%',
      commonRoute: 'ophthalmic',
      category: 'Eye/Ear'
    },
    {
      id: 26,
      name: 'Ear Drops',
      genericName: 'Mineral Oil',
      commonDose: '1-2 drops',
      commonRoute: 'otic',
      category: 'Eye/Ear'
    }
  ], []);

  // Search drugs function
  const searchDrugs = (searchTerm) => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return drugs.filter(drug =>
      drug.name.toLowerCase().includes(term) ||
      drug.genericName.toLowerCase().includes(term) ||
      drug.category.toLowerCase().includes(term)
    );
  };

  // Get drug info function
  const getDrugInfo = (drugId) => {
    return drugs.find(drug => drug.id === drugId);
  };

  // Simulate loading state for API calls
  const simulateLoading = async (duration = 500) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setLoading(false);
  };

  return {
    drugs,
    loading,
    error,
    searchDrugs,
    getDrugInfo,
    simulateLoading
  };
};

export default useDrugDatabase;