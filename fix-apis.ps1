# PowerShell script to fix all localhost URLs in HMS frontend
# This script systematically replaces localhost URLs with API_ENDPOINTS

Write-Host "🔧 HMS API Fix - Replacing all localhost URLs" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Create backup directory
New-Item -ItemType Directory -Force -Path "api-fix-backup" | Out-Null

# Define files and their relative import paths
$filesToFix = @{
    # Ward Management
    "frontend\src\Pages\ward\hooks\useWardAnalytics.js" = "../../config/api"
    "frontend\src\Pages\ward\hooks\useTransfers.js" = "../../config/api"
    "frontend\src\Pages\ward\hooks\usePrescriptions.js" = "../../config/api"
    "frontend\src\Pages\ward\hooks\usePatients.js" = "../../config/api"
    "frontend\src\Pages\ward\hooks\useLabRequests.js" = "../../config/api"
    "frontend\src\Pages\ward\hooks\useAdmissions.js" = "../../config/api"
    
    # Pharmacy
    "frontend\src\Pages\pharmacy\hooks\usePrescriptions.js" = "../../config/api"
    "frontend\src\Pages\pharmacy\hooks\useDrugDatabase.js" = "../../config/api"
    "frontend\src\Pages\pharmacy\hooks\useInventory.js" = "../../config/api"
    "frontend\src\Pages\pharmacy\hooks\usePrescriptionWebSocket.js" = "../../config/api"
    
    # Lab
    "frontend\src\Pages\lab\hooks\useLabEquipment.js" = "../../config/api"
    "frontend\src\Pages\lab\hooks\useLabResults.js" = "../../config/api"
    "frontend\src\Pages\lab\hooks\useLabTests.js" = "../../config/api"
    "frontend\src\Pages\lab\hooks\useSamples.js" = "../../config/api"
    
    # Dialysis
    "frontend\src\Pages\Dialysis\hooks\useDialysisSessions.js" = "../../config/api"
    
    # Clinic
    "frontend\src\Pages\Clinic\nurs\hooks\usePatients.js" = "../../../config/api"
    "frontend\src\Pages\Clinic\nurs\hooks\useClinicPrescriptionsApi.js" = "../../../config/api"
    "frontend\src\Pages\Clinic\nurs\hooks\useDoctors.js" = "../../../config/api"
    "frontend\src\Pages\Clinic\nurs\hooks\useAppointments.js" = "../../../config/api"
    "frontend\src\Pages\Clinic\nurs\hooks\useAllAppointments.js" = "../../../config/api"
}

# URL replacement mappings
$urlReplacements = @{
    "'http://localhost:8080/api/auth/login'" = "API_ENDPOINTS.AUTH.LOGIN"
    "'http://localhost:8080/api/patients/all'" = "API_ENDPOINTS.PATIENTS.ALL"
    "'http://localhost:8080/api/patients/register'" = "API_ENDPOINTS.PATIENTS.REGISTER"
    "'http://localhost:8080/api/pharmacy/medications/getAll'" = "API_ENDPOINTS.PHARMACY.MEDICATIONS.GET_ALL"
    "'http://localhost:8080/api/pharmacy/medications/inventory'" = "API_ENDPOINTS.PHARMACY.MEDICATIONS.INVENTORY"
    "'http://localhost:8080/api/pharmacy/medications/add'" = "API_ENDPOINTS.PHARMACY.MEDICATIONS.ADD"
    "'http://localhost:8080/api/prescriptions/all'" = "API_ENDPOINTS.PRESCRIPTIONS.ALL"
    "'http://localhost:8080/api/prescriptions'" = "API_ENDPOINTS.PRESCRIPTIONS.CREATE"
    "'http://localhost:8080/api/clinic/prescriptions'" = "API_ENDPOINTS.CLINIC.PRESCRIPTIONS.ALL"
    "'http://localhost:8080/api/wards/getAll'" = "API_ENDPOINTS.WARDS.GET_ALL"
    "'http://localhost:8080/api/admissions/admit'" = "API_ENDPOINTS.ADMISSIONS.ADMIT"
    "'http://localhost:8080/api/admissions/active'" = "API_ENDPOINTS.ADMISSIONS.ACTIVE"
    "'http://localhost:8080/api/admissions/getAll'" = "API_ENDPOINTS.ADMISSIONS.ALL"
    "'http://localhost:8080/api/lab/samples'" = "API_ENDPOINTS.LAB.SAMPLES.ALL"
    "'http://localhost:8080/api/lab/results'" = "API_ENDPOINTS.LAB.RESULTS.ALL"
    "'http://localhost:8080/api/lab/test-orders'" = "API_ENDPOINTS.LAB.TEST_ORDERS.ALL"
    "'http://localhost:8080/api/lab/equipment'" = "API_ENDPOINTS.LAB.EQUIPMENT.ALL"
    "'http://localhost:8080/api/lab-requests/all'" = "API_ENDPOINTS.LAB.REQUESTS.ALL"
    "'http://localhost:8080/api/lab-requests/create'" = "API_ENDPOINTS.LAB.REQUESTS.CREATE"
    "'http://localhost:8080/api/dialysis/sessions'" = "API_ENDPOINTS.DIALYSIS.SESSIONS.ALL"
    "'http://localhost:8080/api/appointments/create'" = "API_ENDPOINTS.APPOINTMENTS.CREATE"
    "'http://localhost:8080/api/appointments/getAll'" = "API_ENDPOINTS.APPOINTMENTS.ALL"
    "'http://localhost:8080/api/doctors/getAll'" = "API_ENDPOINTS.DOCTORS.ALL"
    "'http://localhost:8080/api/transfers/instant'" = "API_ENDPOINTS.TRANSFERS.INSTANT"
    "'http://localhost:8080/api/transfers/all'" = "API_ENDPOINTS.TRANSFERS.ALL"
    "'http://localhost:8080/ws'" = "getWebSocketUrl()"
}

