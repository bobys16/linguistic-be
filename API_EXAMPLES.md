# API Testing Examples

## Setup

All authenticated requests require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 1. Authentication Flow

### Register a new user
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "name": "Test User",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get current user profile
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## 2. Modules

### Get all modules
```bash
curl -X GET http://localhost:3001/api/modules \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "modules": [
      {
        "id": "uuid",
        "title": "Working Memory",
        "description": "Explore how working memory functions in language processing",
        "type": "WORKING_MEMORY",
        "order": 1,
        "tasks": [...]
      }
    ]
  }
}
```

### Get specific module
```bash
curl -X GET http://localhost:3001/api/modules/<module-id> \
  -H "Authorization: Bearer <token>"
```

## 3. Tasks

### Get task details
```bash
curl -X GET http://localhost:3001/api/tasks/<task-id> \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "uuid",
      "title": "Digit Span Forward",
      "description": "Remember and recall sequences of digits in order",
      "type": "DIGIT_SPAN",
      "instructions": "You will see sequences...",
      "config": {
        "trials": 5,
        "correctSequences": [[3, 7, 2], [5, 9, 1, 4]]
      }
    }
  }
}
```

## 4. Attempts

### Submit a task attempt (Digit Span)
```bash
curl -X POST http://localhost:3001/api/attempts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "wm-digit-span-1",
    "startTime": "2024-01-01T10:00:00Z",
    "endTime": "2024-01-01T10:05:00Z",
    "response": {
      "trials": [
        { "userInput": [3, 7, 2] },
        { "userInput": [5, 9, 1, 4] },
        { "userInput": [8, 2, 6, 3, 9] }
      ]
    }
  }'
```

### Submit Lexical Decision attempt
```bash
curl -X POST http://localhost:3001/api/attempts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "ps-lexical-1",
    "startTime": "2024-01-01T10:00:00Z",
    "endTime": "2024-01-01T10:02:00Z",
    "response": {
      "trials": [
        { "response": true, "reactionTime": 450 },
        { "response": false, "reactionTime": 520 },
        { "response": true, "reactionTime": 380 }
      ]
    }
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "attempt": {
      "id": "uuid",
      "taskId": "uuid",
      "score": 8,
      "accuracy": 80,
      "reactionTime": 450,
      "metadata": {
        "correctResponses": 8,
        "totalTrials": 10
      },
      "createdAt": "2024-01-01T10:05:00Z"
    }
  }
}
```

### Get latest attempts
```bash
curl -X GET http://localhost:3001/api/attempts/my-latest?limit=10 \
  -H "Authorization: Bearer <token>"
```

### Get attempt summary
```bash
curl -X GET http://localhost:3001/api/attempts/my-summary \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalAttempts": 25,
      "averageScore": 7.5,
      "averageAccuracy": 75.5,
      "averageReactionTime": 450.2,
      "byModule": {
        "WORKING_MEMORY": {
          "count": 10,
          "averageScore": 8.2,
          "averageAccuracy": 82
        }
      },
      "byTaskType": {
        "DIGIT_SPAN": {
          "count": 5,
          "averageScore": 8.5,
          "averageAccuracy": 85
        }
      }
    }
  }
}
```

## 5. Reflections

### Create a reflection
```bash
curl -X POST http://localhost:3001/api/reflections \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Today I learned that my working memory capacity is limited to about 7 items. I found chunking to be a helpful strategy.",
    "tags": ["working_memory", "strategies", "insights"]
  }'
```

### Get my reflections
```bash
curl -X GET http://localhost:3001/api/reflections/my?limit=10&offset=0 \
  -H "Authorization: Bearer <token>"
```

### Filter reflections by tags
```bash
curl -X GET "http://localhost:3001/api/reflections/my?tags=working_memory,insights" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "reflections": [
      {
        "id": "uuid",
        "content": "Today I learned...",
        "tags": ["working_memory", "strategies"],
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "total": 15,
    "limit": 10,
    "offset": 0
  }
}
```

## 6. Progress

### Get my overall progress
```bash
curl -X GET http://localhost:3001/api/progress/my \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "progress": {
      "totalTasksCompleted": 12,
      "uniqueTasksCompleted": 12,
      "totalAttempts": 25,
      "averageAccuracy": 78.5,
      "averageScore": 8.2,
      "lastActivityDate": "2024-01-01T15:30:00Z",
      "streak": 5,
      "moduleProgress": [
        {
          "moduleId": "uuid",
          "moduleTitle": "Working Memory",
          "moduleType": "WORKING_MEMORY",
          "totalTasks": 5,
          "completedTasks": 5,
          "progressPercentage": 100,
          "averageAccuracy": 82,
          "averageScore": 8.5,
          "attemptsCount": 10
        }
      ],
      "recentActivity": [...]
    }
  }
}
```

### Get progress for specific module
```bash
curl -X GET http://localhost:3001/api/progress/module/<module-id> \
  -H "Authorization: Bearer <token>"
```

## 7. Health Check (No Auth Required)

```bash
curl -X GET http://localhost:3001/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {...}
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "No token provided"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Testing with Postman

1. Import this as a collection
2. Create an environment variable `baseUrl` = `http://localhost:3001`
3. Create an environment variable `token` (will be set after login)
4. Use `{{baseUrl}}` and `{{token}}` in requests

## Testing with VS Code REST Client

Create a file `api.http`:

```http
### Register
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}

### Login
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Get Modules (replace <token> with actual token)
GET http://localhost:3001/api/modules
Authorization: Bearer <token>
```
