# Hi Teacher LMS - API Specification

**Version:** 1.0.0  
**Last Updated:** December 8, 2024  
**Base URL:** `/api/v1`

This document provides complete API specifications with request/response schemas, authentication requirements, and database models for implementing the Hi Teacher LMS backend.

---

## 📋 Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Batch Management](#batch-management)
4. [Student Management](#student-management)
5. [Assignment & Submissions](#assignment--submissions)
6. [Class & Attendance](#class--attendance)
7. [Content Management](#content-management)
8. [Subject Hierarchy](#subject-hierarchy)
9. [Analytics & Reporting](#analytics--reporting)
10. [Common Types](#common-types)
11. [Error Responses](#error-responses)
12. [Database Schema](#database-schema)

---

## 🔐 Authentication & Authorization

### Authentication Flow

**Tokens:** JWT-based authentication  
**Header:** `Authorization: Bearer <token>`  
**Token Expiry:** 24 hours  
**Refresh Token Expiry:** 30 days

### Endpoints

#### POST `/auth/register/teacher`
Register a new teacher account.

**Request Body:**
```json
{
  "name": "string (required, 2-100 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "phoneNumber": "string (optional)",
  "subjects": "string[] (required, min 1 subject)",
  "experience": "number (optional, years)",
  "qualification": "string (optional)",
  "bio": "string (optional, max 500 chars)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Teacher registration successful. Awaiting admin approval.",
  "data": {
    "user": {
      "id": "string (UUID)",
      "email": "string",
      "name": "string",
      "role": "teacher",
      "verificationStatus": "pending",
      "status": "pending",
      "createdAt": "ISO8601 date"
    }
  }
}
```

#### POST `/auth/register/student`
Register a new student account.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "phoneNumber": "string (optional)",
  "parentName": "string (optional)",
  "parentContact": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "user": { /* Student object */ },
    "accessToken": "string (JWT)",
    "refreshToken": "string (JWT)"
  }
}
```

#### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "admin | teacher | student",
      "avatar": "string (optional)",
      "status": "active | inactive | pending"
      // + role-specific fields
    },
    "accessToken": "string (JWT)",
    "refreshToken": "string (JWT)"
  }
}
```

#### POST `/auth/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

#### POST `/auth/logout`
Logout and invalidate tokens.

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST `/auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

#### POST `/auth/reset-password`
Reset password with token.

**Request Body:**
```json
{
  "token": "string (required, from email)",
  "newPassword": "string (required, min 8 chars)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

#### POST `/auth/verify-email`
Verify email address.

**Request Body:**
```json
{
  "token": "string (required, from email)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## 👥 User Management

**Auth Required:** All endpoints  
**Roles:** Admin (all operations), Teacher/Student (own profile only)

#### GET `/users/me`
Get current user profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "avatar": "string (optional)",
    "phoneNumber": "string (optional)",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "status": "active | inactive | pending"
    // + role-specific fields
  }
}
```

#### PUT `/users/me`
Update current user profile.

**Request Body:**
```json
{
  "name": "string (optional)",
  "phoneNumber": "string (optional)",
  "avatar": "string (optional, URL or base64)",
  "bio": "string (optional, for teachers)",
  "parentName": "string (optional, for students)",
  "parentContact": "string (optional, for students)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* Updated user object */ }
}
```

#### PUT `/users/me/password`
Change password.

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 8 chars)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### GET `/users/teachers` 
List all teachers (Admin only).

**Query Params:**
- `status`: `pending | approved | rejected | all` (default: `all`)
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `search`: string (search in name, email)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "teachers": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "subjects": ["string"],
        "verificationStatus": "string",
        "createdAt": "ISO8601"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### PUT `/users/teachers/:teacherId/verify` 
Approve/reject teacher (Admin only).

**Request Body:**
```json
{
  "status": "approved | rejected (required)",
  "message": "string (optional, rejection reason)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Teacher verification updated"
}
```

#### GET `/users/students`
List all students (Admin/Teacher).

**Query Params:**
- `batchId`: string (filter by batch)
- `status`: `active | inactive | all` (default: `all`)
- `page`: number
- `limit`: number
- `search`: string

**Response (200):**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "enrollmentDate": "ISO8601",
        "batchIds": ["string"],
        "status": "string"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

## 📚 Batch Management

**Auth Required:** Yes  
**Roles:** Admin (all), Teacher (own batches), Student (enrolled batches, read-only)

#### GET `/batches`
List batches.

**Query Params:**
- `teacherId`: string (filter by teacher)
- `status`: `active | inactive | completed | all`
- `page`: number
- `limit`: number
- `search`: string

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batches": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "subject": "string",
        "teacherIds": ["string"],
        "studentIds": ["string"],
        "startDate": "ISO8601",
        "endDate": "ISO8601 (optional)",
        "schedule": "string",
        "maxStudents": 30,
        "status": "active | inactive | completed",
        "createdAt": "ISO8601",
        "updatedAt": "ISO8601",
        "studentCount": 25
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### POST `/batches`
Create a new batch (Teacher/Admin).

**Request Body:**
```json
{
  "name": "string (required, 3-100 chars)",
  "description": "string (optional)",
  "subject": "string (required)",
  "startDate": "ISO8601 (required)",
  "endDate": "ISO8601 (optional)",
  "schedule": "string (optional, e.g., 'Mon, Wed, Fri 10:00 AM')",
  "maxStudents": "number (optional, min 1, max 500)",
  "teacherIds": "string[] (optional, default: current teacher)",
  "status": "active | inactive (default: active)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Batch created successfully",
  "data": {
    "batch": { /* Created batch object */ }
  }
}
```

#### GET `/batches/:batchId`
Get batch details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batch": {
      /* Full batch object */
    },
    "students": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "enrollmentDate": "ISO8601"
      }
    ],
    "teachers": [
      {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    ],
    "stats": {
      "totalClasses": 20,
      "completedClasses": 15,
      "averageAttendance": 87.5,
      "totalAssignments": 10,
      "averageScore": 82.3
    }
  }
}
```

#### PUT `/batches/:batchId`
Update batch (Teacher/Admin).

**Request Body:** Same as create, all fields optional
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "active | inactive | completed (optional)",
  /* ... other fields ... */
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Batch updated successfully",
  "data": { /* Updated batch */ }
}
```

#### DELETE `/batches/:batchId`
Delete batch (Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "Batch deleted successfully"
}
```

#### POST `/batches/:batchId/students`
Add students to batch (Teacher/Admin).

**Request Body:**
```json
{
  "studentIds": ["string (required, array of student IDs)"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Students added to batch",
  "data": {
    "added": 3,
    "failed": 0
  }
}
```

#### DELETE `/batches/:batchId/students/:studentId`
Remove student from batch (Teacher/Admin).

**Response (200):**
```json
{
  "success": true,
  "message": "Student removed from batch"
}
```

#### GET `/batches/:batchId/settings`
Get batch settings.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "allowLateJoin": true,
    "accessStartDate": "ISO8601 (optional)",
    "accessEndDate": "ISO8601 (optional)",
    "isVisible": true,
    "autoApproveStudents": false
  }
}
```

#### PUT `/batches/:batchId/settings`
Update batch settings (Teacher/Admin).

**Request Body:**
```json
{
  "allowLateJoin": "boolean (optional)",
  "accessStartDate": "ISO8601 (optional)",
  "accessEndDate": "ISO8601 (optional)",
  "isVisible": "boolean (optional)",
  "autoApproveStudents": "boolean (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Settings updated"
}
```

#### POST `/batches/:batchId/request-access`
Student requests batch access.

**Response (201):**
```json
{
  "success": true,
  "message": "Access request submitted",
  "data": {
    "requestId": "string",
    "status": "pending"
  }
}
```

#### GET `/batches/:batchId/access-requests`
Get batch access requests (Teacher/Admin).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "string",
        "studentId": "string",
        "studentName": "string",
        "studentEmail": "string",
        "status": "pending | approved | rejected",
        "requestDate": "ISO8601",
        "message": "string (optional)"
      }
    ]
  }
}
```

#### PUT `/batches/:batchId/access-requests/:requestId`
Approve/reject access request (Teacher/Admin).

**Request Body:**
```json
{
  "status": "approved | rejected (required)",
  "message": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Request updated"
}
```

---

## 📝 Assignment & Submissions

**Auth Required:** Yes

#### GET `/assignments`
List assignments.

**Query Params:**
- `batchId`: string (filter by batch)
- `status`: `active | closed | draft | all`
- `type`: `text | file | link | quiz | all`
- `dueDate`: `upcoming | overdue | all`
- `page`: number
- `limit`: number
- `search`: string

**Role-specific:**
- Teacher: See all assignments they created
- Student: See assignments for their batches

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "type": "text | file | link | quiz",
        "status": "active | closed | draft",
        "dueDate": "ISO8601",
        "assignedDate": "ISO8601",
        "maxPoints": 100,
        "batchIds": ["string"],
        "teacherId": "string",
        "submissionCount": 25,
        "gradedCount": 20,
        "isOverdue": false  // For students
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### POST `/assignments`
Create assignment (Teacher/Admin).

**Request Body:**
```json
{
  "title": "string (required, 3-200 chars)",
  "description": "string (required)",
  "instructions": "string (required, rich text HTML)",
  "type": "text | file | link | quiz (required)",
  "status": "active | draft (default: draft)",
  "gradingType": "points | passfail (default: points)",
  "maxPoints": "number (required, min 1)",
  "passingScore": "number (optional, for passfail)",
  "dueDate": "ISO8601 (required)",
  "assignedDate": "ISO8601 (default: now)",
  "allowLateSubmission": "boolean (default: false)",
  "batchIds": "string[] (required, min 1)",
  "attachments": [
    {
      "fileName": "string",
      "fileUrl": "string",
      "fileSize": "number",
      "fileType": "string"
    }
  ],
  "linkedContentIds": "string[] (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Assignment created",
  "data": { /* Assignment object */ }
}
```

#### GET `/assignments/:assignmentId`
Get assignment details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assignment": { /* Full assignment object */ },
    "mySubmission": { /* Student's submission (if any) */ },  // Student only
    "canSubmit": true,  // Student only
    "isOverdue": false  // Student only
  }
}
```

