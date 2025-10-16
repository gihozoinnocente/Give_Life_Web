# Hospital Blood Request & Notification System

## Overview
This feature allows hospitals to post blood requests that are sent as notifications to all registered users (donors).

## Components Created

### 1. **HospitalBloodRequest Page** (`src/pages/HospitalBloodRequest.jsx`)
- **Route**: `/hospital/request-blood`
- **Access**: Hospital users only
- **Features**:
  - Form to create blood requests with:
    - Blood type selection
    - Units needed
    - Urgency level (Critical, Urgent, Normal)
    - Patient condition description
    - Contact information
    - Request expiry date
    - Additional notes
  - Success modal confirmation
  - View active requests section
  - Automatic notification to all users

### 2. **Notification Service** (`src/services/notificationService.js`)
- API service for notification operations:
  - `sendBloodRequest()` - Send notification to all users
  - `getUserNotifications()` - Fetch user notifications
  - `markAsRead()` - Mark notification as read
  - `getUnreadCount()` - Get unread count
  - `deleteNotification()` - Delete notification

### 3. **Notification Redux Slice** (`src/features/notifications/notificationSlice.js`)
- State management for notifications:
  - Store notifications array
  - Track unread count
  - Handle loading states
  - Async actions for API calls

### 4. **Notifications Component** (`src/components/Notifications.jsx`)
- Slide-in panel showing notifications
- Features:
  - Display all notifications
  - Show urgency levels with color coding
  - Mark as read functionality
  - Delete notifications
  - Respond to blood requests
  - Real-time unread count

### 5. **Updated Navbar** (`src/components/Navbar.jsx`)
- Added notification bell icon
- Badge showing unread count
- Opens notification panel on click
- Auto-refresh every 30 seconds

## How It Works

### For Hospitals:
1. Navigate to `/hospital/request-blood`
2. Fill out the blood request form
3. Submit the request
4. All registered users receive instant notification

### For Donors/Users:
1. Click the bell icon in the navbar
2. View all blood requests
3. See urgency levels, hospital info, contact details
4. Respond to requests directly

## Urgency Levels

- **Critical** (Red) - Immediate need
- **Urgent** (Orange) - Within 24 hours
- **Normal** (Blue) - Within 48 hours

## API Endpoints Required

The backend should implement these endpoints:

```
POST   /api/notifications/blood-request
GET    /api/notifications/user/:userId
PATCH  /api/notifications/:id/read
GET    /api/notifications/user/:userId/unread-count
DELETE /api/notifications/:id
```

## Features

✅ Hospital-only access to blood request form
✅ Real-time notification system
✅ Unread count badge
✅ Color-coded urgency levels
✅ Success confirmation modal
✅ Notification panel with slide-in animation
✅ Mark as read functionality
✅ Delete notifications
✅ Auto-refresh notifications every 30 seconds
✅ Responsive design
✅ Form validation

## Next Steps

1. **Backend Integration**: Connect to actual API endpoints
2. **WebSocket/SSE**: Implement real-time push notifications
3. **Email Notifications**: Send email alerts for critical requests
4. **SMS Integration**: Send SMS for urgent requests
5. **Push Notifications**: Browser push notifications
6. **Analytics**: Track response rates and donation success

## Usage

### Hospital Creating Request:
```javascript
// Navigate to the request page
navigate('/hospital/request-blood');

// Fill form and submit
// Notification automatically sent to all users
```

### Users Viewing Notifications:
```javascript
// Click bell icon in navbar
// Notifications panel slides in
// View all blood requests
// Click to mark as read or respond
```

## Styling

- Red/Pink gradient header
- Clean white cards
- Color-coded urgency badges
- Smooth animations
- Mobile responsive
- Accessible design

## Security

- Hospital-only access verification
- User authentication required
- Protected routes
- Input validation
- XSS prevention

---

**Created**: October 14, 2025
**Branch**: feature-hospitals
