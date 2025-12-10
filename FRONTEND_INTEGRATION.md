# Frontend Integration Guide

Complete guide for integrating your frontend application with the Psycholinguistics Workbook Backend API.

---

## 🚀 Quick Start

### Base URL
```
Development: http://localhost:3001
Production: https://your-api-domain.com
```

### Demo Account
```
Email: demo@example.com
Password: password123
```

---

## 📋 Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [API Endpoints Reference](#api-endpoints-reference)
3. [Request/Response Examples](#requestresponse-examples)
4. [Error Handling](#error-handling)
5. [State Management Suggestions](#state-management-suggestions)
6. [TypeScript Types](#typescript-types)
7. [Best Practices](#best-practices)

---

## 🔐 Authentication Flow

### 1. Register New User

```javascript
const register = async (email, password, name) => {
  const response = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });
  
  const data = await response.json();
  
  if (data.status === 'success') {
    // Store token in localStorage or state management
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  }
  
  throw new Error(data.message);
};
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.status === 'success') {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  }
  
  throw new Error(data.message);
};
```

### 3. Get Current User (Protected Route)

```javascript
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3001/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  return data.data.user;
};
```

### 4. Logout

```javascript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page
};
```

---

## 📚 API Endpoints Reference

### Base Headers for Protected Routes
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
};
```

### Modules

#### Get All Modules
```javascript
GET /api/modules
Headers: Authorization: Bearer <token>
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
        "description": "Explore how working memory functions",
        "type": "WORKING_MEMORY",
        "order": 1,
        "tasks": [
          {
            "id": "uuid",
            "title": "Digit Span Forward",
            "description": "Remember sequences of digits",
            "type": "DIGIT_SPAN",
            "order": 1
          }
        ]
      }
    ]
  }
}
```

#### Get Module by ID
```javascript
GET /api/modules/:id
Headers: Authorization: Bearer <token>
```

### Tasks

#### Get Task by ID
```javascript
GET /api/tasks/:id
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "uuid",
      "moduleId": "uuid",
      "title": "Digit Span Forward",
      "description": "Remember and recall sequences",
      "type": "DIGIT_SPAN",
      "instructions": "You will see sequences of digits...",
      "config": {
        "trials": 5,
        "correctSequences": [[3, 7, 2], [5, 9, 1, 4]]
      },
      "order": 1,
      "module": {
        "id": "uuid",
        "title": "Working Memory",
        "type": "WORKING_MEMORY"
      }
    }
  }
}
```

### Attempts

#### Submit Task Attempt
```javascript
POST /api/attempts
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body Examples:**

**For Digit Span:**
```json
{
  "taskId": "wm-digit-span-1",
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T10:05:00.000Z",
  "response": {
    "trials": [
      { "userInput": [3, 7, 2] },
      { "userInput": [5, 9, 1, 4] },
      { "userInput": [8, 2, 6, 3, 9] }
    ]
  }
}
```

**For Lexical Decision:**
```json
{
  "taskId": "ps-lexical-1",
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T10:02:00.000Z",
  "response": {
    "trials": [
      { "response": true, "reactionTime": 450 },
      { "response": false, "reactionTime": 520 },
      { "response": true, "reactionTime": 380 }
    ]
  }
}
```

**For Sentence Verification:**
```json
{
  "taskId": "ps-sentence-1",
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T10:03:00.000Z",
  "response": {
    "trials": [
      { "response": true, "reactionTime": 1200 },
      { "response": false, "reactionTime": 1500 }
    ]
  }
}
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
      "reactionTime": 450.5,
      "metadata": {
        "correctTrials": 8,
        "totalTrials": 10
      },
      "createdAt": "2024-01-01T10:05:00.000Z",
      "task": {
        "id": "uuid",
        "title": "Digit Span Forward",
        "type": "DIGIT_SPAN"
      }
    }
  }
}
```

#### Get Latest Attempts
```javascript
GET /api/attempts/my-latest?limit=10
Headers: Authorization: Bearer <token>
```