#### PUT `/assignments/:assignmentId`
Update assignment (Teacher/Admin).

**Request Body:** Same as create, all optional

**Response (200):**
```json
{
  "success": true,
  "message": "Assignment updated",
  "data": { /* Updated assignment */ }
}
```

#### DELETE `/assignments/:assignmentId`
Delete assignment (Teacher/Admin).

**Response (200):**
```json
{
  "success": true,
  "message": "Assignment deleted"
}
```

#### POST `/assignments/:assignmentId/submit`
Submit assignment (Student).

**Request Body:**
```json
{
  "type": "text | file | link (must match assignment type)",
  "textContent": "string (for text submissions)",
  "fileUrl": "string (for file submissions)",
  "fileName": "string (for file submissions)",
  "fileSize": "number (for file submissions)",
  "linkUrl": "string (for link submissions)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Submission received",
  "data": {
    "submission": {
      "id": "string",
      "assignmentId": "string",
      "status": "submitted",
      "submittedAt": "ISO8601",
      "isLate": false
    }
  }
}
```

#### GET `/assignments/:assignmentId/submissions`
Get all submissions (Teacher/Admin).

**Query Params:**
- `status`: `pending | submitted | graded | late | all`
- `graded`: `true | false | all`
- `studentId`: string
- `page`: number
- `limit`: number

