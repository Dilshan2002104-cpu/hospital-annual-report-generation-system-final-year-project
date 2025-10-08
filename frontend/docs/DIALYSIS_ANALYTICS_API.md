# Dialysis Analytics API Endpoints Documentation

This document outlines the required backend API endpoints for the Dialysis Analytics Dashboard.

## Base URL
```
http://localhost:8080/api/dialysis/analytics
```

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 📊 **Core Analytics Endpoints**

### 1. Machine Utilization Analytics
**GET** `/api/dialysis/analytics/machine-utilization`

**Description:** Provides real-time machine status and utilization metrics.

**Response:**
```json
{
  "totalMachines": 8,
  "activeCount": 3,
  "inUseCount": 3,
  "maintenanceCount": 1,
  "outOfOrderCount": 1,
  "utilizationRate": 87.5,
  "peakHours": ["10:00", "14:00", "18:00"],
  "lowUtilizationHours": ["22:00", "06:00"],
  "machines": [
    {
      "machineId": "DM-001",
      "status": "ACTIVE",
      "location": "Room A1",
      "lastMaintenance": "2024-12-01",
      "totalSessions": 145,
      "hoursUsed": 1200,
      "efficiency": 98
    }
  ],
  "performanceMetrics": {
    "averageUptime": 96.2,
    "averageEfficiency": 94.8,
    "maintenanceFrequency": "monthly"
  }
}
```

### 2. Session Analytics by Time Range
**GET** `/api/dialysis/analytics/sessions?timeRange={timeRange}`

**Parameters:**
- `timeRange`: "7days", "30days", or "90days"

**Description:** Provides session statistics over the specified time period.

**Response:**
```json
{
  "timeRange": "7days",
  "summary": {
    "totalScheduled": 156,
    "totalCompleted": 142,
    "totalCancelled": 8,
    "totalInProgress": 6,
    "efficiencyRate": 91.0
  },
  "dailyTrends": [
    {
      "date": "2024-12-01",
      "scheduledSessions": 18,
      "completedSessions": 16,
      "cancelledSessions": 1,
      "averageDuration": 245,
      "efficiencyRate": 88.9
    }
  ],
  "timeSlotAnalysis": [
    {
      "timeSlot": "06:00",
      "scheduled": 12,
      "completed": 11,
      "inProgress": 1,
      "cancelled": 0
    }
  ]
}
```

### 3. Treatment Outcomes Analytics
**GET** `/api/dialysis/analytics/treatment-outcomes`

**Description:** Provides treatment success rates, patient outcomes, and quality metrics.

**Response:**
```json
{
  "totalTreatments": 2847,
  "successfulTreatments": 2785,
  "incompletetreatments": 45,
  "emergencyInterventions": 17,
  "averageFluidRemoval": 2.3,
  "averageTreatmentTime": 242,
  "patientSatisfactionScore": 4.6,
  "complicationRate": 1.2,
  "outcomesByTimeSlot": {
    "06:00": {
      "completed": 145,
      "scheduled": 152,
      "efficiency": 95.4
    }
  },
  "qualityMetrics": {
    "ktVRatio": 1.4,
    "fluidRemovalRate": 8.5,
    "bloodPressureControl": 92.1
  }
}
```

### 4. Patient Demographics Analytics
**GET** `/api/dialysis/analytics/patient-demographics`

**Description:** Provides patient population statistics and demographic breakdowns.

**Response:**
```json
{
  "totalPatients": 156,
  "ageGroups": {
    "18-30": 12,
    "31-45": 28,
    "46-60": 45,
    "61-75": 52,
    "75+": 19
  },
  "genderDistribution": {
    "male": 89,
    "female": 67
  },
  "treatmentTypes": {
    "regular": 134,
    "emergency": 15,
    "temporary": 7
  },
  "chronicConditions": {
    "diabetes": 89,
    "hypertension": 72,
    "kidney_disease": 156,
    "heart_disease": 34
  },
  "averageSessionsPerWeek": 2.8,
  "newPatientsThisMonth": 8,
  "dischargedPatientsThisMonth": 5
}
```

---

## 🔧 **Machine Management Endpoints**

### 5. Get All Machines
**GET** `/api/dialysis/machines`

**Description:** Returns list of all dialysis machines with current status.

**Response:**
```json
[
  {
    "machineId": "DM-001",
    "status": "ACTIVE",
    "location": "Room A1",
    "lastMaintenance": "2024-12-01",
    "nextMaintenance": "2025-01-01",
    "totalHours": 1200,
    "manufacturer": "Fresenius",
    "model": "5008S"
  }
]
```

### 6. Update Machine Status
**PATCH** `/api/dialysis/machines/{machineId}/status`

