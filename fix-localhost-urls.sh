#!/bin/bash

# Script to replace all localhost:8080 URLs with dynamic API configuration
# This will fix the hardcoded localhost URLs throughout the frontend

echo "🔧 Fixing hardcoded localhost URLs in frontend..."

# Create backup directory
mkdir -p backup

# Files to process (all files with localhost:8080)
files=(
  "frontend/src/test-prescription-api.js"
  "frontend/src/Pages/pharmacy/hooks/usePrescriptionWebSocket.js"
  "frontend/src/Pages/pharmacy/hooks/usePrescriptions.js"
  "frontend/src/Pages/pharmacy/hooks/useDrugDatabase.js"
  "frontend/src/Pages/pharmacy/hooks/useInventory.js"
  "frontend/src/Pages/ward/hooks/useWards.js"
  "frontend/src/Pages/ward/components/PrescriptionModal.jsx"
  "frontend/src/Pages/ward/hooks/useWardAnalytics.js"
  "frontend/src/Pages/ward/hooks/useTransfers.js"
  "frontend/src/Pages/ward/components/AllTestResultsView.jsx"
  "frontend/src/Pages/ward/hooks/usePatients.js"
  "frontend/src/Pages/ward/hooks/usePrescriptions.js"
  "frontend/src/Pages/ward/hooks/useLabRequests.js"
  "frontend/src/Pages/ward/hooks/useAdmissions.js"
  "frontend/src/Pages/lab/hooks/useSamples.js"
  "frontend/src/Pages/lab/hooks/useLabResults.js"
  "frontend/src/Pages/lab/hooks/useLabTests.js"
  "frontend/src/Pages/lab/hooks/useLabEquipment.js"
  "frontend/src/Pages/lab/components/TestResultsModal.jsx"
  "frontend/src/Pages/lab/components/TestOrdersManagement.jsx"
  "frontend/src/Pages/Dialysis/hooks/useDialysisSessions.js"
  "frontend/src/Pages/Clinic/nurs/hooks/usePatients.js"
  "frontend/src/Pages/Clinic/nurs/hooks/useClinicPrescriptionsApi.js"
  "frontend/src/Pages/Clinic/nurs/hooks/useDoctors.js"
  "frontend/src/Pages/Clinic/nurs/hooks/useAppointments.js"
  "frontend/src/Pages/Clinic/nurs/hooks/useAllAppointments.js"
)

# Add import statement and replace URLs
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    
    # Create backup
    cp "$file" "backup/$(basename $file).backup"
    
    # Add import if not exists
    if ! grep -q "import.*API_BASE_URL\|import.*api.js" "$file"; then
      # Find the last import line and add our import after it
      sed -i '/^import.*from/a import { API_BASE_URL } from '"'"'../config/api'"'"';' "$file" 2>/dev/null || \
      sed -i '/^import.*from/a import { API_BASE_URL } from '"'"'../../config/api'"'"';' "$file" 2>/dev/null || \
      sed -i '/^import.*from/a import { API_BASE_URL } from '"'"'../../../config/api'"'"';' "$file" 2>/dev/null || \
      sed -i '/^import.*from/a import { API_BASE_URL } from '"'"'../../../../config/api'"'"';' "$file"
    fi
    
    # Replace localhost URLs
    sed -i 's|http://localhost:8080|${API_BASE_URL}|g' "$file"
    
    # Fix template literals
    sed -i 's|\${API_BASE_URL}/api|`${API_BASE_URL}/api|g' "$file"
    sed -i 's|\${API_BASE_URL}/ws|`${API_BASE_URL}/ws|g' "$file"
    
    echo "✅ Updated: $file"
  else
    echo "❌ File not found: $file"
  fi
done

echo "🎉 All files processed!"
echo "📁 Backups saved in ./backup/"
echo ""
echo "Next steps:"
echo "1. Commit the changes: git add . && git commit -m 'Fix hardcoded localhost URLs'"
echo "2. Push to GitHub: git push origin main"
echo "3. Rebuild and redeploy Docker images"