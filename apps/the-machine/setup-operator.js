/**
 * THE MACHINE - Operator Setup Script
 * Run this to create your first operator account
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create .wrangler directory if it doesn't exist
const wranglerDir = join(__dirname, '.wrangler');
const stateDir = join(wranglerDir, 'state', 'v3');

if (!existsSync(stateDir)) {
  mkdirSync(stateDir, { recursive: true });
}

// Create database
const dbPath = join(stateDir, 'the-machine.sqlite');
const db = new Database(dbPath);

console.log('📦 Creating THE MACHINE database...');
console.log('📍 Location:', dbPath);
console.log('');

// Read schema
import { readFileSync } from 'fs';
const schema = readFileSync(join(__dirname, 'database', 'schema-v2.sql'), 'utf-8');

// Execute schema
const statements = schema.split(';').filter(s => s.trim());
for (const statement of statements) {
  if (statement.trim()) {
    try {
      db.exec(statement);
    } catch (err) {
      // Ignore table exists errors
      if (!err.message.includes('already exists')) {
        console.error('Error:', err.message);
      }
    }
  }
}

console.log('✅ Database schema created');
console.log('');

// Create default operator
const operatorId = 'op-admin-001';
const operatorName = 'Admin Operator';
const operatorEmail = 'admin@machine.local';
const role = 'admin';

try {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO operators (id, name, email, role, is_active)
    VALUES (?, ?, ?, ?, 1)
  `);

  insert.run(operatorId, operatorName, operatorEmail, role);

  console.log('✅ Default operator created!');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  YOUR LOGIN CREDENTIALS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  Email:    admin@machine.local');
  console.log('  Password: (any password works in dev mode)');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('🚀 Ready! Start the server with:');
  console.log('   npm run dev');
  console.log('');
  console.log('🌐 Then visit:');
  console.log('   http://localhost:4200/login');
  console.log('');

} catch (err) {
  console.error('❌ Error creating operator:', err.message);
  process.exit(1);
}

db.close();
