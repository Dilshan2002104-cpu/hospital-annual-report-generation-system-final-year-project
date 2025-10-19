#!/bin/bash

# Comprehensive API Fix Script for HMS
# This script replaces ALL localhost URLs with the centralized API configuration

echo "🔧 HMS API Fix - Replacing all localhost URLs with centralized configuration"
echo "=========================================================================="

# Create backup directory
mkdir -p api-fix-backup

# Files that need API imports and URL replacements
declare -A files_and_imports=(
  # Login Form
  ["frontend/src/Pages/LoginForm.jsx"]="../config/api"
  
  # Ward Management
  ["frontend/src/Pages/ward/hooks/useWards.js"]="../../config/api"
  ["frontend/src/Pages/ward/hooks/useWardAnalytics.js"]="../../config/api"
  ["frontend/src/Pages/ward/hooks/useTransfers.js"]="../../config/api"
  ["frontend/src/Pages/ward/hooks/usePrescriptions.js"]="../../config/api"
  ["frontend/src/Pages/ward/hooks/usePatients.js"]="../../config/api"
  ["frontend/src/Pages/ward/hooks/useLabRequests.js"]="../../config/api"
  ["frontend/src/Pages/ward/hooks/useAdmissions.js"]="../../config/api"
  ["frontend/src/Pages/ward/components/WardStatisticsReport.jsx"]="../../config/api"
  ["frontend/src/Pages/ward/components/TestResultsView.jsx"]="../../config/api"
  ["frontend/src/Pages/ward/components/PrescriptionModal.jsx"]="../../config/api"
  ["frontend/src/Pages/ward/components/WardAnalytics.jsx"]="../../config/api"
  ["frontend/src/Pages/ward/components/AllTestResultsView.jsx"]="../../config/api"
  
  # Pharmacy
  ["frontend/src/Pages/pharmacy/hooks/usePrescriptions.js"]="../../config/api"
  ["frontend/src/Pages/pharmacy/hooks/useDrugDatabase.js"]="../../config/api"
  ["frontend/src/Pages/pharmacy/hooks/useInventory.js"]="../../config/api"
  ["frontend/src/Pages/pharmacy/hooks/usePrescriptionWebSocket.js"]="../../config/api"
  ["frontend/src/Pages/pharmacy/components/PrescriptionProcessing.jsx"]="../../config/api"
  ["frontend/src/Pages/pharmacy/components/PharmacyAnalytics.jsx"]="../../config/api"
  ["frontend/src/Pages/pharmacy/components/InventoryAlerts.jsx"]="../../config/api"
  
  # Laboratory
  ["frontend/src/Pages/lab/hooks/useLabEquipment.js"]="../../config/api"
  ["frontend/src/Pages/lab/hooks/useLabResults.js"]="../../config/api"
  ["frontend/src/Pages/lab/hooks/useLabTests.js"]="../../config/api"
  ["frontend/src/Pages/lab/hooks/useSamples.js"]="../../config/api"
  ["frontend/src/Pages/lab/components/TestResultsModal.jsx"]="../../config/api"
  ["frontend/src/Pages/lab/components/TestOrdersManagement.jsx"]="../../config/api"
  
  # Dialysis
  ["frontend/src/Pages/Dialysis/hooks/useDialysisSessions.js"]="../../config/api"
  ["frontend/src/Pages/Dialysis/DialysisDashboard.jsx"]="../config/api"
  ["frontend/src/Pages/Dialysis/components/DialysisAnalytics.jsx"]="../../config/api"
  
  # Clinic
  ["frontend/src/Pages/Clinic/nurs/hooks/usePatients.js"]="../../../config/api"
  ["frontend/src/Pages/Clinic/nurs/hooks/useClinicPrescriptionsApi.js"]="../../../config/api"
  ["frontend/src/Pages/Clinic/nurs/hooks/useDoctors.js"]="../../../config/api"
  ["frontend/src/Pages/Clinic/nurs/hooks/useAppointments.js"]="../../../config/api"
  ["frontend/src/Pages/Clinic/nurs/hooks/useAllAppointments.js"]="../../../config/api"
  
  # Test file
  ["frontend/src/test-prescription-api.js"]="./config/api"
)

