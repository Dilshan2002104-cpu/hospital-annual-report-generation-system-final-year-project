import { useState, useEffect, useCallback } from 'react';

export default function useDrugDatabase() {
  const [drugDatabase, setDrugDatabase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock drug database
  const generateMockDrugDatabase = () => {
    return [
      {
        drugId: 'DRUG001',
        brandName: 'Lisinopril',
        genericName: 'Lisinopril',
        activeIngredient: 'Lisinopril',
        strength: '10mg',
        category: 'cardiovascular',
        dosageForm: 'Tablet',
        manufacturer: 'Various',
        indications: [
          'Hypertension',
          'Heart failure',
          'Post-myocardial infarction'
        ],
        dosage: 'Initial: 10mg once daily; Maintenance: 20-40mg once daily',
        route: 'Oral',
        warnings: [
          'May cause angioedema',
          'Monitor kidney function',
          'Avoid in pregnancy'
        ],
        contraindications: [
          'Angioedema history',
          'Pregnancy',
          'Bilateral renal artery stenosis'
        ],
        sideEffects: {
          common: ['Dry cough', 'Dizziness', 'Headache'],
          serious: ['Angioedema', 'Hyperkalemia', 'Renal impairment'],
          rare: ['Liver dysfunction', 'Bone marrow depression']
        },
        interactions: ['Potassium supplements', 'NSAIDs', 'Lithium']
      },
      {
        drugId: 'DRUG002',
        brandName: 'Metformin',
        genericName: 'Metformin HCl',
        activeIngredient: 'Metformin Hydrochloride',
        strength: '500mg',
        category: 'diabetes',
        dosageForm: 'Tablet',
        manufacturer: 'Various',
        indications: [
          'Type 2 diabetes mellitus',
          'Polycystic ovary syndrome'
        ],
        dosage: 'Initial: 500mg twice daily; Maximum: 2000mg daily',
        route: 'Oral',
        warnings: [
          'Risk of lactic acidosis',
          'Discontinue before contrast procedures',
          'Monitor B12 levels'
        ],
        contraindications: [
          'Severe kidney disease',
          'Metabolic acidosis',
          'Severe heart failure'
        ],
        sideEffects: {
          common: ['Nausea', 'Diarrhea', 'Metallic taste'],
          serious: ['Lactic acidosis', 'B12 deficiency'],
          rare: ['Severe hypoglycemia with other agents']
        },
        interactions: ['Contrast agents', 'Alcohol', 'Cimetidine']
      },
      {
        drugId: 'DRUG003',
        brandName: 'Amoxicillin',
        genericName: 'Amoxicillin',
        activeIngredient: 'Amoxicillin',
        strength: '500mg',
        category: 'antibiotics',
        dosageForm: 'Capsule',
        manufacturer: 'Various',
        indications: [
          'Bacterial infections',
          'Pneumonia',
          'Urinary tract infections',
          'Skin infections'
        ],
        dosage: 'Adults: 500mg every 8 hours or 875mg every 12 hours',
        route: 'Oral',
        warnings: [
          'Penicillin allergy risk',
          'C. difficile-associated diarrhea',
          'Complete full course'
        ],
        contraindications: [
          'Penicillin allergy',
          'Previous amoxicillin-induced liver injury'
        ],
        sideEffects: {
          common: ['Nausea', 'Diarrhea', 'Rash'],
          serious: ['Anaphylaxis', 'C. difficile colitis'],
          rare: ['Stevens-Johnson syndrome', 'Hepatotoxicity']
        },
        interactions: ['Warfarin', 'Methotrexate', 'Oral contraceptives']
      },
      {
        drugId: 'DRUG004',
        brandName: 'Atorvastatin',
        genericName: 'Atorvastatin Calcium',
        activeIngredient: 'Atorvastatin',
        strength: '20mg',
        category: 'cardiovascular',
        dosageForm: 'Tablet',
        manufacturer: 'Various',
        indications: [
          'Hypercholesterolemia',
          'Cardiovascular risk reduction',
          'Familial hypercholesterolemia'
        ],
        dosage: 'Initial: 20mg once daily; Range: 10-80mg daily',
        route: 'Oral',
        warnings: [
          'Monitor liver enzymes',
          'Risk of myopathy',
          'Avoid grapefruit juice'
        ],
        contraindications: [
          'Active liver disease',
          'Pregnancy',
          'Breastfeeding'
        ],
        sideEffects: {
          common: ['Muscle pain', 'Headache', 'Nausea'],
          serious: ['Rhabdomyolysis', 'Hepatotoxicity'],
          rare: ['Memory loss', 'Diabetes mellitus']
        },
        interactions: ['Warfarin', 'Cyclosporine', 'Gemfibrozil']
      },
      {
        drugId: 'DRUG005',
        brandName: 'Omeprazole',
        genericName: 'Omeprazole',
        activeIngredient: 'Omeprazole',
        strength: '20mg',
        category: 'gastrointestinal',
        dosageForm: 'Capsule',
        manufacturer: 'Various',
        indications: [
          'Gastroesophageal reflux disease',
          'Peptic ulcer disease',
          'H. pylori eradication'
        ],
        dosage: 'GERD: 20mg once daily; Ulcer: 40mg once daily',
        route: 'Oral',
        warnings: [
          'Long-term use risks',
          'B12 and magnesium deficiency',
          'C. difficile risk'
        ],
        contraindications: [
          'Hypersensitivity to PPIs'
        ],
        sideEffects: {
          common: ['Headache', 'Nausea', 'Diarrhea'],
          serious: ['Bone fractures', 'Kidney disease'],
          rare: ['Hypomagnesemia', 'B12 deficiency']
        },
        interactions: ['Clopidogrel', 'Warfarin', 'Phenytoin']
      },
      {
        drugId: 'DRUG006',
        brandName: 'Ibuprofen',
        genericName: 'Ibuprofen',
        activeIngredient: 'Ibuprofen',
        strength: '400mg',
        category: 'analgesics',
        dosageForm: 'Tablet',
        manufacturer: 'Various',
        indications: [
          'Pain relief',
          'Inflammation',
          'Fever reduction'
        ],
        dosage: 'Adults: 400mg every 4-6 hours; Maximum: 1200mg daily',
        route: 'Oral',
        warnings: [
          'GI bleeding risk',
          'Cardiovascular risk',
          'Take with food'
        ],
        contraindications: [
          'Severe heart failure',
          'Active GI bleeding',
          'Severe kidney disease'
        ],
        sideEffects: {
          common: ['Stomach upset', 'Heartburn', 'Dizziness'],
          serious: ['GI bleeding', 'Heart attack', 'Stroke'],
          rare: ['Liver damage', 'Kidney failure']
        },
        interactions: ['Warfarin', 'ACE inhibitors', 'Lithium']
      },
      {
        drugId: 'DRUG007',
        brandName: 'Warfarin',
        genericName: 'Warfarin Sodium',
        activeIngredient: 'Warfarin',
        strength: '5mg',
        category: 'cardiovascular',
        dosageForm: 'Tablet',
        manufacturer: 'Various',
        indications: [
          'Atrial fibrillation',
          'Venous thromboembolism',
          'Mechanical heart valves'
        ],
        dosage: 'Initial: 5-10mg daily; Adjust based on INR',
        route: 'Oral',
        warnings: [
          'Regular INR monitoring required',
          'High bleeding risk',
          'Many drug interactions'
        ],
        contraindications: [
          'Active bleeding',
          'Pregnancy',
          'Severe liver disease'
        ],
        sideEffects: {
          common: ['Bleeding', 'Bruising'],
          serious: ['Major hemorrhage', 'Intracranial bleeding'],
          rare: ['Skin necrosis', 'Purple toe syndrome']
        },
        interactions: ['Aspirin', 'Antibiotics', 'Antifungals', 'Many others']
      },
      {
        drugId: 'DRUG008',
        brandName: 'Aspirin',
        genericName: 'Acetylsalicylic Acid',
        activeIngredient: 'Acetylsalicylic Acid',
        strength: '81mg',
        category: 'analgesics',
        dosageForm: 'Tablet',
        manufacturer: 'Various',
        indications: [
          'Cardiovascular protection',
          'Pain relief',
          'Anti-inflammatory'
        ],
        dosage: 'Cardioprotection: 81mg daily; Pain: 325-650mg every 4 hours',
        route: 'Oral',
        warnings: [
          'GI bleeding risk',
          'Reye syndrome in children',
          'Avoid before surgery'
        ],
        contraindications: [
          'Active bleeding',
          'Children with viral illness',
          'Severe liver disease'
        ],
        sideEffects: {
          common: ['Stomach irritation', 'Heartburn'],
          serious: ['GI bleeding', 'Allergic reactions'],
          rare: ['Reye syndrome', 'Hearing loss']
        },
        interactions: ['Warfarin', 'Methotrexate', 'ACE inhibitors']
      }
    ];
  };

  // Initialize drug database
  useEffect(() => {
    const initializeDrugDatabase = () => {
      try {
        setLoading(true);
        const mockData = generateMockDrugDatabase();
        setDrugDatabase(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load drug database');
        console.error('Error loading drug database:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeDrugDatabase();
  }, []);

  // Search drugs
  const searchDrug = useCallback(async (searchTerm, category = 'all') => {
    try {
      const results = drugDatabase.filter(drug => {
        const matchesSearch = !searchTerm || 
          drug.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drug.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = category === 'all' || drug.category === category;
        
        return matchesSearch && matchesCategory;
      });

      return results;
    } catch (err) {
      setError('Failed to search drugs');
      throw err;
    }
  }, [drugDatabase]);

  // Get detailed drug information
  const getDrugInfo = useCallback(async (drugId) => {
    try {
      const drug = drugDatabase.find(d => d.drugId === drugId);
      if (!drug) {
        throw new Error('Drug not found');
      }

      // Simulate API call with additional details
      return {
        ...drug,
        pharmacokinetics: {
          absorption: 'Well absorbed orally',
          distribution: 'Widely distributed',
          metabolism: 'Hepatic',
          elimination: 'Renal'
        },
        monitoring: [
          'Efficacy',
          'Side effects',
          'Drug interactions'
        ],
        patientCounseling: [
          'Take as directed',
          'Do not stop abruptly',
          'Report side effects'
        ]
      };
    } catch (err) {
      setError('Failed to get drug information');
      throw err;
    }
  }, [drugDatabase]);

  // Check drug interactions
  const checkInteractions = useCallback(async (drugNames) => {
    try {
      if (drugNames.length < 2) {
        return [];
      }

      const interactions = [];
      const normalizedNames = drugNames.map(name => name.toLowerCase().trim());

      // Define known interactions (simplified)
      const knownInteractions = {
        'warfarin+aspirin': {
          severity: 'major',
          drugs: ['Warfarin', 'Aspirin'],
          description: 'Increased risk of bleeding due to additive anticoagulant effects',
          recommendation: 'Monitor INR closely and watch for bleeding signs'
        },
        'warfarin+amoxicillin': {
          severity: 'moderate',
          drugs: ['Warfarin', 'Amoxicillin'],
          description: 'Antibiotics may enhance warfarin effect',
          recommendation: 'Monitor INR more frequently during antibiotic course'
        },
        'metformin+ibuprofen': {
          severity: 'moderate',
          drugs: ['Metformin', 'Ibuprofen'],
          description: 'NSAIDs may impair kidney function affecting metformin clearance',
          recommendation: 'Monitor kidney function and blood glucose'
        },
        'lisinopril+ibuprofen': {
          severity: 'moderate',
          drugs: ['Lisinopril', 'Ibuprofen'],
          description: 'NSAIDs may reduce ACE inhibitor effectiveness',
          recommendation: 'Monitor blood pressure and kidney function'
        },
        'atorvastatin+warfarin': {
          severity: 'moderate',
          drugs: ['Atorvastatin', 'Warfarin'],
          description: 'Statins may enhance warfarin effect',
          recommendation: 'Monitor INR when starting or stopping statin'
        }
      };

      // Check all possible combinations
      for (let i = 0; i < normalizedNames.length; i++) {
        for (let j = i + 1; j < normalizedNames.length; j++) {
          const combo1 = `${normalizedNames[i]}+${normalizedNames[j]}`;
          const combo2 = `${normalizedNames[j]}+${normalizedNames[i]}`;
          
          if (knownInteractions[combo1]) {
            interactions.push(knownInteractions[combo1]);
          } else if (knownInteractions[combo2]) {
            interactions.push(knownInteractions[combo2]);
          }
        }
      }

      return interactions;
    } catch (err) {
      setError('Failed to check drug interactions');
      throw err;
    }
  }, []);

  // Get drugs by category
  const getDrugsByCategory = useCallback((category) => {
    return drugDatabase.filter(drug => drug.category === category);
  }, [drugDatabase]);

  // Get all categories
  const getCategories = useCallback(() => {
    return [...new Set(drugDatabase.map(drug => drug.category))];
  }, [drugDatabase]);

  // Add drug to database
  const addDrug = useCallback(async (drugData) => {
    try {
      const newDrug = {
        ...drugData,
        drugId: `DRUG${String(Date.now()).slice(-3)}`
      };
      
      setDrugDatabase(prev => [newDrug, ...prev]);
      return { success: true };
    } catch (err) {
      setError('Failed to add drug');
      throw err;
    }
  }, []);

  // Update drug information
  const updateDrug = useCallback(async (drugId, updateData) => {
    try {
      setDrugDatabase(prev => prev.map(drug => 
        drug.drugId === drugId 
          ? { ...drug, ...updateData }
          : drug
      ));
      
      return { success: true };
    } catch (err) {
      setError('Failed to update drug');
      throw err;
    }
  }, []);

  return {
    drugDatabase,
    loading,
    error,
    searchDrug,
    getDrugInfo,
    checkInteractions,
    getDrugsByCategory,
    getCategories,
    addDrug,
    updateDrug
  };
}