# WebSocket Integration for Real-Time Prescription Updates

## Overview
This document describes the WebSocket implementation for real-time prescription synchronization between Ward Management and Pharmacy Management modules.

## How It Works

### Flow:
1. **Ward** creates a prescription → Backend saves to database
2. **Backend** sends WebSocket notification to `/topic/prescriptions`
3. **Pharmacy** (subscribed to topic) receives notification instantly
4. **Pharmacy** UI updates automatically with the new prescription

---

## Backend Implementation

### 1. Dependencies Added ([HMS/pom.xml](HMS/pom.xml#L47))
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### 2. WebSocket Configuration ([HMS/src/main/java/com/HMS/HMS/config/WebSocketConfig.java](HMS/src/main/java/com/HMS/HMS/config/WebSocketConfig.java))
- **Endpoint:** `ws://localhost:8080/ws`
- **Topics:**
  - `/topic/prescriptions` - General prescription updates
  - `/topic/prescriptions/urgent` - Urgent prescriptions only
- **SockJS:** Enabled for fallback support

### 3. Notification Service ([HMS/src/main/java/com/HMS/HMS/websocket/PrescriptionNotificationService.java](HMS/src/main/java/com/HMS/HMS/websocket/PrescriptionNotificationService.java))
**Methods:**
- `notifyPrescriptionCreated()` - Sends notification when prescription is created
- `notifyUrgentPrescription()` - Sends high-priority notification for urgent meds
- `notifyPrescriptionUpdated()` - Notifies status changes
- `notifyPrescriptionCancelled()` - Notifies cancellations

### 4. Service Integration ([HMS/src/main/java/com/HMS/HMS/service/PrescriptionService.java](HMS/src/main/java/com/HMS/HMS/service/PrescriptionService.java#L134))
The `createPrescription()` method now:
1. Saves prescription to database
2. Converts to DTO
3. Checks if urgent
4. Sends WebSocket notification
5. Returns response

---

## Frontend Implementation

### 1. Dependencies Installed
```bash
npm install sockjs-client @stomp/stompjs
```

### 2. Generic WebSocket Hook ([frontend/src/hooks/useWebSocket.js](frontend/src/hooks/useWebSocket.js))
Reusable hook for any WebSocket connection using STOMP over SockJS.

**Features:**
- Auto-reconnect
- Heartbeat monitoring
- Multiple topic subscriptions
- Error handling

### 3. Prescription WebSocket Hook ([frontend/src/Pages/pharmacy/hooks/usePrescriptionWebSocket.js](frontend/src/Pages/pharmacy/hooks/usePrescriptionWebSocket.js))
Specialized hook for prescription updates.

**Features:**
- Browser notifications (with permission)
- Sound alerts for urgent prescriptions
- Notification history (last 50)
- Unread count tracking
- Mark as read functionality

### 4. Integration with Pharmacy ([frontend/src/Pages/pharmacy/hooks/usePrescriptions.js](frontend/src/Pages/pharmacy/hooks/usePrescriptions.js#L122))
The `usePrescriptions` hook now:
- Connects to WebSocket on mount
- Listens for prescription updates
- Adds new prescriptions to state automatically
- Updates existing prescriptions
- Provides connection status

### 5. UI Indicator ([frontend/src/Pages/pharmacy/PharmacyDashboard.jsx](frontend/src/Pages/pharmacy/PharmacyDashboard.jsx#L250))
Displays real-time connection status:
- ✅ Green indicator when connected
- 🔴 Red indicator when disconnected
- Shows unread notification count

---

## Testing the Integration

### Prerequisites:
1. Backend running on `http://localhost:8080`
2. Frontend running on `http://localhost:5173`
3. MySQL database running

### Step-by-Step Test:

#### Step 1: Start Backend
```bash
cd HMS
./mvnw clean install
./mvnw spring-boot:run
```

**Look for logs:**
```
WebSocket Config loaded
Mapping [/ws] to SockJsHttpRequestHandler
```

#### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Step 3: Open Two Browser Windows

**Window 1: Pharmacy Dashboard**
1. Navigate to `http://localhost:5173/pharmacyManagement`
2. Check connection status at top - should show "Real-time updates active" with green dot
3. Open browser console (F12) to see WebSocket logs

**Window 2: Ward Dashboard**
1. Navigate to `http://localhost:5173/wardManagement`
2. Go to "Prescriptions" tab
3. Click "Create Prescription" button

#### Step 4: Create Prescription in Ward
1. Fill in prescription details:
   - Select Patient
   - Select Admission
   - Add medications
   - Set prescribed by (doctor name)
2. Click "Submit"

#### Step 5: Verify in Pharmacy (Window 1)
**You should immediately see:**
- Console log: `📬 Prescription WebSocket notification received`
- Console log: `✅ New prescription added to pharmacy list`
- New prescription appears at the top of the list
- Notification count badge updates (if enabled)
- Browser notification (if permission granted)

