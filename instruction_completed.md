d# Digital Psycholinguistics Workbook – Backend Developer Prompt (Claude Version)

You are a senior backend engineer.
Your task: **Design and implement the complete backend API** for a web-based **Digital Psycholinguistics Workbook**.

We are ONLY building the **backend** now.  
Frontend will be handled later.

---

## 1. Product Overview
This backend supports a digital workbook that teaches **Psycholinguistics** through interactive tasks:

- Working Memory  
- Processing Speed  
- Noticing  
- Reflective Practice  

The backend must support:
- Modules
- Tasks within modules
- Task attempts
- Scoring logic
- User accounts & authentication
- Reflection journals
- Progress analytics

---

## 2. Tech Stack Requirements
Use the following stack:

- TypeScript  
- Node.js (LTS)  
- Express.js  
- PostgreSQL  
- Prisma ORM  
- Zod (validation)  
- JWT authentication  
- bcrypt.js  

Backend default port: **3001**

---

## 3. Project Structure
```
psychoworkbook-backend/
  prisma/
    schema.prisma
  src/
    server.ts
    app.ts
    config/
      env.ts
    db/
      prismaClient.ts
    routes/
      auth.routes.ts
      module.routes.ts
      task.routes.ts
      attempt.routes.ts
      reflection.routes.ts
    controllers/
    services/
    middleware/
    validators/
    utils/
```

---

## 4. API Requirements

### **Auth API**
- POST /api/auth/register  
- POST /api/auth/login  
- GET /api/auth/me  

Includes JWT, bcrypt hashing, validation with Zod.

---

### **Modules API**
- GET /api/modules  
- GET /api/modules/:id  
- (Optional admin) POST, PATCH, DELETE

---

### **Tasks API**
- GET /api/tasks/:id  
- (Optional admin) POST, PATCH, DELETE

---

### **Task Attempts API**
- POST /api/attempts  
  - Accepts taskId, timestamps, response JSON  
  - Backend computes:
    - score  
    - accuracy  
    - reaction time  

- GET /api/attempts/my-latest  
- GET /api/attempts/my-summary  

---

### **Reflections API**
- POST /api/reflections  
- GET /api/reflections/my  

---

### **Progress API**
- GET /api/progress/my  
  - Returns:
    - tasks completed  
    - average accuracy  
    - last activity  
    - module-level progress  

---

## 5. Scoring Logic Requirements

### Working Memory Tasks
- Exact recall scoring  
- Accuracy = correct trials / total trials  

### Processing Speed Tasks
- Lexical decision, sentence verification  
- Score = correct responses  
- Includes average reaction time  

### Noticing Tasks
- Form-meaning mapping  
- Error correction  
- Accuracy scoring  

### Reflection Tasks
- No score (score = 0)

---

## 6. What Claude Must Produce

### Step-by-step code delivery:
1. **Project initialization**
2. **Prisma schema**
3. **App & server setup**
4. **Auth system**
5. **Module & Task APIs**
6. **Attempt logic + scoring utils**
7. **Reflections**
8. **Progress calculation**
9. **Example API requests & responses**

All code must be modular, clean, and production-ready.

---