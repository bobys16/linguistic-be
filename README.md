# Digital Psycholinguistics Workbook - Backend

A production-ready REST API backend for the Digital Psycholinguistics Workbook, an educational platform designed for Master's degree students in English Language Teaching (ELT) and Applied Linguistics programs.

## About This Project

This application serves as an interactive learning tool for advanced psycholinguistics concepts, focusing on four core cognitive areas essential for language acquisition and processing:

- **Working Memory**: Tasks measuring digit span and reading span capacity
- **Processing Speed**: Lexical decision and sentence verification exercises
- **Noticing**: Form-meaning mapping and error correction activities
- **Reflective Practice**: Guided and free reflection prompts for metacognitive development

Developed by **Bondan Charisnanda** for linguistics coursework in Master's degree ELT programs.

## Related Repositories

- **Frontend:** [linguistic-fe](https://github.com/bobys16/linguistic-fe) - React-based user interface
- **Backend:** [linguistic-be](https://github.com/bobys16/linguistic-be) - This repository

## Features

- 🔐 JWT Authentication with bcrypt password hashing
- 📚 Module and Task management
- 📝 Task attempt tracking with intelligent scoring
- 🎯 Progress analytics and tracking
- 💭 Reflection journal system
- ✅ Input validation with Zod
- 🛡️ Security with Helmet and CORS
- 📊 PostgreSQL database with Prisma ORM

## Tech Stack

- **Runtime:** Node.js (LTS)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- npm >= 9.0.0

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/psychoworkbook?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. Run Prisma migrations:

```bash
npm run prisma:migrate
```

5. Generate Prisma client:

```bash
npm run prisma:generate
```

6. Seed the database with sample data:

```bash
npm run prisma:seed
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3001`

### Production

1. Build the TypeScript code:

```bash
npm run build
```

2. Run database migrations:

```bash
npm run prisma:migrate:prod
```

3. Start the production server:

```bash
npm start
```

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Modules

#### Get All Modules
```http
GET /api/modules
Authorization: Bearer <token>
```

#### Get Module by ID
```http
GET /api/modules/:id
Authorization: Bearer <token>
```

### Tasks

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

### Attempts

#### Create Attempt
```http
POST /api/attempts
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "uuid",
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T10:05:00Z",
  "response": {
    "trials": [
      { "userInput": [3, 7, 2], "correct": true }
    ]
  }
}
```

#### Get Latest Attempts
```http
GET /api/attempts/my-latest?limit=10
Authorization: Bearer <token>
```

#### Get Attempt Summary
```http
GET /api/attempts/my-summary
Authorization: Bearer <token>
```

### Reflections

#### Create Reflection
```http
POST /api/reflections
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "My reflection on today's tasks...",
  "tags": ["working_memory", "improvement"]
}
```

#### Get My Reflections
```http
GET /api/reflections/my?limit=50&offset=0
Authorization: Bearer <token>
```

### Progress

#### Get My Progress
```http
GET /api/progress/my
Authorization: Bearer <token>
```

#### Get Module Progress
```http
GET /api/progress/module/:moduleId
Authorization: Bearer <token>
```

## Scoring Logic

The backend automatically calculates scores based on task types:

### Working Memory Tasks
- **Digit Span:** Exact sequence matching, accuracy calculated as correct/total
- **Reading Span:** Word recall accuracy

### Processing Speed Tasks
- **Lexical Decision:** Correct responses with average reaction time
- **Sentence Verification:** True/false accuracy with reaction time

### Noticing Tasks
- **Form-Meaning Mapping:** Correct mappings percentage
- **Error Correction:** Accurate corrections percentage

### Reflection Tasks
- No numerical score (score = 0)

## Database Schema

Key models:
- `User` - User accounts with authentication
- `Module` - Learning modules (Working Memory, Processing Speed, etc.)
- `Task` - Individual tasks within modules
- `Attempt` - User task attempts with scores
- `Reflection` - User reflection entries

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:migrate:prod` - Run production migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with sample data
- `npm run lint` - Run ESLint

## Demo Account

After seeding, a demo account is available:
- **Email:** demo@example.com
- **Password:** password123

## Security Best Practices

- ✅ JWT tokens with configurable expiration
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ SQL injection protection via Prisma
- ✅ Environment variable validation

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET` (min 32 characters)
3. Configure proper database credentials
4. Set appropriate `CORS_ORIGIN`
5. Use HTTPS in production
6. Set up database backups
7. Configure logging and monitoring
8. Use a process manager (PM2, systemd)

## Task Types

The backend supports 8 distinct task types with 3 difficulty levels each (24 total tasks):

### Working Memory Module
1. **Digit Span** - Remember sequences of 2-8 digits
2. **Reading Span** - Recall words while processing sentences

### Processing Speed Module
3. **Lexical Decision** - Identify real vs. pseudo-words rapidly
4. **Sentence Verification** - Judge sentence correctness quickly

### Noticing Module
5. **Form-Meaning Mapping** - Match grammatical forms to meanings
6. **Error Correction** - Identify and correct grammatical errors

### Reflective Practice Module
7. **Guided Reflection** - Respond to specific prompts
8. **Free Reflection** - Open-ended journaling (100-300 words)

## Educational Context

This tool aligns with key psycholinguistic theories:
- **Working Memory Models** (Baddeley & Hitch)
- **Processing Speed Theory** in L2 acquisition
- **Schmidt's Noticing Hypothesis**
- **Metacognitive Awareness** in language learning

Ideal for:
- Master's students in TESOL/Applied Linguistics
- Psycholinguistics coursework
- Research on cognitive aspects of language learning
- Self-paced learning and assessment

## Author

**Bondan Charisnanda**  
Master's degree student in English Language Teaching

## License

MIT