# URL replacement mappings for common patterns
declare -A url_replacements=(
  # Authentication
  ["'http://localhost:8080/api/auth/login'"]="API_ENDPOINTS.AUTH.LOGIN"
  
  # Patients
  ["'http://localhost:8080/api/patients/all'"]="API_ENDPOINTS.PATIENTS.ALL"
  ["'http://localhost:8080/api/patients/register'"]="API_ENDPOINTS.PATIENTS.REGISTER"
  
  # Pharmacy
  ["'http://localhost:8080/api/pharmacy/medications/getAll'"]="API_ENDPOINTS.PHARMACY.MEDICATIONS.GET_ALL"
  ["'http://localhost:8080/api/pharmacy/medications/inventory'"]="API_ENDPOINTS.PHARMACY.MEDICATIONS.INVENTORY"
  ["'http://localhost:8080/api/pharmacy/medications/add'"]="API_ENDPOINTS.PHARMACY.MEDICATIONS.ADD"
  ["'http://localhost:8080/api/pharmacy/medications/alerts'"]="API_ENDPOINTS.PHARMACY.MEDICATIONS.ALERTS"
  
  # Prescriptions
  ["'http://localhost:8080/api/prescriptions/all'"]="API_ENDPOINTS.PRESCRIPTIONS.ALL"
  ["'http://localhost:8080/api/prescriptions'"]="API_ENDPOINTS.PRESCRIPTIONS.CREATE"
  ["'http://localhost:8080/api/clinic/prescriptions'"]="API_ENDPOINTS.CLINIC.PRESCRIPTIONS.ALL"
  
  # Wards
  ["'http://localhost:8080/api/wards/getAll'"]="API_ENDPOINTS.WARDS.GET_ALL"
  
  # Admissions
  ["'http://localhost:8080/api/admissions/admit'"]="API_ENDPOINTS.ADMISSIONS.ADMIT"
  ["'http://localhost:8080/api/admissions/active'"]="API_ENDPOINTS.ADMISSIONS.ACTIVE"
  ["'http://localhost:8080/api/admissions/getAll'"]="API_ENDPOINTS.ADMISSIONS.ALL"
  
  # Lab
  ["'http://localhost:8080/api/lab/samples'"]="API_ENDPOINTS.LAB.SAMPLES.ALL"
  ["'http://localhost:8080/api/lab/results'"]="API_ENDPOINTS.LAB.RESULTS.ALL"
  ["'http://localhost:8080/api/lab/test-orders'"]="API_ENDPOINTS.LAB.TEST_ORDERS.ALL"
  ["'http://localhost:8080/api/lab/equipment'"]="API_ENDPOINTS.LAB.EQUIPMENT.ALL"
  ["'http://localhost:8080/api/lab-requests/all'"]="API_ENDPOINTS.LAB.REQUESTS.ALL"
  ["'http://localhost:8080/api/lab-requests/create'"]="API_ENDPOINTS.LAB.REQUESTS.CREATE"
  ["'http://localhost:8080/api/lab-requests/pending'"]="API_ENDPOINTS.LAB.REQUESTS.PENDING"
  
  # Dialysis
  ["'http://localhost:8080/api/dialysis/sessions'"]="API_ENDPOINTS.DIALYSIS.SESSIONS.ALL"
  
  # Appointments
  ["'http://localhost:8080/api/appointments/create'"]="API_ENDPOINTS.APPOINTMENTS.CREATE"
  ["'http://localhost:8080/api/appointments/getAll'"]="API_ENDPOINTS.APPOINTMENTS.ALL"
  
  # Doctors
  ["'http://localhost:8080/api/doctors/getAll'"]="API_ENDPOINTS.DOCTORS.ALL"
  ["'http://localhost:8080/api/doctors/add'"]="API_ENDPOINTS.DOCTORS.ADD"
  
  # Transfers
  ["'http://localhost:8080/api/transfers/instant'"]="API_ENDPOINTS.TRANSFERS.INSTANT"
  ["'http://localhost:8080/api/transfers/all'"]="API_ENDPOINTS.TRANSFERS.ALL"
  
  # Test Results
  ["'http://localhost:8080/api/test-results/all'"]="API_ENDPOINTS.TEST_RESULTS.ALL"
  ["'http://localhost:8080/api/test-results/create-sample-data'"]="API_ENDPOINTS.TEST_RESULTS.CREATE_SAMPLE_DATA"
  ["'http://localhost:8080/api/test-results/save'"]="API_ENDPOINTS.TEST_RESULTS.SAVE"
  
  # Debug
  ["'http://localhost:8080/api/simple-test/hello'"]="API_ENDPOINTS.DEBUG.HELLO"
  ["'http://localhost:8080/api/debug/database-connection'"]="API_ENDPOINTS.DEBUG.DATABASE_CONNECTION"
  ["'http://localhost:8080/api/test-simple/save-basic'"]="API_ENDPOINTS.DEBUG.TEST_SIMPLE_SAVE"
  ["'http://localhost:8080/api/test-results-simple/test-save'"]="API_ENDPOINTS.DEBUG.TEST_RESULTS_SIMPLE"
  
  # WebSocket
  ["'http://localhost:8080/ws'"]="getWebSocketUrl()"
)

