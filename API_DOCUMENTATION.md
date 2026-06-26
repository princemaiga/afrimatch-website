# AfriMatch API Documentation

## Overview

The AfriMatch API provides endpoints for managing users, subscriptions, messaging, jobs, courses, and more. All endpoints are RESTful and return JSON responses.

**Base URL**: `https://api.afrimatch.app/v1`  
**API Version**: 1.0.0  
**Last Updated**: June 2026

---

## Authentication

All API requests require authentication using Bearer tokens or API keys.

### Bearer Token Authentication

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://api.afrimatch.app/v1/users/me
```

### API Key Authentication

```bash
curl -H "X-API-Key: YOUR_API_KEY" \
  https://api.afrimatch.app/v1/users/me
```

---

## Rate Limiting

API requests are rate limited to prevent abuse:

- **General API**: 100 requests per minute
- **Authentication**: 5 attempts per 15 minutes
- **Search**: 30 requests per minute
- **File Upload**: 10 uploads per hour

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
```

---

## Endpoints

### Users

#### Get Current User

```
GET /users/me
```

**Response**:
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "mode": "dating",
  "subscription": {
    "plan": "premium",
    "status": "active",
    "expiresAt": "2026-07-12"
  }
}
```

#### Update User Profile

```
PUT /users/me
```

**Request Body**:
```json
{
  "name": "John Doe",
  "bio": "Software engineer",
  "location": "Lagos, Nigeria",
  "skills": ["React", "Node.js"]
}
```

#### Switch Mode

```
POST /users/me/mode
```

**Request Body**:
```json
{
  "mode": "professional"
}
```

---

### Messages

#### Get Conversations

```
GET /messages/conversations
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