**Request Body:**
```json
{
  "status": "MAINTENANCE",
  "reason": "Routine maintenance",
  "timestamp": "2024-12-08T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "machineId": "DM-001",
  "oldStatus": "ACTIVE",
  "newStatus": "MAINTENANCE",
  "timestamp": "2024-12-08T10:00:00Z"
}
```

---

## 📈 **Live Monitoring Endpoints**

### 7. Live Dashboard Data
**GET** `/api/dialysis/analytics/live-dashboard`

**Description:** Provides real-time operational data for live monitoring.

**Response:**
```json
{
  "currentTime": "2024-12-08T14:30:00Z",
  "activeSessions": 6,
  "waitingPatients": 3,
  "availableMachines": 2,
  "todayStats": {
    "scheduled": 24,
    "completed": 18,
    "inProgress": 6,
    "cancelled": 0
  },
  "alerts": [
    {
      "type": "warning",
      "message": "Machine DM-005 requires maintenance",
      "machineId": "DM-005",
      "priority": "medium"
    }
  ],
  "nextScheduled": [
    {
      "sessionId": "DS-2024-001234",
      "patientName": "John Doe",
      "machineId": "DM-003",
      "scheduledTime": "2024-12-08T15:00:00Z"
    }
  ]
}
```

### 8. Real-time Machine Status Updates
**WebSocket** `/ws/dialysis/machine-status`

**Message Format:**
```json
{
  "type": "MACHINE_STATUS_UPDATE",
  "machineId": "DM-001",
  "oldStatus": "ACTIVE",
  "newStatus": "IN_USE",
  "timestamp": "2024-12-08T14:30:00Z",
  "sessionId": "DS-2024-001234"
}
```

---

## 🎯 **Implementation Priorities**

### Phase 1: Core Endpoints (High Priority)
1. **GET** `/api/dialysis/machines` - Machine list and status
2. **GET** `/api/dialysis/analytics/sessions?timeRange=7days` - Basic session analytics
3. **GET** `/api/dialysis/analytics/live-dashboard` - Live operational data

### Phase 2: Advanced Analytics (Medium Priority)
4. **GET** `/api/dialysis/analytics/machine-utilization` - Machine performance
5. **GET** `/api/dialysis/analytics/treatment-outcomes` - Treatment quality metrics
6. **PATCH** `/api/dialysis/machines/{machineId}/status` - Machine status updates

### Phase 3: Demographics & Reporting (Low Priority)
7. **GET** `/api/dialysis/analytics/patient-demographics` - Patient statistics
8. **WebSocket** `/ws/dialysis/machine-status` - Real-time updates

---

## 🛠 **Database Schema Suggestions**

### Machine Status Table
```sql
CREATE TABLE dialysis_machine_status (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    machine_id VARCHAR(50) NOT NULL,
    status ENUM('ACTIVE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_ORDER') NOT NULL,
    location VARCHAR(100),
    last_maintenance DATE,
    next_maintenance DATE,
    total_hours INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Session Analytics View
```sql
CREATE VIEW dialysis_session_analytics AS
SELECT 
    DATE(session_date) as session_day,
    COUNT(*) as total_sessions,
    SUM(CASE WHEN session_status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_sessions,
    SUM(CASE WHEN session_status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_sessions,
    AVG(CASE WHEN session_status = 'COMPLETED' THEN duration ELSE NULL END) as avg_duration
FROM dialysis_sessions 
GROUP BY DATE(session_date);
```

---

## 🚀 **Frontend Integration**

The frontend analytics dashboard automatically:
- ✅ **Tries real API endpoints first**
- ✅ **Falls back to computed data from existing sessions**
- ✅ **Shows data source indicators** (API vs Computed)
- ✅ **Handles offline mode gracefully**
- ✅ **Provides real-time updates via WebSocket**

### Sample Frontend Usage:
```javascript
// The dashboard will automatically use real APIs when available
<DialysisAnalytics
  sessions={sessions}
  wsConnected={wsConnected}
  wsNotifications={wsNotifications}
  loading={loading}
  onRefresh={fetchDialysisPatients}
/>
```

---

## 📝 **Notes for Backend Developers**

1. **JWT Authentication**: All endpoints require valid JWT token
2. **Error Handling**: Return consistent error format with HTTP status codes
3. **Caching**: Consider Redis caching for frequently accessed analytics data
4. **Rate Limiting**: Implement rate limiting for analytics endpoints
5. **Logging**: Log all analytics requests for audit purposes
6. **Performance**: Optimize queries using database indexes and views
7. **Real-time**: WebSocket integration for live machine status updates

### Sample Error Response:
```json
{
  "error": "INSUFFICIENT_PERMISSIONS",
  "message": "User does not have access to dialysis analytics",
  "statusCode": 403,
  "timestamp": "2024-12-08T14:30:00Z"
}
```

This API specification provides a comprehensive foundation for implementing real-time dialysis analytics with fallback support for development environments.