#### Get Attempt Summary
```javascript
GET /api/attempts/my-summary
Headers: Authorization: Bearer <token>
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

### Reflections

#### Create Reflection
```javascript
POST /api/reflections
Headers: Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "content": "Today I learned that chunking helps with memory...",
  "tags": ["working_memory", "strategies", "insights"]
}
```

#### Get My Reflections
```javascript
GET /api/reflections/my?limit=50&offset=0&tags=working_memory,insights
Headers: Authorization: Bearer <token>
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
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "total": 15,
    "limit": 50,
    "offset": 0
  }
}
```

#### Update Reflection
```javascript
PATCH /api/reflections/:id
Headers: Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "content": "Updated content...",
  "tags": ["working_memory", "new_tag"]
}
```

#### Delete Reflection
```javascript
DELETE /api/reflections/:id
Headers: Authorization: Bearer <token>
```

### Progress

#### Get My Progress
```javascript
GET /api/progress/my
Headers: Authorization: Bearer <token>
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
      "lastActivityDate": "2024-01-01T15:30:00.000Z",
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
      "recentActivity": [
        {
          "attemptId": "uuid",
          "taskId": "uuid",
          "taskTitle": "Digit Span Forward",
          "taskType": "DIGIT_SPAN",
          "moduleTitle": "Working Memory",
          "moduleType": "WORKING_MEMORY",
          "score": 9,
          "accuracy": 90,
          "reactionTime": 420,
          "completedAt": "2024-01-01T15:30:00.000Z"
        }
      ]
    }
  }
}
```

#### Get Module Progress
```javascript
GET /api/progress/module/:moduleId
Headers: Authorization: Bearer <token>
```

---

## 🎨 Request/Response Examples

### Complete JavaScript Helper Functions

```javascript
// api.js - API Helper Functions

const API_BASE_URL = 'http://localhost:3001';

// Helper to get auth headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (email, password, name) =>
    apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email, password) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () =>
    apiFetch('/api/auth/me', {
      headers: getAuthHeaders(),
    }),
};

// Modules API
export const modulesAPI = {
  getAll: () =>
    apiFetch('/api/modules', {
      headers: getAuthHeaders(),
    }),

  getById: (id) =>
    apiFetch(`/api/modules/${id}`, {
      headers: getAuthHeaders(),
    }),
};

// Tasks API
export const tasksAPI = {
  getById: (id) =>
    apiFetch(`/api/tasks/${id}`, {
      headers: getAuthHeaders(),
    }),
};

// Attempts API
export const attemptsAPI = {
  create: (attemptData) =>
    apiFetch('/api/attempts', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(attemptData),
    }),

  getLatest: (limit = 10) =>
    apiFetch(`/api/attempts/my-latest?limit=${limit}`, {
      headers: getAuthHeaders(),
    }),

  getSummary: () =>
    apiFetch('/api/attempts/my-summary', {
      headers: getAuthHeaders(),
    }),

  getByTask: (taskId) =>
    apiFetch(`/api/attempts/task/${taskId}`, {
      headers: getAuthHeaders(),
    }),
};

// Reflections API
export const reflectionsAPI = {
  create: (content, tags = []) =>
    apiFetch('/api/reflections', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, tags }),
    }),

  getAll: (limit = 50, offset = 0, tags = null) => {
    const params = new URLSearchParams({ limit, offset });
    if (tags) params.append('tags', tags);
    return apiFetch(`/api/reflections/my?${params}`, {
      headers: getAuthHeaders(),
    });
  },

  update: (id, data) =>
    apiFetch(`/api/reflections/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`/api/reflections/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};

// Progress API
export const progressAPI = {
  getMy: () =>
    apiFetch('/api/progress/my', {
      headers: getAuthHeaders(),
    }),

  getModule: (moduleId) =>
    apiFetch(`/api/progress/module/${moduleId}`, {
      headers: getAuthHeaders(),
    }),
};
```

### React Hook Example

```javascript
// useAuth.js
import { useState, useEffect } from 'react';
import { authAPI } from './api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getCurrentUser()
        .then((data) => setUser(data.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    return data.data;
  };

  const register = async (email, password, name) => {
    const data = await authAPI.register(email, password, name);
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, login, register, logout };
};
```

---

## ⚠️ Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created (e.g., new user, reflection, attempt)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Handling Example

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        return 'Invalid input. Please check your data.';
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        return 'Session expired. Please login again.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.response.data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

// Usage
try {
  const data = await modulesAPI.getAll();
  console.log(data);
} catch (error) {
  const message = handleApiError(error);
  alert(message);
}
```