**Response (200):**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "string",
        "studentId": "string",
        "studentName": "string",
        "status": "submitted | graded",
        "submittedAt": "ISO8601",
        "isLate": false,
        "grade": 85,  // If graded
        "maxPoints": 100,
        "feedback": "string"  // If graded
      }
    ],
    "stats": {
      "total": 30,
      "submitted": 25,
      "graded": 20,
      "pending": 5,
      "averageGrade": 82.5
    },
    "pagination": { /* ... */ }
  }
}
```

#### GET `/assignments/:assignmentId/submissions/:submissionId`
Get submission details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "string",
      "assignmentId": "string",
      "studentId": "string",
      "studentName": "string",
      "type": "text | file | link",
      "textContent": "string",
      "fileUrl": "string",
      "fileName": "string",
      "status": "submitted | graded",
      "submittedAt": "ISO8601",
      "isLate": false,
      "grade": 85,
      "maxPoints": 100,
      "feedback": "string",
      "gradedAt": "ISO8601",
      "gradedBy": "string",
      "version": 1
    },
    "assignment": { /* Assignment details */ }
  }
}
```

#### PUT `/assignments/:assignmentId/submissions/:submissionId/grade`
Grade submission (Teacher/Admin).

**Request Body:**
```json
{
  "grade": "number (required, 0 to maxPoints)",
  "feedback": "string (optional, rich text)",
  "status": "graded (auto-set)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Submission graded",
  "data": { /* Updated submission */ }
}
```

#### GET `/assignments/stats`
Get assignment statistics (Teacher).