**Response**:
```json
{
  "conversations": [
    {
      "id": "conv-123",
      "participantId": "user-456",
      "participantName": "Jane Smith",
      "lastMessage": "Hey, how are you?",
      "lastMessageTime": "2026-06-12T10:30:00Z",
      "unreadCount": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### Send Message

```
POST /messages
```

**Request Body**:
```json
{
  "conversationId": "conv-123",
  "content": "Hello!",
  "type": "text"
}
```

---

### Jobs

#### List Jobs

```
GET /jobs
```

**Query Parameters**:
- `search`: Search query
- `location`: Filter by location
- `type`: Job type (full-time, part-time, contract)
- `level`: Experience level
- `minSalary`: Minimum salary
- `maxSalary`: Maximum salary
- `page`: Page number
- `limit`: Results per page

**Response**:
```json
{
  "jobs": [
    {
      "id": "job-123",
      "title": "Senior Developer",
      "company": "Tech Corp",
      "location": "Lagos",
      "salary": "$80k - $120k",
      "type": "full-time",
      "level": "senior",
      "description": "...",
      "skills": ["React", "Node.js"],
      "postedDate": "2026-06-10"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

#### Apply for Job

```
POST /jobs/{jobId}/apply
```

**Response**:
```json
{
  "applicationId": "app-123",
  "status": "submitted",
  "appliedAt": "2026-06-12T10:30:00Z"
}
```

---

### Courses

#### List Courses

```
GET /courses
```

**Query Parameters**:
- `search`: Search query
- `category`: Filter by category
- `level`: Difficulty level
- `page`: Page number
- `limit`: Results per page

**Response**:
```json
{
  "courses": [
    {
      "id": "course-123",
      "title": "Web Development Fundamentals",
      "description": "...",
      "instructor": "John Smith",
      "category": "Technology",
      "level": "beginner",
      "duration": 3600,
      "lessons": 12,
      "rating": 4.8,
      "reviews": 234,
      "price": 49.99,
      "isFree": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 450
  }
}
```

#### Enroll in Course

```
POST /courses/{courseId}/enroll
```

**Response**:
```json
{
  "enrollmentId": "enroll-123",
  "courseId": "course-123",
  "status": "active",
  "enrolledAt": "2026-06-12T10:30:00Z",
  "expiresAt": null
}
```

---

### Blog

#### List Articles

```
GET /blog/articles
```

**Query Parameters**:
- `search`: Search query
- `category`: Filter by category
- `page`: Page number
- `limit`: Results per page

**Response**:
```json
{
  "articles": [
    {
      "id": "article-123",
      "title": "5 Tips for Finding Love",
      "slug": "5-tips-for-finding-love",
      "excerpt": "...",
      "author": "Sarah Johnson",
      "category": "dating",
      "publishedAt": "2026-06-10T09:00:00Z",
      "readTime": 5,
      "views": 1234,
      "likes": 89,
      "comments": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 320
  }
}
```

#### Get Article

```
GET /blog/articles/{slug}
```

**Response**:
```json
{
  "id": "article-123",
  "title": "5 Tips for Finding Love",
  "slug": "5-tips-for-finding-love",
  "content": "...",
  "author": "Sarah Johnson",
  "category": "dating",
  "tags": ["dating", "relationships"],
  "publishedAt": "2026-06-10T09:00:00Z",
  "readTime": 5,
  "views": 1234,
  "likes": 89,
  "comments": 12,
  "relatedArticles": [...]
}
```

---

### Subscriptions

#### Get Subscription

```
GET /subscriptions/me
```

**Response**:
```json
{
  "id": "sub-123",
  "userId": "user-123",
  "plan": "premium",
  "mode": "dating",
  "status": "active",
  "startDate": "2026-05-12",
  "expiresAt": "2026-07-12",
  "autoRenew": true,
  "price": 19.99,
  "currency": "USD"
}
```

#### Create Subscription

```
POST /subscriptions
```

**Request Body**:
```json
{
  "plan": "premium",
  "mode": "dating",
  "paymentMethod": "stripe",
  "billingCycle": "monthly"
}
```

---

### Search

#### Advanced Search

```
GET /search
```

**Query Parameters**:
- `q`: Search query (required)
- `type`: Content type (users, jobs, courses, articles)
- `location`: Filter by location
- `skills`: Comma-separated skills
- `industry`: Filter by industry
- `minSalary`: Minimum salary
- `maxSalary`: Maximum salary
- `page`: Page number
- `limit`: Results per page

**Response**:
```json
{
  "users": [...],
  "jobs": [...],
  "courses": [...],
  "articles": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 450
  }
}
```

---

### Admin

#### Get Analytics

```
GET /admin/analytics
```

**Query Parameters**:
- `dateRange`: 24hours, 7days, 30days, 90days, 1year

**Response**:
```json
{
  "totalUsers": 15420,
  "activeUsers": 8340,
  "newSignups": 342,
  "totalRevenue": 125680,
  "conversionRate": 22.5,
  "churnRate": 4.2,
  "ltv": 285.5,
  "topPages": [...],
  "userGrowth": [...],
  "revenueByPlan": {...}
}
```

#### Get Reports

```
GET /admin/reports
```

**Query Parameters**:
- `status`: pending, investigating, resolved, dismissed
- `severity`: critical, high, medium, low
- `page`: Page number
- `limit`: Results per page

---

## Error Handling

### Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2026-06-12T10:30:00Z"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_REQUEST | 400 | Invalid request format |
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## Webhooks

### Payment Webhook

**Event**: `payment.completed`

```json
{
  "event": "payment.completed",
  "data": {
    "paymentId": "pay-123",
    "userId": "user-123",
    "amount": 19.99,
    "currency": "USD",
    "status": "completed",
    "timestamp": "2026-06-12T10:30:00Z"
  }
}
```

### Message Webhook

**Event**: `message.received`

```json
{
  "event": "message.received",
  "data": {
    "messageId": "msg-123",
    "conversationId": "conv-123",
    "senderId": "user-123",
    "content": "Hello!",
    "timestamp": "2026-06-12T10:30:00Z"
  }
}
```

---

## SDKs

Official SDKs are available for:

- **JavaScript/TypeScript**: `npm install @afrimatch/sdk`
- **Python**: `pip install afrimatch-sdk`
- **Go**: `go get github.com/afrimatch/sdk-go`

---

## Support

For API support, contact: `api-support@afrimatch.app`

---

**Last Updated**: June 2026  
**Version**: 1.0.0
