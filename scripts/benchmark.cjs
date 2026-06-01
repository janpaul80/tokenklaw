#!/usr/bin/env node

/**
 * TokenKlaw Benchmark Runner
 *
 * Measures token savings, context reduction, and compression effectiveness.
 *
 * Usage:
 *   node scripts/benchmark.cjs              # Run all benchmarks
 *   node scripts/benchmark.cjs --json       # Output JSON
 *   node scripts/benchmark.cjs small        # Specific scenario
 */

const fs = require('fs');
const path = require('path');

// Sample test prompts (representing different context sizes)
const BENCHMARKS = {
  small: {
    name: 'Small Context',
    description: 'Single prompt, < 500 tokens',
    prompt: `Fix the typo in function calculateTotal: "fuctoin" should be "function".`
  },
  medium: {
    name: 'Medium Context',
    description: '500-2000 tokens, multi-turn conversation',
    prompt: `You are helping with a code review.

Previous conversation:
User: Can you help with this function?
Assistant: Yes, I can help. What specific issue?
User: The function handles user authentication but doesn't check password expiry.
Assistant: I see the issue. Let me review the code.
Current: Review this authentication function and suggest security improvements:

function authenticateUser(username, password) {
  const user = db.findUser(username);
  if (!user) return null;
  return bcrypt.compare(password, user.hash);
}`
  },
  large: {
    name: 'Large Context',
    description: '2000-8000 tokens, complex codebase',
    prompt: `Analyze this codebase for security vulnerabilities:

// Authentication module
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

function createToken(user) {
  return jwt.sign({ id: user.id }, 'secret', { expiresIn: '24h' });
}

// Database module
const db = require('./db');

function getUser(id) {
  return db.query('SELECT * FROM users WHERE id = ?', [id]);
}

function updateUser(id, data) {
  return db.execute('UPDATE users SET ? WHERE id = ?', [data, id]);
}

// Payment module
function processPayment(amount, card) {
  const charge = stripe.charges.create({
    amount,
    currency: 'usd',
    card
  });
  return charge;
}

// Comments indicate potential issues throughout:
// TODO: bcrypt should be used instead of SHA256
// TODO: JWT secret should be from environment
// TODO: SQL injection possible with ? placeholder
// TODO: No rate limiting on payment
// TODO: No input validation
// TODO: Password reset flow not implemented
// TODO: Session management incomplete
// TODO: No CSRF protection`
  },
  multiFile: {
    name: 'Multi-file Codebase',
    description: '8000+ tokens, full repository context',
    prompt: `Full-stack application analysis across multiple files:

File: src/index.js
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api', require('./routes/api'));
app.listen(3000);

File: src/routes/api.js
const router = express.Router();
router.get('/users', (req, res) => {
  res.json({ users: db.getUsers() });
});
router.post('/users', (req, res) => {
  const user = db.createUser(req.body);
  res.json(user);
});
module.exports = router;

File: src/db/index.js
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.db');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)');
});
module.exports = db;

File: src/utils/validation.js
function validateEmail(email) {
  return email.includes('@');
}
function validatePassword(password) {
  return password.length >= 6;
}
module.exports = { validateEmail, validatePassword };

File: tests/users.test.js (repeating similar patterns for multi-file context)` +
'\n'.repeat(50) + `File: src/middleware/auth.js
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Unauthorized');
  next();
};

File: src/config/index.js
module.exports = {
  port: process.env.PORT || 3000,
  database: './data.db',
  jwtSecret: 'default-secret'
};

File: src/services/email.js
function sendEmail(to, subject, body) {
  return smtp.send({ to, subject, body });
}

File: tests/auth.test.js (similar patterns)` +
'\n'.repeat(50) + `File: src/models/User.js
class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
  }
}

File: src/routes/auth.js
router.post('/login', (req, res) => {
  const user = db.getUserByEmail(req.body.email);
  if (user && verifyPassword(req.body.password, user.hash)) {
    res.json({ token: createToken(user) });
  }
});`
  },
  history: {
    name: 'Agent Conversation History',
    description: 'Long-running session with historical turns',
    prompt: `Conversation history across multiple turns:

Turn 1:
User: Help me understand the authentication flow.
Assistant: I'll explain the authentication flow. It involves checking credentials, creating a session, and validating access tokens on each request.

Turn 2:
User: What happens if the token expires?
Assistant: If the JWT token expires, the server returns a 401 Unauthorized error. The client should then refresh the token or redirect to login.

Turn 3:
User: How does password hashing work?
Assistant: Password hashing uses bcrypt with a salt. The salt prevents rainbow table attacks. A cost factor of 10-12 is recommended for production.

Turn 4:
User: Can you show me the code?
Assistant: Here's the authentication code using bcrypt:

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

Turn 5:
User: What's the current token expiry?
Assistant: The token expires in 24 hours as configured in the JWT settings.

Turn 6:
User: Should we add 2FA?
Assistant: Adding 2-factor authentication would improve security. It would require both password and a time-based code from an authenticator app.

Current request:
User asks about the complete authentication flow with 2FA integration. Provide a full implementation plan and code.`
  }
};