**Query Params:**
- `batchId`: string (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "active": 10,
    "closed": 3,
    "draft": 2,
    "totalSubmissions": 250,
    "pendingReview": 35,
    "graded": 215,
    "lateSubmissions": 12,
    "averageGrade": 82.3,
    "passingRate": 87.5
  }
}
```

---

## 📅 Class & Attendance

**Auth Required:** Yes

#### GET `/classes`
List classes.

**Query Params:**
- `batchId`: string
- `status`: `scheduled | ongoing | completed | cancelled | all`
- `dateRange`: `today | week | month | all | custom`
- `customStartDate`: ISO8601 (if dateRange=custom)
- `customEndDate`: ISO8601 (if dateRange=custom)
- `teacherId`: string
- `page`: number
- `limit`: number
- `search`: string

**Response (200):**
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "id": "string",
        "batchId": "string",
        "batchName": "string",
        "teacherId": "string",
        "teacherName": "string",
        "title": "string",
        "topic": "string",
        "startTime": "ISO8601",
        "endTime": "ISO8601",
        "duration": 60,
        "status": "scheduled | ongoing | completed | cancelled",
        "meetingLink": {
          "platform": "zoom | google-meet | ms-teams | other",
          "url": "string",
          "meetingId": "string",
          "password": "string"
        },
        "attendanceCount": 25,
        "totalStudents": 30,
        "isRecurring": false
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### POST `/classes`
Create class (Teacher/Admin).

**Request Body:**
```json
{
  "batchId": "string (required)",
  "title": "string (required, 3-200 chars)",
  "topic": "string (required)",
  "description": "string (optional)",
  "startTime": "ISO8601 (required)",
  "endTime": "ISO8601 (required)",
  "duration": "number (auto-calculated, minutes)",
  "meetingLink": {
    "platform": "zoom | google-meet | ms-teams | other",
    "url": "string (required)",
    "meetingId": "string (optional)",
    "password": "string (optional)",
    "notes": "string (optional)"
  },
  "notes": "string (optional)",
  "isRecurring": "boolean (default: false)",
  "recurringPattern": {  // If isRecurring=true
    "type": "daily | weekly | custom (required)",
    "interval": "number (e.g., every 2 weeks)",
    "daysOfWeek": "number[] (0-6, Sun-Sat, for weekly)",
    "endDate": "ISO8601 (optional)",
    "occurrences": "number (optional, how many classes)"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Class(es) created",
  "data": {
    "classes": [
      { /* Class object(s) - multiple if recurring */ }
    ],
    "recurringGroupId": "string (if recurring)"
  }
}
```

#### GET `/classes/:classId`
Get class details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "class": { /* Full class object */ },
    "batch": { /* Batch details */ },
    "attendance": [
      {
        "id": "string",
        "studentId": "string",
        "studentName": "string",
        "status": "present | absent | late | excused",
        "markedAt": "ISO8601",
        "markedBy": "string",
        "notes": "string"
      }
    ],
    "attendanceSummary": {
      "totalStudents": 30,
      "present": 25,
      "absent": 3,
      "late": 2,
      "excused": 0,
      "percentage": 83.3
    }
  }
}
```

#### PUT `/classes/:classId`
Update class (Teacher/Admin).

**Request Body:** Same as create, all optional

**Response (200):**
```json
{
  "success": true,
  "message": "Class updated",
  "data": { /* Updated class */ }
}
```

#### DELETE `/classes/:classId`
Delete/cancel class (Teacher/Admin).

**Query Params:**
- `cancelReason`: string (optional)
- `deleteRecurring`: `single | all | future` (if recurring)

**Response (200):**
```json
{
  "success": true,
  "message": "Class cancelled/deleted"
}
```

#### POST `/classes/:classId/start`
Mark class as ongoing (Teacher).

**Response (200):**
```json
{
  "success": true,
  "message": "Class started",
  "data": { /* Updated class with status=ongoing */ }
}
```

#### POST `/classes/:classId/complete`
Mark class as completed (Teacher).

**Request Body:**
```json
{
  "topicsCovered": "string[] (optional)",
  "homeworkAssigned": "string (optional)",
  "notes": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Class completed",
  "data": { /* Updated class with status=completed */ }
}
```

#### POST `/classes/:classId/attendance`
Mark attendance (Teacher).

**Request Body:**
```json
{
  "attendance": [
    {
      "studentId": "string (required)",
      "status": "present | absent | late | excused (required)",
      "notes": "string (optional)"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance marked",
  "data": {
    "attendance": [ /* Attendance records */ ],
    "summary": {
      "totalStudents": 30,
      "present": 25,
      "absent": 3,
      "late": 2,
      "excused": 0,
      "percentage": 83.3
    }
  }
}
```

#### PUT `/classes/:classId/attendance/:attendanceId`
Update single attendance record (Teacher).

**Request Body:**
```json
{
  "status": "present | absent | late | excused (required)",
  "notes": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance updated"
}
```

#### GET `/classes/calendar`
Get calendar events.

**Query Params:**
- `batchId`: string
- `startDate`: ISO8601 (required)
- `endDate`: ISO8601 (required)
- `view`: `month | week | day`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "string",
        "title": "string",
        "start": "ISO8601",
        "end": "ISO8601",
        "batchId": "string",
        "batchName": "string",
        "color": "#3b82f6",
        "status": "scheduled | ongoing | completed",
        "meetingLink": "string (optional)"
      }
    ]
  }
}
```

#### GET `/classes/stats`
Get class statistics (Teacher).

**Query Params:**
- `batchId`: string (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "scheduled": 20,
    "completed": 25,
    "cancelled": 5,
    "todayClasses": 3,
    "avgAttendance": 85.7,
    "upcomingThisWeek": 8
  }
}
```

