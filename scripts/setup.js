#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Expense Tracker...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local from example...');
  const envExample = fs.readFileSync(path.join(process.cwd(), 'env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ .env.local created. Please update it with your configuration.\n');
} else {
  console.log('✅ .env.local already exists.\n');
}

// Generate Prisma client
try {
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated.\n');
} catch (error) {
  console.log('❌ Failed to generate Prisma client. Please run "npx prisma generate" manually.\n');
}

console.log('🎉 Setup complete! Next steps:');
console.log('1. Update your .env.local file with your database and OAuth credentials');
console.log('2. Run "npx prisma db push" to set up your database');
console.log('3. Run "pnpm dev" to start the development server');
console.log('\nFor more information, check the README.md file.');
