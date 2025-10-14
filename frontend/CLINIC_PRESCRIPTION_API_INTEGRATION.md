# Clinic Prescription API Integration

## Overview
This document outlines the complete integration of Clinic Management prescription functionality with the backend APIs, following the Ward Management prescription pattern for consistency and reliability.

## API Endpoints

### 1. Create Clinic Prescription
- **Endpoint**: `POST /api/prescriptions/clinic`
- **Purpose**: Creates a new outpatient prescription (no admission required)
- **Authentication**: Bearer JWT token required

#### Request Payload (ClinicPrescriptionRequestDTO)
```json
{
  "patientNationalId": "string (required)",
  "patientName": "string (optional - fetched from Patient entity)",
  "startDate": "LocalDate (YYYY-MM-DD format)",
  "endDate": "LocalDate (optional)",
  "prescribedBy": "string (required - doctor name)",
  "prescriptionNotes": "string (optional)",
  "consultationType": "string (default: 'outpatient')",
  "isUrgent": "boolean (default: false)",
  "prescriptionItems": [
    {
      "medicationId": "integer (required)",
      "dose": "string (e.g., '500mg')",
      "frequency": "string (e.g., 'Twice daily (BD)')",
      "quantity": "integer (required)",
      "quantityUnit": "string (default: 'tablets')",
      "instructions": "string",
      "route": "string (default: 'oral')",
      "isUrgent": "boolean (default: false)",
      "notes": "string (optional)"
    }
  ]
}
```

#### Response (PrescriptionResponseDTO)
```json
{
  "success": true,
  "message": "Clinic prescription with X medications created successfully",
  "data": {
    "prescriptionId": "string",
    "patientName": "string",
    "patientNationalId": "string",
    "startDate": "LocalDate",
    "endDate": "LocalDate",
    "prescribedBy": "string",
    "prescribedDate": "LocalDateTime",
    "status": "PENDING",
    "wardName": "Outpatient Clinic",
    "consultationType": "outpatient",
    "totalMedications": "integer",
    "prescriptionNotes": "string",
    "isUrgent": "boolean",
    "prescriptionItems": [
      {
        "id": "integer",
        "drugName": "string",
        "dose": "string",
        "frequency": "string",
        "quantity": "integer",
        "quantityUnit": "string",
        "instructions": "string",
        "route": "string",
        "isUrgent": "boolean",
        "itemStatus": "ACTIVE"
      }
    ]
  }
}
```

### 2. Get Clinic Prescriptions
- **Endpoint**: `GET /api/prescriptions/clinic`
- **Purpose**: Retrieves paginated clinic prescriptions
- **Authentication**: Bearer JWT token required

#### Query Parameters
- `page`: Page number (default: 0)
- `size`: Page size (default: 10)
- `sortBy`: Sort field (default: 'prescribedDate')
- `sortDir`: Sort direction - 'asc' or 'desc' (default: 'desc')

#### Response
```json
{
  "success": true,
  "message": "Clinic prescriptions retrieved successfully",
  "data": {
    "content": [/* Array of PrescriptionResponseDTO */],
    "pageable": {
      "sort": {
        "sorted": true,
        "unsorted": false
      },
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": "integer",
    "totalPages": "integer"
  }
}
```

### 3. Get All Medications
- **Endpoint**: `GET /api/pharmacy/medications/getAll`
- **Purpose**: Retrieves all available medications for prescription
- **Authentication**: Bearer JWT token required

### 4. Get All Patients
- **Endpoint**: `GET /api/patients/all`
- **Purpose**: Retrieves all patients for clinic prescriptions
- **Authentication**: Bearer JWT token required

## Frontend Implementation

### 1. API Hook (useClinicPrescriptionsApi.js)

#### Key Features
- **Real API Integration**: Connects to actual backend endpoints
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Data Transformation**: Transforms API responses to frontend format
- **State Management**: Manages prescriptions, patients, and medications
- **Loading States**: Proper loading and error states
- **Authentication**: JWT token handling

#### Main Functions
```javascript
// Fetch clinic prescriptions with pagination
const fetchPrescriptions = useCallback(async (includeDataRefresh = false) => {
  // Implementation handles paginated response
});

// Create new clinic prescription
const addPrescription = useCallback(async (prescriptionData) => {
  // Validates data and transforms to API format
});

// Fetch all patients for clinic use
const fetchPatients = useCallback(async () => {
  // Transforms patient data for prescription use
});

// Fetch available medications
const fetchMedications = useCallback(async () => {
  // Gets medications from pharmacy API
});

// Get prescription statistics
const getStats = useCallback(() => {
  // Calculates real-time statistics
});
```

### 2. Component Integration

#### ClinicPrescriptionsManagement.jsx
- **Real Data**: Uses actual API data instead of mock data
- **Live Statistics**: Real-time prescription statistics
- **Error Handling**: Displays API errors to users
- **Loading States**: Shows loading indicators during API calls
- **Refresh Capability**: Manual refresh of prescription data

#### ClinicPrescriptionModal.jsx
- **API Validation**: Validates data according to API requirements
- **Medication Search**: Real medication database search
- **Patient Selection**: Real patient data from API
- **Error Feedback**: Shows specific validation errors from API
- **Success Handling**: Proper handling of successful prescription creation

