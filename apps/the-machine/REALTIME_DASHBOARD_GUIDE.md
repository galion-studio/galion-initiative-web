# THE MACHINE v2.0 - Real-Time Monitoring Guide

**Status**: ✅ Complete  
**Version**: 2.0.0  
**Technology**: Server-Sent Events (SSE) for live updates

---

## 🎯 Overview

The Real-Time Monitoring Dashboard provides operators with live visibility into threat assessments, pattern matches, and system activity. It uses Server-Sent Events (SSE) for efficient one-way streaming from server to client.

---

## 🚀 Features

### ✅ Live Event Feed
- **Real-time updates**: Events appear instantly as they occur
- **Event types**: Assessments, pattern matches, alerts, operator presence
- **Alert levels**: Info (blue), Warning (yellow), Critical (red)
- **Event history**: Last 100 events stored in memory

### ✅ Operator Presence Tracking
- **Active operators**: See who's currently online
- **Online duration**: Time each operator has been connected
- **Role display**: Admin, Operator, or Viewer
- **Automatic cleanup**: Removes inactive operators after 5 minutes

### ✅ System Status Display
- **Real-time connection**: Green when connected, red when disconnected
- **Pattern matching**: Status of pattern recognition system
- **Audit logging**: Confirmation that all actions are logged
- **Privacy protection**: Confirmation that privacy features are active

### ✅ Event Categories

**1. Assessment Events**
- `assessment-created`: New threat assessment created
- `assessment-updated`: Existing assessment modified
- Shows: Harm type, risk score, status

**2. Pattern Match Events**
- `pattern-match`: Threat matched known pattern
- Shows: Pattern name, confidence %, matched indicators
- Alert level based on confidence

**3. Critical Alert Events**
- `critical-alert`: High-risk threat detected (score ≥ 80)
- Shows: Risk score, harm description
- Always critical level

**4. Constraint Violation Events**
- `constraint-violation`: Attempted action violated hard constraint
- Shows: Which constraint, severity
- Always critical level

**5. Operator Presence Events**
- `operator-joined`: Operator connected to system
- `operator-left`: Operator disconnected
- Shows: Operator name, role

**6. System Events**
- `system-event`: General system notifications
- Shows: Event details, impact

---

## 📡 API Endpoints

### 1. GET /api/realtime/events (SSE Stream)

**Purpose**: Establishes real-time event stream

**Authentication**: Required (JWT token)

**Response**: Server-Sent Events stream

**Usage**:
```javascript
const token = localStorage.getItem('session_token');
const eventSource = new EventSource(`/api/realtime/events?token=${token}`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event received:', data);
};
```

### 2. GET /api/realtime/status

**Purpose**: Get current real-time system status

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "realtime": {
    "connected": true,
    "active_operators": 3,
    "operators": [
      {
        "id": "admin-001",
        "name": "Admin User",
        "role": "admin",
        "online_for": 3600
      }
    ]
  },
  "events": {
    "recent_count": 15,
    "critical_count": 2,
    "recent": [...],
    "critical": [...]
  }
}
```

### 3. POST /api/realtime/broadcast (Admin Only)

**Purpose**: Broadcast custom event to all operators

**Authentication**: Required (Admin role)

**Body**:
```json
{
  "type": "system-event",
  "level": "warning",
  "title": "System Maintenance",
  "message": "Scheduled maintenance in 1 hour",
  "data": {}
}
```

---

## 🎨 Dashboard Layout

### Header Section
- Title: "Real-Time Monitoring"
- Description
- Connection status indicator

### Main Content (2 Columns)

**Left Column (2/3 width):**
- Event statistics (3 cards: Total, Critical, Pattern Matches)
- Live event feed (scrollable, max height 600px)
- Events show: Icon, title, message, timestamp, metadata

**Right Column (1/3 width):**
- Active operators list (with online duration)
- System status (4 indicators)
- Quick actions (New Assessment, Audit Logs, Console)

---

## 🔔 Alert Levels

### Critical (Red) 🚨
- Risk score ≥ 80
- Pattern match confidence ≥ 70%
- Constraint violations
- System emergencies

**Operator Action**: Immediate review required

### Warning (Yellow) ⚠️
- Risk score 60-79
- Pattern match confidence 50-69%
- System warnings

**Operator Action**: Review when possible

### Info (Blue) ℹ️
- Risk score < 60
- Pattern match confidence 20-49%
- Standard events

**Operator Action**: For awareness

---

## ⚡ Performance

### Real-Time Updates
- Event delivery: < 100ms latency
- Heartbeat interval: 30 seconds
- Automatic reconnection on disconnect
- Memory usage: ~100 events stored

### Operator Presence
- Presence check: Every 30 seconds
- Stale threshold: 5 minutes
- Automatic cleanup: Yes

---

## 🧪 Testing

### Test 1: Connect to Live Feed

```bash
# Start server
npm run dev