---

## 🎯 TypeScript Types

```typescript
// types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: 'success';
  data: {
    user: User;
    token: string;
  };
}

export type ModuleType = 
  | 'WORKING_MEMORY' 
  | 'PROCESSING_SPEED' 
  | 'NOTICING' 
  | 'REFLECTIVE_PRACTICE';

export type TaskType =
  | 'DIGIT_SPAN'
  | 'READING_SPAN'
  | 'LEXICAL_DECISION'
  | 'SENTENCE_VERIFICATION'
  | 'FORM_MEANING_MAPPING'
  | 'ERROR_CORRECTION'
  | 'GUIDED_REFLECTION'
  | 'FREE_REFLECTION';

export interface Module {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  order: number;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: TaskType;
  instructions: string;
  config: any; // Task-specific configuration
  order: number;
  createdAt: string;
  updatedAt: string;
  module?: {
    id: string;
    title: string;
    type: ModuleType;
  };
}

export interface Attempt {
  id: string;
  userId: string;
  taskId: string;
  startTime: string;
  endTime: string;
  response: any;
  score: number;
  accuracy: number | null;
  reactionTime: number | null;
  metadata: any;
  createdAt: string;
  task?: {
    id: string;
    title: string;
    type: TaskType;
  };
}

export interface Reflection {
  id: string;
  userId: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  totalTasksCompleted: number;
  uniqueTasksCompleted: number;
  totalAttempts: number;
  averageAccuracy: number;
  averageScore: number;
  lastActivityDate: string | null;
  streak: number;
  moduleProgress: ModuleProgress[];
  recentActivity: RecentActivity[];
}

export interface ModuleProgress {
  moduleId: string;
  moduleTitle: string;
  moduleType: ModuleType;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  averageAccuracy: number;
  averageScore: number;
  attemptsCount: number;
}

export interface RecentActivity {
  attemptId: string;
  taskId: string;
  taskTitle: string;
  taskType: TaskType;
  moduleTitle: string;
  moduleType: ModuleType;
  score: number;
  accuracy: number | null;
  reactionTime: number | null;
  completedAt: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}
```

---

## 💡 State Management Suggestions

### React Context Example

```javascript
// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authAPI.getCurrentUser();
          setUser(data.data.user);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Redux Slice Example (Redux Toolkit)

```javascript
// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from './api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('token', data.data.token);
    return data.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

---

## ✅ Best Practices

### 1. Token Management

```javascript
// Store token in localStorage
localStorage.setItem('token', token);

// Always check token expiration
const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Decode JWT and check expiration
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Refresh token before it expires (if implementing refresh tokens)
```

### 2. Protected Routes (React Router)

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### 3. Centralized API Configuration

```javascript
// config.js
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};
```

### 4. Request Interceptors (Axios Example)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 5. Loading States

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await modulesAPI.getAll();
    setData(result.data.modules);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 6. Task Attempt Timing

```javascript
const startTask = () => {
  const startTime = new Date().toISOString();
  return startTime;
};

const endTask = (startTime) => {
  const endTime = new Date().toISOString();
  return { startTime, endTime };
};

// Usage in task component
const handleTaskComplete = async (userResponse) => {
  const { startTime, endTime } = endTask(taskStartTime);
  
  await attemptsAPI.create({
    taskId: currentTask.id,
    startTime,
    endTime,
    response: userResponse,
  });
};
```

### 7. Optimistic Updates

```javascript
const createReflection = async (content, tags) => {
  const tempId = Date.now().toString();
  const tempReflection = {
    id: tempId,
    content,
    tags,
    createdAt: new Date().toISOString(),
  };

  // Add to UI immediately
  setReflections([tempReflection, ...reflections]);

  try {
    const result = await reflectionsAPI.create(content, tags);
    // Replace temp with real data
    setReflections((prev) =>
      prev.map((r) => (r.id === tempId ? result.data.reflection : r))
    );
  } catch (error) {
    // Remove temp on error
    setReflections((prev) => prev.filter((r) => r.id !== tempId));
    throw error;
  }
};
```