---

## 📖 Content Management

**Auth Required:** Yes

#### GET `/content`
List content.

**Query Params:**
- `type`: `lesson | video | document | quiz | all`
- `status`: `published | draft | scheduled | all`
- `category`: string
- `batchId`: string (filter by batch access)
- `teacherId`: string
- `dateRange`: `week | month | all`
- `page`: number
- `limit`: number
- `search`: string
- `tags`: string (comma-separated)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "type": "lesson | video | document | quiz",
        "status": "published | draft | scheduled",
        "category": "string",
        "tags": ["string"],
        "thumbnail": "string (URL)",
        "fileUrl": "string",
        "fileName": "string",
        "fileSize": 1024000,
        "duration": 45,  // minutes, for videos
        "views": 125,
        "teacherId": "string",
        "batchIds": ["string"],
        "createdAt": "ISO8601",
        "scheduledAt": "ISO8601"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### POST `/content`
Create content (Teacher/Admin).

**Request Body:**
```json
{
  "title": "string (required, 3-200 chars)",
  "description": "string (required)",
  "type": "lesson | video | document | quiz (required)",
  "status": "published | draft | scheduled (default: draft)",
  "category": "string (required)",
  "tags": "string[] (optional)",
  "thumbnail": "string (optional, URL)",
  "content": "string (required, rich text HTML)",
  "fileUrl": "string (optional, for video/document)",
  "fileName": "string (optional)",
  "fileSize": "number (optional, bytes)",
  "duration": "number (optional, minutes for video)",
  "batchIds": "string[] (required, min 1)",
  "commentsEnabled": "boolean (default: true)",
  "downloadEnabled": "boolean (default: true)",
  "scheduledAt": "ISO8601 (required if status=scheduled)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Content created",
  "data": { /* Content object */ }
}
```

#### GET `/content/:contentId`
Get content details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "content": { /* Full content object */ },
    "relatedContent": [ /* Similar content */ ],
    "hasAccess": true  // For students
  }
}
```

#### PUT `/content/:contentId`
Update content (Teacher/Admin, own content only).

**Request Body:** Same as create, all optional

**Response (200):**
```json
{
  "success": true,
  "message": "Content updated",
  "data": { /* Updated content */ }
}
```

#### DELETE `/content/:contentId`
Delete content (Teacher/Admin).

**Response (200):**
```json
{
  "success": true,
  "message": "Content deleted"
}
```

#### POST `/content/:contentId/view`
Track content view (Student).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "views": 126
  }
}
```

#### GET `/content/stats`
Get content statistics (Teacher).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "published": 40,
    "drafts": 3,
    "scheduled": 2,
    "totalViews": 1250,
    "byType": {
      "lesson": 20,
      "video": 15,
      "document": 8,
      "quiz": 2
    }
  }
}
```

---

## 📂 Subject Hierarchy

**Auth Required:** Yes  
**Roles:** Teacher (CRUD own subjects), Student (read-only)

#### GET `/subjects`
List subjects.

**Query Params:**
- `teacherId`: string
- `page`: number
- `limit`: number
- `search`: string

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subjects": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "icon": "string",
        "color": "#3b82f6",
        "topicCount": 5,
        "chapterCount": 15,
        "contentCount": 45,
        "createdAt": "ISO8601"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### POST `/subjects`
Create subject (Teacher/Admin).

**Request Body:**
```json
{
  "name": "string (required, 2-100 chars)",
  "description": "string (optional)",
  "icon": "string (optional, icon name)",
  "color": "string (optional, hex color)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Subject created",
  "data": { /* Subject object */ }
}
```

#### GET `/subjects/:subjectId`
Get subject with topics and chapters.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subject": {
      "id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "color": "string",
      "topics": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "order": 1,
          "chapterCount": 3,
          "chapters": [
            {
              "id": "string",
              "name": "string",
              "description": "string",
              "order": 1,
              "contentIds": ["string"],
              "contentCount": 5
            }
          ]
        }
      ]
    }
  }
}
```