# Visit http://localhost:4200/monitor
# Should see "Connected" status (green)
```

### Test 2: Create Assessment (Triggers Event)

```bash
# In another terminal, create assessment
curl -X POST http://localhost:4200/api/ai/assess-structured \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Test threat for monitoring",
    "operatorId": "test-op-001"
  }'

# Monitor dashboard should show new event instantly
```

### Test 3: Pattern Match Alert

```bash
# Create assessment with pattern keywords
curl -X POST http://localhost:4200/api/ai/assess-structured \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Person saying they want to end it all and gave away possessions",
    "operatorId": "test-op-001"
  }'

# Monitor should show pattern match event with confidence %
```

### Test 4: Multiple Operators

```bash
# Open monitor page in multiple browser tabs
# Each tab should appear in "Active Operators" list
```

---

## 🔧 Technical Details

### Server-Sent Events (SSE)

**Why SSE over WebSockets?**
- Simpler implementation (one-way server→client)
- Automatic reconnection
- Works over HTTP/HTTPS
- No need for bidirectional communication
- Compatible with Cloudflare Workers

**SSE Format:**
```
data: {"type":"assessment-created","title":"New Assessment",...}

data: {"type":"heartbeat","timestamp":1701878400000}

data: {"type":"pattern-match","level":"critical",...}
```

### Event Flow

```
Backend Action (e.g., assessment created)
    ↓
Create event object (createAssessmentEvent)
    ↓
Store in memory (storeEvent)
    ↓
Broadcast to all connected clients (SSE)
    ↓
Client receives event
    ↓
UI updates instantly
```

### Operator Presence

```
Operator connects to /api/realtime/events
    ↓
registerOperatorPresence() called
    ↓
"operator-joined" event broadcasted
    ↓
Heartbeat every 30 seconds updates last_seen
    ↓
If no heartbeat for 5 minutes, removed
    ↓
"operator-left" event broadcasted
```

---

## 🛡️ Finch Protocol Compliance

### No Autonomous Action
- Events are **notifications only**
- Operators must review and decide on actions
- Dashboard doesn't auto-execute any interventions

### Complete Audit Trail
- All events are logged
- Operator presence tracked
- Broadcasts logged
- Connection/disconnection logged

### Privacy-by-Design
- Events don't contain personal identifying information
- Generic descriptions used
- Assessment IDs used instead of names
- No location data in events

### Transparent Reasoning
- Every event has clear title and message
- Metadata shows why event was triggered
- Alert levels clearly indicated
- Pattern matches show reasoning

---

## 📱 Mobile Responsiveness

The dashboard is responsive and works on:
- Desktop (optimal layout: 2 columns)
- Tablet (stacked layout)
- Mobile (single column)

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Audio alerts**: Sound for critical events
- [ ] **Desktop notifications**: Browser notification API
- [ ] **Event filtering**: Filter by type, level, operator
- [ ] **Event search**: Search historical events
- [ ] **Export events**: Download event log
- [ ] **Custom alerts**: Operator-defined alert rules
- [ ] **Dashboard widgets**: Customizable dashboard layout
- [ ] **Trend charts**: Visual charts of event patterns over time

---

## 🆘 Troubleshooting

### "Disconnected" status

**Cause**: SSE connection failed or timed out

**Solution**: 
- Check network connection
- Verify authentication token is valid
- Refresh page to reconnect

### No events showing

**Cause**: No system activity yet

**Solution**: Create a test assessment to trigger events

### "Active Operators" shows 0

**Cause**: No other operators connected

**Solution**: This is normal if you're the only one online

---

## ✅ Production Checklist

- [ ] Test SSE connection stability
- [ ] Verify automatic reconnection works
- [ ] Test with multiple simultaneous operators
- [ ] Confirm critical alerts are prominent
- [ ] Test on mobile devices
- [ ] Verify operator presence accuracy
- [ ] Test event filtering if implemented
- [ ] Confirm audit logging of all events

---

**The Machine v2.0 - Real-Time Monitoring Complete** 🎯

*Live visibility. Instant alerts. Operator awareness.*
