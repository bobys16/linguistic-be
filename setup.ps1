# Setup Script for Psycholinguistics Workbook Backend

Write-Host "🚀 Setting up Psycholinguistics Workbook Backend..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js $nodeVersion detected" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js >= 18.0.0" -ForegroundColor Red
    exit 1
}

# Check npm version
Write-Host "Checking npm version..." -ForegroundColor Yellow
$npmVersion = npm --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ npm $npmVersion detected" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please edit .env file with your configuration!" -ForegroundColor Yellow
    Write-Host "   - Set your PostgreSQL DATABASE_URL" -ForegroundColor Yellow
    Write-Host "   - Set a secure JWT_SECRET" -ForegroundColor Yellow
    Write-Host ""
    
    $continueSetup = Read-Host "Have you configured the .env file? (y/n)"
    if ($continueSetup -ne "y") {
        Write-Host "Please configure .env and run this script again" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host ""

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Yellow
$migrationOutput = npm run prisma:migrate 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to run migrations" -ForegroundColor Red
    Write-Host "Error: $migrationOutput" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "  - PostgreSQL is running" -ForegroundColor Yellow
    Write-Host "  - DATABASE_URL in .env is correct" -ForegroundColor Yellow
    Write-Host "  - Database exists and is accessible" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Database migrations completed" -ForegroundColor Green
Write-Host ""

# Seed database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
$seedChoice = Read-Host "Do you want to seed the database with sample data? (y/n)"
if ($seedChoice -eq "y") {
    npm run prisma:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database seeded successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "Demo account created:" -ForegroundColor Cyan
        Write-Host "  Email: demo@example.com" -ForegroundColor Cyan
        Write-Host "  Password: password123" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Seeding failed, but setup can continue" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review your .env configuration" -ForegroundColor White
Write-Host "  2. Start development server: npm run dev" -ForegroundColor White
Write-Host "  3. Visit http://localhost:3001/health to verify" -ForegroundColor White
Write-Host "  4. Check README.md for API documentation" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Cyan