function Add-ImportStatement {
    param($filePath, $importPath)
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if import already exists
        if ($content -notmatch "from.*config/api") {
            $lines = Get-Content $filePath
            $importAdded = $false
            
            # Find last import line and add after it
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "^import.*from" -and $i -lt $lines.Count - 1) {
                    $nextLineNotImport = $lines[$i + 1] -notmatch "^import"
                    if ($nextLineNotImport) {
                        $lines = $lines[0..$i] + "import { API_ENDPOINTS, API_BASE_URL, getWebSocketUrl } from '$importPath';" + $lines[($i + 1)..($lines.Count - 1)]
                        $importAdded = $true
                        break
                    }
                }
            }
            
            if ($importAdded) {
                $lines | Set-Content $filePath
                Write-Host "  ✅ Added import to $(Split-Path $filePath -Leaf)" -ForegroundColor Green
            }
        } else {
            Write-Host "  ⏭️  Import already exists in $(Split-Path $filePath -Leaf)" -ForegroundColor Yellow
        }
    }
}

function Replace-URLs {
    param($filePath)
    
    if (Test-Path $filePath) {
        Write-Host "  🔄 Processing URL replacements in $(Split-Path $filePath -Leaf)" -ForegroundColor Cyan
        
        # Create backup
        $backupName = "api-fix-backup\$(Split-Path $filePath -Leaf).backup"
        Copy-Item $filePath $backupName
        
        $content = Get-Content $filePath -Raw
        
        # Replace simple static URLs
        foreach ($oldUrl in $urlReplacements.Keys) {
            $newEndpoint = $urlReplacements[$oldUrl]
            $content = $content -replace [regex]::Escape($oldUrl), $newEndpoint
        }
        
        # Handle dynamic URLs with parameters
        $content = $content -replace '`http://localhost:8080/api/patients/\$\{nationalId\}`', 'API_ENDPOINTS.PATIENTS.BY_ID(nationalId)'
        $content = $content -replace '`http://localhost:8080/api/patients/\$\{patientNationalId\}`', 'API_ENDPOINTS.PATIENTS.BY_ID(patientNationalId)'
        $content = $content -replace '`http://localhost:8080/api/prescriptions/\$\{prescriptionId\}`', 'API_ENDPOINTS.PRESCRIPTIONS.BY_ID(prescriptionId)'
        
        $content | Set-Content $filePath
        
        Write-Host "  ✅ Completed URL replacements in $(Split-Path $filePath -Leaf)" -ForegroundColor Green
    }
}

# Main processing
Write-Host "📁 Processing $($filesToFix.Count) files..." -ForegroundColor Blue
Write-Host ""

foreach ($file in $filesToFix.Keys) {
    $importPath = $filesToFix[$file]
    
    Write-Host "🔧 Processing: $file" -ForegroundColor Magenta
    
    # Add import statement
    Add-ImportStatement -filePath $file -importPath $importPath
    
    # Replace URLs
    Replace-URLs -filePath $file
    
    Write-Host ""
}

Write-Host "🎉 API Fix completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "  • Updated $($filesToFix.Count) files"
Write-Host "  • Replaced $($urlReplacements.Count) URL patterns"
Write-Host "  • Created backups in api-fix-backup/"
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review the changes: git diff"
Write-Host "  2. Commit changes: git add . && git commit -m 'Fix all localhost URLs'"
Write-Host "  3. Rebuild frontend Docker image"
Write-Host "  4. Deploy to EC2"