#### PUT `/subjects/:subjectId`
Update subject (Teacher/Admin).

**Request Body:** Same as create, all optional

**Response (200):**
```json
{
  "success": true,
  "message": "Subject updated"
}
```

#### DELETE `/subjects/:subjectId`
Delete subject (Teacher/Admin).

**Response (200):**
```json
{
  "success": true,
  "message": "Subject deleted"
}
```

#### POST `/subjects/:subjectId/topics`
Create topic (Teacher/Admin).

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "order": "number (optional, auto-increment)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Topic created",
  "data": { /* Topic object */ }
}
```

#### PUT `/subjects/:subjectId/topics/:topicId`
Update topic.

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "order": "number (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Topic updated"
}
```

#### DELETE `/subjects/:subjectId/topics/:topicId`
Delete topic.

**Response (200):**
```json
{
  "success": true,
  "message": "Topic deleted"
}
```

#### POST `/subjects/:subjectId/topics/:topicId/chapters`
Create chapter.

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "order": "number (optional)",
  "contentIds": "string[] (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Chapter created",
  "data": { /* Chapter object */ }
}
```

#### PUT `/subjects/:subjectId/topics/:topicId/chapters/:chapterId`
Update chapter.

**Response (200):**
```json
{
  "success": true,
  "message": "Chapter updated"
}
```

#### DELETE `/subjects/:subjectId/topics/:topicId/chapters/:chapterId`
Delete chapter.

**Response (200):**
```json
{
  "success": true,
  "message": "Chapter deleted"
}
```

---

## 📊 Analytics & Reporting

**Auth Required:** Yes  
**Roles:** Teacher (own data), Admin (all data), Student (own data only)

#### GET `/analytics/performance`
Get performance trend.

**Query Params:**
- `batchId`: string (optional, for teacher)
- `studentId`: string (optional, for admin/specific student)
- `days`: 7 | 30 | 90 (default: 30)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "trend": [
      {
        "date": "ISO8601",
        "averageScore": 85,
        "submissionCount": 12
      }
    ],
    "summary": {
      "averageScore": 82.5,
      "totalSubmissions": 250,
      "gradedSubmissions": 230
    }
  }
}
```

#### GET `/analytics/attendance`
Get attendance analytics.

**Query Params:**
- `batchId`: string (optional)
- `studentId`: string (optional)
- `days`: 7 | 30 | 90

**Response (200):**
```json
{
  "success": true,
  "data": {
    "trend": [
      {
        "date": "ISO8601",
        "attendanceRate": 87.5,
        "totalClasses": 4
      }
    ],
    "distribution": {
      "present": 450,
      "absent": 50,
      "late": 25,
      "excused": 10,
      "totalSlots": 535,
      "percentage": 88.8
    }
  }
}
```

#### GET `/analytics/grades`
Get grade distribution.

**Query Params:**
- `batchId`: string (optional)
- `assignmentId`: string (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "distribution": [
      { "grade": "A (90-100%)", "count": 45, "percentage": 30 },
      { "grade": "B (80-89%)", "count": 60, "percentage": 40 },
      { "grade": "C (70-79%)", "count": 30, "percentage": 20 },
      { "grade": "D (60-69%)", "count": 10, "percentage": 6.7 },
      { "grade": "F (0-59%)", "count": 5, "percentage": 3.3 }
    ],
    "stats": {
      "averageGrade": 82.5,
      "medianGrade": 85,
      "passingRate": 96.7
    }
  }
}
```

#### GET `/analytics/students/:studentId`
Get student performance (Teacher/Admin/own data).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "string",
      "name": "string"
    },
    "performance": {
      "averageScore": 85.5,
      "attendance": 92.3,
      "assignmentsCompleted": 18,
      "totalAssignments": 20,
      "completionRate": 90,
      "rank": 5,  // In batch
      "totalStudents": 30
    },
    "recentActivity": [
      {
        "type": "assignment | class",
        "title": "string",
        "date": "ISO8601",
        "score": 85
      }
    ]
  }
}
```