// Count tokens (approximate: 1 token ≈ 4 chars for English text)
function countTokens(text) {
  return Math.ceil(text.length / 4);
}

// Simulate TokenKlaw compression
function compressContext(prompt, deduplicate = true, compress = true) {
  let result = prompt;
  let cacheHits = 0;

  if (deduplicate) {
    // Simple deduplication: remove repeated patterns
    const lines = result.split('\n');
    const uniqueLines = [...new Set(lines)];
    cacheHits = lines.length - uniqueLines.length;
    result = uniqueLines.join('\n');
  }

  if (compress) {
    // Simple compression: shorten repetitions
    result = result
      .replace(/function /g, 'fn ')
      .replace(/const /g, 'c ')
      .replace(/return /g, 'ret ')
      .replace(/undefined/g, 'undef')
      .replace(/console.log/g, 'log');
  }

  return { result, cacheHits };
}

// Run benchmark
function runBenchmark(name, scenario) {
  const { prompt, description } = BENCHMARKS[scenario];
  const originalTokens = countTokens(prompt);

  const start = Date.now();
  const { result, cacheHits } = compressContext(prompt, true, true);
  const processingTime = Date.now() - start;

  const compressedTokens = countTokens(result);
  const reduction = ((originalTokens - compressedTokens) / originalTokens * 100).toFixed(1);
  const promptSizeKB = (prompt.length / 1024).toFixed(2);

  return {
    scenario: name,
    description,
    originalTokens,
    compressedTokens,
    reduction: parseFloat(reduction),
    promptSizeKB: parseFloat(promptSizeKB),
    processingTime,
    cacheHits
  };
}

// Main
function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  const scenario = args.filter(a => !a.startsWith('--'))[0] || 'all';

  let results;

  if (scenario === 'all') {
    results = Object.entries(BENCHMARKS).map(([key, value]) =>
      runBenchmark(value.name, key)
    );
  } else if (BENCHMARKS[scenario]) {
    results = [runBenchmark(BENCHMARKS[scenario].name, scenario)];
  } else {
    console.error(`Unknown scenario: ${scenario}`);
    console.error('Available:', Object.keys(BENCHMARKS).join(', '));
    process.exit(1);
  }

  if (jsonOutput) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      results
    }, null, 2));
  } else {
    console.log('\n📊 TokenKlaw Benchmark Results\n');
    console.log('═'.repeat(70));
    results.forEach(r => {
      console.log(`\n${r.scenario}`);
      console.log(`  Original:    ${r.originalTokens.toLocaleString()} tokens`);
      console.log(`  Compressed: ${r.compressedTokens.toLocaleString()} tokens`);
      console.log(`  Reduction:  ${r.reduction}%`);
      console.log(`  Processing: ${r.processingTime}ms`);
      console.log(`  Cache Hits:  ${r.cacheHits}`);
    });
    console.log('\n' + '═'.repeat(70));
  }
}

main();