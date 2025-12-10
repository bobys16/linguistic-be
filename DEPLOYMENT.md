# Production Deployment Checklist

## Pre-Deployment

### Environment Configuration
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET` (min 32 characters)
- [ ] Configure production database URL
- [ ] Set correct `CORS_ORIGIN` for your frontend
- [ ] Review and set appropriate `JWT_EXPIRES_IN`

### Security Review
- [ ] All passwords are hashed with bcrypt
- [ ] JWT secrets are not committed to version control
- [ ] CORS is properly configured
- [ ] Rate limiting is configured (if needed)
- [ ] Input validation is in place
- [ ] SQL injection protection via Prisma

### Database
- [ ] Production database is created
- [ ] Run migrations: `npm run prisma:migrate:prod`
- [ ] Generate Prisma client: `npm run prisma:generate`
- [ ] (Optional) Seed initial data: `npm run prisma:seed`
- [ ] Database backups are configured
- [ ] Connection pooling is optimized

### Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] All TypeScript errors resolved
- [ ] Environment variables are validated

## Deployment Options

### Option 1: VPS/Cloud Server (Digital Ocean, AWS EC2, etc.)

1. Install Node.js and PostgreSQL
2. Clone repository
3. Install dependencies: `npm install --production`
4. Create `.env` file with production variables
5. Build: `npm run build`
6. Run migrations: `npm run prisma:migrate:prod`
7. Start with PM2:
```bash
npm install -g pm2
pm2 start dist/server.js --name psychoworkbook-api
pm2 save
pm2 startup
```

### Option 2: Docker

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

2. Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/psychoworkbook
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=psychoworkbook
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 3: Platform as a Service (Heroku, Railway, Render)

These platforms typically auto-detect Node.js and handle deployment.

**Key configurations:**
- Build command: `npm run build && npm run prisma:generate`
- Start command: `npm start`
- Add PostgreSQL addon
- Set environment variables in platform dashboard

## Post-Deployment

### Verification
- [ ] Health check endpoint responds: `GET /health`
- [ ] Can register new user
- [ ] Can login and receive JWT
- [ ] Protected routes require authentication
- [ ] Database queries work correctly
- [ ] CORS allows frontend requests

### Monitoring
- [ ] Set up application monitoring (e.g., PM2, New Relic)
- [ ] Configure error logging
- [ ] Set up database monitoring
- [ ] Configure uptime monitoring
- [ ] Set up alerts for errors/downtime

### Performance
- [ ] Enable gzip compression
- [ ] Configure database connection pooling
- [ ] Set appropriate request timeouts
- [ ] Consider caching strategies
- [ ] Load testing completed

### Backup & Recovery
- [ ] Automated database backups configured
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

## Environment Variables Reference

```env
# Required
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-very-long-and-secure-secret-key-here
NODE_ENV=production

# Optional with defaults
PORT=3001
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

## Nginx Configuration (Optional)

If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/TLS Configuration

Use Let's Encrypt for free SSL certificates:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Scaling Considerations

- Use load balancer for multiple instances
- Configure session management for distributed systems
- Consider Redis for caching and session storage
- Database read replicas for scaling reads
- CDN for static assets

## Maintenance

- Regular dependency updates: `npm audit`
- Database optimization and indexing
- Log rotation configuration
- Regular security audits
- Performance monitoring and optimization