#### GET `/analytics/batch/:batchId`
Get batch analytics (Teacher/Admin).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batch": {
      "id": "string",
      "name": "string"
    },
    "analytics": {
      "totalStudents": 30,
      "activeStudents": 28,
      "averageAttendance": 87.5,
      "averageScore": 82.3,
      "contentCount": 45,
      "completedAssignments": 540,
      "pendingAssignments": 60,
      "engagementRate": 93.3
    },
    "topPerformers": [
      {
        "studentId": "string",
        "studentName": "string",
        "averageScore": 95.5,
        "attendance": 100
      }
    ],
    "needsAttention": [
      {
        "studentId": "string",
        "studentName": "string",
        "averageScore": 55,
        "attendance": 65,
        "reason": "Low score and attendance"
      }
    ]
  }
}
```

#### POST `/analytics/export`
Export analytics data.

**Request Body:**
```json
{
  "format": "pdf | excel (required)",
  "type": "performance | attendance | grades | batch (required)",
  "batchId": "string (optional)",
  "studentId": "string (optional)",
  "dateRange": {
    "start": "ISO8601",
    "end": "ISO8601"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "string (presigned URL)",
    "expiresAt": "ISO8601",
    "fileName": "analytics_report.pdf"
  }
}
```

---

## 🔗 Common Types

### Pagination
Used in list responses:
```json
{
  "page": 1,
  "limit": 20,
  "total": 150,
  "totalPages": 8,
  "hasNext": true,
  "hasPrev": false
}
```

### Success Response
Standard success format:
```json
{
  "success": true,
  "message": "Operation successful (optional)",
  "data": { /* Response data */ }
}
```

---

## ❌ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional info
  }
}
```

### Common Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `VALIDATION_ERROR` | Request validation failed |
| 400 | `INVALID_REQUEST` | Malformed request |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 401 | `TOKEN_EXPIRED` | JWT token expired |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 403 | `ACCESS_DENIED` | User doesn't have access to resource |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict (e.g., duplicate email) |
| 409 | `ALREADY_EXISTS` | Resource already exists |
| 422 | `UNPROCESSABLE_ENTITY` | Business logic error |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

### Validation Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

---

## 💾 Database Schema

### Recommended Database Structure

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  avatar TEXT,
  phone_number VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Teacher-specific
  subjects TEXT[], -- Array of subjects
  experience INTEGER,
  qualification TEXT,
  bio TEXT,
  verification_status VARCHAR(20) CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  
  -- Student-specific
  enrollment_date TIMESTAMP,
  parent_name VARCHAR(100),
  parent_contact VARCHAR(20),
  
  -- Admin-specific
  permissions TEXT[]
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

#### Batches Table
```sql
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  schedule TEXT,
  max_students INTEGER,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_subject ON batches(subject);
```

#### Batch Teachers (Many-to-Many)
```sql
CREATE TABLE batch_teachers (
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (batch_id, teacher_id)
);
```

#### Batch Students (Many-to-Many)
```sql
CREATE TABLE batch_students (
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (batch_id, student_id)
);
```

#### Batch Settings
```sql
CREATE TABLE batch_settings (
  batch_id UUID PRIMARY KEY REFERENCES batches(id) ON DELETE CASCADE,
  allow_late_join BOOLEAN DEFAULT true,
  access_start_date TIMESTAMP,
  access_end_date TIMESTAMP,
  is_visible BOOLEAN DEFAULT true,
  auto_approve_students BOOLEAN DEFAULT false
);
```

#### Batch Access Requests
```sql
CREATE TABLE batch_access_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_date TIMESTAMP DEFAULT NOW(),
  response_date TIMESTAMP,
  message TEXT,
  UNIQUE (batch_id, student_id)
);
```

#### Assignments
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('text', 'file', 'link', 'quiz')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'closed', 'draft')),
  grading_type VARCHAR(20) DEFAULT 'points' CHECK (grading_type IN ('points', 'passfail')),
  max_points INTEGER NOT NULL,
  passing_score INTEGER,
  due_date TIMESTAMP NOT NULL,
  assigned_date TIMESTAMP DEFAULT NOW(),
  allow_late_submission BOOLEAN DEFAULT false,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
