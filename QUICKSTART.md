# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18 or higher installed
- ✅ PostgreSQL installed and running
- ✅ npm v9 or higher

## Option 1: Automated Setup (Recommended)

Run the setup script:

```powershell
.\setup.ps1
```

This will:
1. Install dependencies
2. Create .env file
3. Generate Prisma client
4. Run database migrations
5. Optionally seed the database

## Option 2: Manual Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and configure:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/psychoworkbook?schema=public"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
PORT=3001
NODE_ENV=development
```

### Step 3: Setup Database

1. Create PostgreSQL database:
```sql
CREATE DATABASE psychoworkbook;
```

2. Generate Prisma client:
```bash
npm run prisma:generate
```

3. Run migrations:
```bash
npm run prisma:migrate
```

4. (Optional) Seed with sample data:
```bash
npm run prisma:seed
```

### Step 4: Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:3001`

## Verify Installation

1. Check health endpoint:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

2. Test with demo account (if seeded):
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

## Using Docker (Alternative)

If you prefer Docker:

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec api npx prisma migrate deploy

# Seed database
docker-compose exec api npm run prisma:seed

# View logs
docker-compose logs -f api
```

## Common Issues

### Issue: "Cannot find module '@prisma/client'"
**Solution:** Run `npm run prisma:generate`

### Issue: "P1001: Can't reach database server"
**Solution:** 
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### Issue: Port 3001 already in use
**Solution:** Change PORT in .env or kill process using port 3001

### Issue: JWT errors
**Solution:** Ensure JWT_SECRET is at least 32 characters in .env

## Next Steps

1. **Read the Documentation:**
   - `README.md` - Full documentation
   - `API_EXAMPLES.md` - API usage examples
   - `DEPLOYMENT.md` - Production deployment guide

2. **Test the API:**
   - Use Postman, Insomnia, or curl
   - Try the demo account
   - Explore all endpoints

3. **Customize:**
   - Add more tasks in `prisma/seed.ts`
   - Modify scoring logic in `src/services/scoring.service.ts`
   - Add custom validation rules

4. **Develop Frontend:**
   - Connect your frontend to `http://localhost:3001`
   - Use JWT tokens for authentication
   - Follow API documentation

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── config/            # Configuration
│   ├── controllers/       # Request handlers
│   ├── db/                # Database client
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utilities
│   ├── validators/        # Input validation
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── .env                   # Environment variables
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## Support

If you encounter issues:
1. Check the logs in the terminal
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check that all dependencies are installed
5. Review the error messages carefully

## Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Database created
- [ ] Prisma client generated
- [ ] Migrations run successfully
- [ ] (Optional) Database seeded
- [ ] Dev server starts without errors
- [ ] Health endpoint responds
- [ ] Can register/login users
- [ ] Protected routes work with JWT

Once all items are checked, you're ready to develop! 🚀