# Function to add import statement
add_import_statement() {
  local file="$1"
  local import_path="$2"
  
  if [ -f "$file" ]; then
    # Check if import already exists
    if ! grep -q "from.*config/api" "$file"; then
      # Find the last import line and add our import after it
      if grep -q "^import" "$file"; then
        # Add after last import
        sed -i "/^import.*from/a import { API_ENDPOINTS, API_BASE_URL, getWebSocketUrl } from '$import_path';" "$file"
      else
        # Add at the beginning if no imports exist
        sed -i "1i import { API_ENDPOINTS, API_BASE_URL, getWebSocketUrl } from '$import_path';" "$file"
      fi
      echo "  ✅ Added import to $file"
    else
      echo "  ⏭️  Import already exists in $file"
    fi
  fi
}

# Function to replace URLs
replace_urls() {
  local file="$1"
  
  if [ -f "$file" ]; then
    echo "  🔄 Processing URL replacements in $file"
    
    # Create backup
    cp "$file" "api-fix-backup/$(basename $file).backup"
    
    # Replace simple static URLs first
    for old_url in "${!url_replacements[@]}"; do
      new_endpoint="${url_replacements[$old_url]}"
      sed -i "s|$old_url|$new_endpoint|g" "$file"
    done
    
    # Handle dynamic URLs with parameters
    # Replace parameterized URLs (this is more complex and might need manual review)
    sed -i 's|`http://localhost:8080/api/patients/${nationalId}`|API_ENDPOINTS.PATIENTS.BY_ID(nationalId)|g' "$file"
    sed -i 's|`http://localhost:8080/api/patients/${patientNationalId}`|API_ENDPOINTS.PATIENTS.BY_ID(patientNationalId)|g' "$file"
    sed -i 's|`http://localhost:8080/api/prescriptions/${prescriptionId}`|API_ENDPOINTS.PRESCRIPTIONS.BY_ID(prescriptionId)|g' "$file"
    sed -i 's|`http://localhost:8080/api/prescriptions/${prescriptionId}/items`|API_ENDPOINTS.PRESCRIPTIONS.ITEMS(prescriptionId)|g' "$file"
    sed -i 's|`http://localhost:8080/api/prescriptions/${prescriptionId}/items/${itemId}`|API_ENDPOINTS.PRESCRIPTIONS.ITEM_BY_ID(prescriptionId, itemId)|g' "$file"
    
    # Replace WebSocket URLs
    sed -i "s|'http://localhost:8080/ws'|getWebSocketUrl()|g" "$file"
    
    echo "  ✅ Completed URL replacements in $file"
  fi
}

# Main processing loop
echo "📁 Processing ${#files_and_imports[@]} files..."
echo ""

for file in "${!files_and_imports[@]}"; do
  import_path="${files_and_imports[$file]}"
  
  echo "🔧 Processing: $file"
  
  # Add import statement
  add_import_statement "$file" "$import_path"
  
  # Replace URLs
  replace_urls "$file"
  
  echo ""
done

echo "🎉 API Fix completed!"
echo ""
echo "📊 Summary:"
echo "  • Updated ${#files_and_imports[@]} files"
echo "  • Replaced ${#url_replacements[@]} URL patterns"
echo "  • Created backups in api-fix-backup/"
echo ""
echo "📋 Next steps:"
echo "  1. Review the changes: git diff"
echo "  2. Test the application locally"
echo "  3. Commit changes: git add . && git commit -m 'Fix all localhost URLs with centralized API config'"
echo "  4. Rebuild frontend Docker image"
echo "  5. Deploy to EC2"
echo ""
echo "🔗 All APIs now use:"
echo "  • API_ENDPOINTS.* for static URLs"
echo "  • Function calls for dynamic URLs"
echo "  • getWebSocketUrl() for WebSocket connections"