---

## 🔧 Environment Variables

Create `.env` file in your frontend:

```env
# Development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development

# Production
# REACT_APP_API_URL=https://api.yourdomain.com
# REACT_APP_ENV=production
```

---

## 📱 Suggested UI Pages/Components

### Essential Pages
1. **Login/Register Page** - Auth forms
2. **Dashboard** - Overview of progress and modules
3. **Modules List** - Display all modules
4. **Module Detail** - Tasks within a module
5. **Task Page** - Interactive task component
6. **Results Page** - Show attempt results
7. **Progress Page** - Detailed analytics
8. **Reflections Page** - Journal entries
9. **Profile Page** - User settings

### Key Components
- `AuthForm` - Login/register form
- `ModuleCard` - Module display card
- `TaskRunner` - Interactive task interface
- `ProgressChart` - Visualize statistics
- `ReflectionEditor` - Create/edit reflections
- `ActivityFeed` - Recent attempts
- `ScoreDisplay` - Show results

---

## 🎮 Task Implementation Examples

### Digit Span Task Component

```javascript
import { useState, useEffect } from 'react';

const DigitSpanTask = ({ task, onComplete }) => {
  const [currentTrial, setCurrentTrial] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState([]);
  const [startTime] = useState(new Date().toISOString());

  const trials = task.config.correctSequences;

  const handleSubmit = () => {
    const digits = userInput.split('').map(Number);
    setResponses([...responses, { userInput: digits }]);
    setUserInput('');
    
    if (currentTrial < trials.length - 1) {
      setCurrentTrial(currentTrial + 1);
    } else {
      submitAttempt();
    }
  };

  const submitAttempt = async () => {
    const endTime = new Date().toISOString();
    await attemptsAPI.create({
      taskId: task.id,
      startTime,
      endTime,
      response: { trials: responses },
    });
    onComplete();
  };

  return (
    <div>
      <h2>{task.title}</h2>
      <p>Trial {currentTrial + 1} of {trials.length}</p>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter digits"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
```

---

## 📊 Data Visualization Suggestions

### Libraries to Use
- **Chart.js** - Simple charts
- **Recharts** - React charts
- **D3.js** - Complex visualizations
- **Victory** - Mobile-friendly charts

### Visualization Ideas
1. **Line Chart** - Progress over time
2. **Bar Chart** - Scores by module/task
3. **Pie Chart** - Time spent per module
4. **Radar Chart** - Skills across categories
5. **Heatmap** - Activity calendar

---

## 🚀 Deployment Considerations

### CORS Configuration
Ensure backend CORS allows your frontend domain:

```env
# Backend .env
CORS_ORIGIN=https://your-frontend-domain.com
```

### Production API URL
Update API base URL for production:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.yourdomain.com'
  : 'http://localhost:3001';
```

---

## 🐛 Debugging Tips

### Check Network Requests
```javascript
// Add logging to API calls
const apiFetch = async (endpoint, options) => {
  console.log('API Request:', endpoint, options);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();
  console.log('API Response:', data);
  return data;
};
```

### Validate Token
```javascript
const debugToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    console.log('Token payload:', payload);
    console.log('Expires:', new Date(payload.exp * 1000));
  }
};
```

---

## 📞 Support & Resources

### Backend Documentation
- `README.md` - Full backend documentation
- `API_EXAMPLES.md` - Curl examples
- `PROJECT_SUMMARY.md` - Technical details

### Backend Health Check
```
http://localhost:3001/health
```

### Demo Account for Testing
```
Email: demo@example.com
Password: password123
```

---

## 🎉 You're Ready!

You now have everything you need to integrate your frontend with the Psycholinguistics Workbook Backend API. Start by implementing authentication, then progressively add features like modules, tasks, and progress tracking.

**Happy coding! 🚀**