## Data Flow

### 1. Prescription Creation Flow
```
User fills prescription form
↓
Frontend validation (required fields, formats)
↓
Transform to API format (ClinicPrescriptionRequestDTO)
↓
POST /api/prescriptions/clinic
↓
Backend validation & database save
↓
Transform API response to frontend format
↓
Update local state & close modal
↓
Show success notification
```

### 2. Data Loading Flow
```
Component mount
↓
Initialize useClinicPrescriptionsApi hook
↓
Parallel fetch: patients, medications, prescriptions
↓
Transform API responses
↓
Update component state
↓
Render with real data
```

## Error Handling

### 1. API Error Types
- **400 Bad Request**: Invalid prescription data
- **401 Unauthorized**: Session expired, redirect to login
- **403 Forbidden**: Insufficient permissions
- **409 Conflict**: Duplicate prescription
- **500 Internal Server Error**: Server error

### 2. Frontend Error Handling
```javascript
try {
  const response = await axios.post('/api/prescriptions/clinic', data);
  // Handle success
} catch (err) {
  let errorMessage = 'Failed to create prescription. ';
  
  if (err.response?.status === 400) {
    errorMessage = err.response.data?.message || 'Invalid prescription data.';
  } else if (err.response?.status === 401) {
    errorMessage = 'Your session has expired. Please log in again.';
  } else if (err.response?.status === 403) {
    errorMessage = 'You do not have permission to create prescriptions.';
  } else if (err.response?.status === 409) {
    errorMessage = 'A similar prescription already exists for this patient.';
  }
  
  setError(errorMessage);
  throw new Error(errorMessage);
}
```

## Validation Rules

### 1. Frontend Validation
- **Patient Selection**: Must select a valid patient
- **Prescribing Doctor**: Required field, non-empty
- **Medications**: At least one medication required
- **Dosage Format**: Must match medical patterns (mg, g, ml, tabs, etc.)
- **Frequency**: Must be from predefined medical frequencies
- **Quantity**: Must be positive integer between 1-1000

### 2. Backend Validation
- **Patient Exists**: Patient must exist in database
- **Medication IDs**: All medication IDs must be valid
- **Required Fields**: All required fields must be present
- **Business Rules**: Enforces medical prescription rules

## Performance Optimizations

### 1. Data Fetching
- **Parallel Requests**: Fetch patients, medications, and prescriptions in parallel
- **Caching**: Store fetched data to avoid repeated API calls
- **Pagination**: Handle large datasets with pagination
- **Error Boundaries**: Prevent component crashes on API errors

### 2. State Management
- **Memoization**: Use useMemo for expensive calculations
- **Stable References**: useCallback for function stability
- **Optimistic Updates**: Update UI immediately, sync with server

## Security Considerations

### 1. Authentication
- **JWT Tokens**: All requests include Bearer token
- **Token Expiration**: Handle expired tokens gracefully
- **Automatic Logout**: Redirect to login on authentication failure

### 2. Data Protection
- **Input Sanitization**: Validate all user inputs
- **Error Messages**: Don't expose sensitive server information
- **Audit Trail**: Track prescription creation for compliance

## Testing Considerations

### 1. API Integration Tests
- **Success Cases**: Test successful prescription creation
- **Error Cases**: Test all error response scenarios
- **Validation**: Test frontend and backend validation
- **Edge Cases**: Test with boundary values

### 2. Component Tests
- **Modal Functionality**: Test prescription modal workflow
- **Data Display**: Test prescription list rendering
- **Error States**: Test error message display
- **Loading States**: Test loading indicators

## Migration Benefits

### 1. Real Data Integration
- **Live Medications**: Real pharmacy inventory
- **Actual Patients**: Real patient database
- **Persistent Prescriptions**: Data saved to database
- **Audit Trail**: Complete prescription history

### 2. Consistency with Ward Management
- **Same API Patterns**: Consistent error handling and data flow
- **Shared Components**: Reusable validation and formatting
- **Unified Experience**: Same user experience across modules

### 3. Production Readiness
- **Robust Error Handling**: Graceful failure handling
- **Performance Optimization**: Efficient data loading
- **Security**: Proper authentication and validation
- **Scalability**: Handles large datasets with pagination

## Future Enhancements

### 1. Advanced Features
- **Drug Interaction Checking**: Validate medication combinations
- **Allergy Checking**: Check patient allergies against prescriptions
- **Dosage Calculators**: Age and weight-based dosage calculations
- **Prescription Templates**: Saved templates for common conditions

### 2. Integration Improvements
- **Real-time Notifications**: WebSocket integration for live updates
- **Print Integration**: Generate printable prescriptions
- **Electronic Signatures**: Digital signature validation
- **Insurance Integration**: Check coverage and approvals

## Conclusion

The Clinic Management prescription system now provides:
- ✅ **Complete API Integration** with backend services
- ✅ **Real-time Data** from actual pharmacy and patient systems
- ✅ **Professional Error Handling** with user-friendly messages
- ✅ **Consistent User Experience** matching Ward Management
- ✅ **Production-ready Performance** with proper optimization
- ✅ **Medical Standards Compliance** with proper validation

The system is now ready for production use with full backend integration, providing a seamless and professional prescription management experience for clinic operations.