```

#### Assignment Batches (Many-to-Many)
```sql
CREATE TABLE assignment_batches (
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  PRIMARY KEY (assignment_id, batch_id)
);
```

#### Assignment Attachments
```sql
CREATE TABLE assignment_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100)
);
```

#### Submissions
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  text_content TEXT,
  file_url TEXT,
  file_name VARCHAR(255),
  file_size BIGINT,
  link_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'late')),
  submitted_at TIMESTAMP DEFAULT NOW(),
  is_late BOOLEAN DEFAULT false,
  grade INTEGER,
  max_points INTEGER NOT NULL,
  feedback TEXT,
  graded_at TIMESTAMP,
  graded_by UUID REFERENCES users(id),
  version INTEGER DEFAULT 1,
  UNIQUE (assignment_id, student_id, version)
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
```

#### Classes
```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  topic VARCHAR(200) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  meeting_platform VARCHAR(50),
  meeting_url TEXT,
  meeting_id VARCHAR(100),
  meeting_password VARCHAR(100),
  meeting_notes TEXT,
  notes TEXT,
  topics_covered TEXT[],
  homework_assigned TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_group_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_classes_batch ON classes(batch_id);
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_status ON classes(status);
CREATE INDEX idx_classes_start_time ON classes(start_time);
CREATE INDEX idx_classes_recurring_group ON classes(recurring_group_id);
```

#### Attendance
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_at TIMESTAMP DEFAULT NOW(),
  marked_by UUID REFERENCES users(id),
  notes TEXT,
  UNIQUE (class_id, student_id)
);

CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
```

#### Content
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('lesson', 'video', 'document', 'quiz')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'scheduled')),
  category VARCHAR(100) NOT NULL,
  tags TEXT[],
  thumbnail TEXT,
  content TEXT NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  file_size BIGINT,
  duration INTEGER,
  views INTEGER DEFAULT 0,
  comments_enabled BOOLEAN DEFAULT true,
  download_enabled BOOLEAN DEFAULT true,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  scheduled_at TIMESTAMP
);

CREATE INDEX idx_content_teacher ON content(teacher_id);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_category ON content(category);
```

#### Content Batches (Many-to-Many)
```sql
CREATE TABLE content_batches (
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, batch_id)
);
```

#### Subjects
```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Topics
```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_topics_subject ON topics(subject_id);
```

#### Chapters
```sql
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chapters_topic ON chapters(topic_id);
```

#### Chapter Content (Many-to-Many)
```sql
CREATE TABLE chapter_content (
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  PRIMARY KEY (chapter_id, content_id)
);
```

#### Refresh Tokens
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked BOOLEAN DEFAULT false
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

---

## 🔒 Security & Best Practices

### Authentication
- Use bcrypt for password hashing (min 10 rounds)
- JWT tokens with short expiry (24h access, 30d refresh)
- Implement token rotation
- Store refresh tokens in database
- Implement logout (token revocation)

### Authorization
- Implement role-based access control (RBAC)
- Validate user permissions on every request
- Teachers can only access their own resources
- Students can only access batches they're enrolled in

### Validation
- Validate all inputs server-side
- Sanitize user-generated content (HTML)
- Implement rate limiting (e.g., 100 req/min)
- Validate file uploads (size, type)

### Data Privacy
- Never expose password hashes in responses
- Filter sensitive data based on user role
- Implement soft deletes for audit trail
- Log security events

### File Uploads
- Use presigned URLs for S3/cloud storage
- Validate file types and sizes
- Scan uploads for malware
- Implement CDN for static assets

### Rate Limiting
- Auth endpoints: 5 req/min
- File uploads: 10 req/hour
- General API: 100 req/min
- Use user ID or IP for tracking

---

## 📝 Notes for Backend Implementation

1. **Database:** PostgreSQL recommended (supports arrays, JSON, UUIDs)
2. **ORM:** Prisma, TypeORM, or Drizzle for type safety
3. **File Storage:** AWS S3, Cloudinary, or similar
4. **Authentication:** JWT with refresh tokens
5. **Real-time:** Socket.io for live class updates, notifications
6. **Email:** SendGrid, AWS SES for transactional emails
7. **Background Jobs:** Bull, BullMQ for async tasks (exports, notifications)
8. **Caching:** Redis for session management, rate limiting
9. **Logging:** Winston, Pino for structured logging
10. **Monitoring:** Sentry for error tracking

### API Versioning
- Use `/api/v1` prefix
- Plan for v2 when breaking changes needed
- Maintain backward compatibility

### Testing
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical flows
- Aim for 80%+ coverage

---

**End of API Specification**

This document provides complete specifications for implementing the Hi Teacher LMS backend. For questions or clarifications, refer to the frontend TypeScript types in the `/types` directory of the repository.