---

## Console Logs to Watch

### Backend Console:
```
Creating prescription for patient: P12345
WebSocket notification sent for new prescription: RX-20250104-001
```

### Frontend Console (Pharmacy):
```
✅ Connected to Prescription WebSocket
📡 Subscribed to topic: /topic/prescriptions
📡 Subscribed to topic: /topic/prescriptions/urgent
📬 Prescription WebSocket notification received: {type: "PRESCRIPTION_CREATED", ...}
🔄 Processing WebSocket update: {...}
✅ New prescription added to pharmacy list: RX-20250104-001
```

---

## Troubleshooting

### Issue: WebSocket not connecting
**Solution:**
- Check backend is running on port 8080
- Verify `/ws` endpoint is accessible
- Check CORS configuration in SecurityConfig
- Look for errors in browser console

### Issue: No notification received
**Solution:**
- Verify WebSocket shows "connected" status
- Check backend logs for notification sending
- Ensure prescription was saved successfully
- Check subscription topics match

### Issue: Duplicate prescriptions
**Solution:**
- Clear browser cache
- Check prescription ID uniqueness
- Verify duplicate prevention logic in frontend

### Issue: Connection keeps dropping
**Solution:**
- Check network stability
- Adjust heartbeat interval in `useWebSocket.js`
- Increase `reconnectDelay` value

---

## Notification Message Format

```javascript
{
  "type": "PRESCRIPTION_CREATED",  // or PRESCRIPTION_URGENT, PRESCRIPTION_UPDATED
  "action": "NEW_PRESCRIPTION",
  "prescription": {
    "prescriptionId": "RX-20250104-001",
    "patientName": "John Doe",
    "patientNationalId": "123456789",
    "wardName": "Ward 1 - General",
    "bedNumber": "B-12",
    "totalMedications": 3,
    "prescribedBy": "Dr. Smith",
    "status": "ACTIVE",
    "prescriptionItems": [...],
    ...
  },
  "timestamp": 1704384000000,
  "message": "New prescription created for John Doe",
  "priority": "NORMAL"  // or "HIGH" for urgent
}
```

---

## Future Enhancements

1. **Authentication:** Add JWT token to WebSocket handshake
2. **User-specific topics:** `/topic/prescriptions/user/{userId}`
3. **Acknowledgments:** Track when pharmacy receives/reads notification
4. **Retry mechanism:** Queue notifications if client disconnected
5. **Analytics:** Track notification delivery times
6. **Admin dashboard:** Monitor WebSocket connections
7. **Mobile push:** Integrate with FCM for mobile notifications

---

## Security Considerations

### Current Implementation:
- WebSocket endpoint is **permitAll()** in SecurityConfig
- No authentication on WebSocket connection

### Production Recommendations:
1. Add JWT authentication to WebSocket handshake
2. Validate user roles before subscribing to topics
3. Implement rate limiting
4. Use WSS (WebSocket Secure) in production
5. Add message encryption for sensitive data

---

## Performance Notes

- **Connection overhead:** ~5-10KB per connected client
- **Message size:** ~2-5KB per prescription notification
- **Latency:** Typically < 100ms from creation to delivery
- **Reconnect delay:** 5 seconds (configurable)
- **Heartbeat:** Every 4 seconds
- **Max notifications stored:** 50 (configurable)

---

## API Endpoints

### WebSocket:
- **Connect:** `ws://localhost:8080/ws`
- **Subscribe:**
  - `/topic/prescriptions` - All updates
  - `/topic/prescriptions/urgent` - Urgent only

### REST API (still available):
- `GET /api/prescriptions/all` - Fetch all prescriptions
- `POST /api/prescriptions` - Create prescription (triggers WebSocket)
- `PUT /api/prescriptions/{id}/status` - Update status

---

## Developer Notes

### Adding New Notification Types:
1. Add method to `PrescriptionNotificationService.java`
2. Call from appropriate service method
3. Add handler in `usePrescriptionWebSocket.js`
4. Update UI to display new notification type

### Debugging:
- Set `debug: true` in `useWebSocket` options
- Watch browser Network tab → WS tab
- Check Spring Boot console for STOMP frames
- Use browser extension "WebSocket King" for testing

---

## Support

For issues or questions:
1. Check console logs in both frontend and backend
2. Verify WebSocket connection status
3. Test with REST API first to isolate WebSocket issues
4. Review this documentation

## Success Criteria

✅ Pharmacy connects to WebSocket on page load
✅ Connection status indicator shows "active"
✅ Creating prescription in Ward triggers notification
✅ New prescription appears in Pharmacy within 1 second
✅ Browser notification appears (if permission granted)
✅ Urgent prescriptions highlighted differently
✅ Connection auto-reconnects if dropped
