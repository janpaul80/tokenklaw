#!/usr/bin/env node

/**
 * TokenKlaw Token Distribution Analysis
 * Realistic workload prompts with actual code.
 */

const WORKLOADS = {
  bugfix: {
    name: 'Bug Fix',
    prompt: `// UserProfile.jsx - crashes when user is null
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUser } from '../api/users';
import { Spinner } from './Spinner';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(id)
      .then(data => { setUser(data); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  // BUG: user is null here on deleted accounts
  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.bio}</p>
    </div>
  );
}

// Error:
// TypeError: Cannot read property 'name' of null
// at UserProfile.render (UserProfile.jsx:45)`
  },

  refactor: {
    name: 'Code Refactor',
    prompt: `// lib/db.js - creates new connection per query
const { Client } = require('pg');

async function query(sql, params) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  const result = await client.query(sql, params);
  await client.end();
  return result;
}

module.exports = { query };

// Alternative with pooling:
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000
});

async function poolQuery(sql, params) {
  return pool.query(sql, params);
}

// models/user.js - uses old query function
const db = require('../lib/db');

async function getUser(id) {
  return db.query('SELECT * FROM users WHERE id = $1', [id]);
}

async function createUser(data) {
  return db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [data.name, data.email]
  );
}

async function updateUser(id, data) {
  return db.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [data.name, data.email, id]
  );
}

async function deleteUser(id) {
  return db.query('DELETE FROM users WHERE id = $1', [id]);
}`
  },

  multiFile: {
    name: 'Multi-File Edit',
    prompt: `// styles/global.css
:root {
  --primary: #0066ff;
  --secondary: #00cc66;
  --danger: #ff3333;
  --radius: 4px;
  --shadow: 0 2px 4px rgba(0,0,0,0.1);
}

// components/Button.jsx
import React from 'react';
import './button.css';

export function Button({ children, variant = 'primary', onClick }) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// button.css
.btn {
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}
.btn-primary { background: var(--primary); }
.btn-secondary { background: var(--secondary); }
.btn-danger { background: var(--danger); }

// components/Card.jsx
import React from 'react';
import './card.css';

export function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// card.css
.card {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
}

// Same pattern: 10 files with identical imports and styles
// Button.jsx, Card.jsx, Modal.jsx, Input.jsx, Form.jsx
// Table.jsx, Nav.jsx, Header.jsx, Footer.jsx, Sidebar.jsx`,
  },

  api: {
    name: 'API Handler',
    prompt: `// routes/users.js
const express = require('express');
const router = express.Router();
const userService = require('../services/user');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

router.get('/', auth, async (req, res) => {
  const users = await userService.list(req.query);
  res.json(users);
});

router.get('/:id', auth, async (req, res) => {
  const user = await userService.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.post('/', auth, validate(userSchema), async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json(user);
});

router.put('/:id', auth, async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  res.json(user);
});

router.delete('/:id', auth, async (req, res) => {
  await userService.delete(req.params.id);
  res.status(204).send();
});

// routes/orders.js - identical pattern
const express = require('express');
const router = express.Router();
const orderService = require('../services/order');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

router.get('/', auth, async (req, res) => {
  const orders = await orderService.list(req.query);
  res.json(orders);
});

router.get('/:id', auth, async (req, res) => {
  const order = await orderService.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

router.post('/', auth, validate(orderSchema), async (req, res) => {
  const order = await orderService.create(req.body);
  res.status(201).json(order);
});

// 6 more route files with exact same boilerplate`,
  },

  test: {
    name: 'Test File',
    prompt: `// tests/unit/user.test.js
const { describe, it, expect, beforeEach } = require('@jest/globals');
const { UserService } = require('../../services/user');
const { db } = require('../../lib/db');

describe('UserService', () => {
  beforeEach(async () => {
    await db.query('DELETE FROM users');
  });

  it('should create a user', async () => {
    const user = await UserService.create({
      name: 'John',
      email: 'john@test.com'
    });
    expect(user.name).toBe('John');
    expect(user.email).toBe('john@test.com');
  });

  it('should get user by id', async () => {
    const created = await UserService.create({ name: 'John', email: 'j@t.com' });
    const user = await UserService.get(created.id);
    expect(user.id).toBe(created.id);
  });

  it('should update user', async () => {
    const created = await UserService.create({ name: 'John', email: 'j@t.com' });
    const updated = await UserService.update(created.id, { name: 'Jane' });
    expect(updated.name).toBe('Jane');
  });

  it('should delete user', async () => {
    const created = await UserService.create({ name: 'John', email: 'j@t.com' });
    await UserService.delete(created.id);
    const user = await UserService.get(created.id);
    expect(user).toBeNull();
  });

  it('should list users with filters', async () => {
    await UserService.create({ name: 'John', email: 'j@t.com' });
    await UserService.create({ name: 'Jane', email: 'jane@t.com' });
    const users = await UserService.list({ limit: 10 });
    expect(users.length).toBe(2);
  });

  it('should validate email format', async () => {
    await expect(UserService.create({ name: 'John', email: 'invalid' }))
      .rejects.toThrow('Invalid email');
  });
});

// tests/integration/user-api.test.js
// tests/integration/order-api.test.js
// tests/e2e/auth.test.js
// Tests all follow identical structure`,
  },

  import: {
    name: 'Import Heavy',
    prompt: `// React components with heavy import duplication
// auth/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import { Input } from './Input';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import { Spinner } from './Spinner';
import './auth.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authLogin(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../api/auth';
import { Input } from './Input';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import { Spinner } from './Spinner';
import './auth.css';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authRegister(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// 15 components with identical imports`,
  },

  config: {
    name: 'Config Files',
    prompt: `// database/schema.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Same schema pattern repeated with minor variations
-- 20 table definitions with identical structure`,
  },

  conversation: {
    name: 'Conversation History',
    prompt: `// TokenKlaw Session: React Performance Issues
// Turn 1: User reports slow renders
> Why is my React app slow?
< The cause is likely unnecessary re-renders. Use React DevTools Profiler to identify.
> How do I use it?
< Install React DevTools browser extension, start profiling, interact with app.
// Turn 2: User asks about memo
> Should I use memo?
< Use memo() for expensive computations, not for every component. Premature optimization hurts.
// Turn 3: User asks about useCallback
> What about useCallback?
< useCallback prevents function recreation on every render. Use for event handlers passed to memoized children.
// Turn 4: User shows code
> Is this correct?
< React.memo(() => {
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  return <Child onClick={handleClick} />;
}, []) - missing dependency in useCallback.
// Turn 5: User asks about context
> Does context cause re-renders?
< Yes, any context change re-renders all consuming components. Split contexts or use selectors.
// Previous advice summary:
// - React DevTools for profiling
// - memo() for expensive components
// - useCallback() for stable references
// - Split contexts to prevent cascades
// Current: Performance optimization in progress`,
  },

  stacktrace: {
    name: 'Stack Trace',
    prompt: `// Error: TypeError: Cannot read property 'map' of undefined
// Stack trace:
TypeError: Cannot read property 'map' of undefined
    at OrderList.render (OrderList.jsx:45)
    at OrderList (OrderList.jsx:12)
    at renderWithHooks (react-dom.development.js:14985)
    at mountIndeterminateComponent (react-dom.development.js:17811)
    at beginWork (react-dom.development.js:19049)
    at performUnitOfWork (react-dom.development.js:22802)
    at workLoopSync (react-dom.development.js:22761)
    at renderRootSync (react-dom.development.js:22725)
    at performSyncWorkOnRoot (react-dom.development.js:22496)
    at scheduleSyncWork (react-dom.development.js:20921)
    at performSyncWorkOnRoot (react-dom.development.js:22469)
    at unstable_runWithPriority (scheduler.development.js:641)
    at flushSyncCallbackQueueImpl (react-dom.development.js:22459)
    at flushSyncCallbackQueue (react-dom.development.js:22431)
    at flushSync (react-dom.development.js:22314)

// OrderList.jsx:45
return (
  <div>
    {order.items.map(item => (  // <-- order.items is undefined
      <OrderItem key={item.id} item={item} />
    ))}
  </div>
);

// Related errors in codebase:
// - Dashboard.jsx:45: user.posts.map is not a function
// - ProductList.jsx:67: products.filter is not a function
// - CartSummary.jsx:34: cart.items.map is not a function
// - ProfileSettings.jsx:78: user.permissions.includes is not a function`,
  }
};

// Token counting utilities
function countTokens(text) {
  return Math.ceil(text.length / 4);
}

function analyzePrompt(prompt) {
  const lines = prompt.split('\n');
  const totalChars = prompt.length;
  const totalTokens = countTokens(prompt);

  let codeLines = 0;
  let proseLines = 0;
  let importLines = 0;
  let commentLines = 0;
  let blankLines = 0;
  let stackTraceLines = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) blankLines++;
    else if (trimmed.match(/^at\s+.+\(/)) stackTraceLines++;
    else if (trimmed.match(/^import\s+/) || trimmed.match(/^const\s+\w+\s+=\s+require/)) importLines++;
    else if (trimmed.match(/^\/\//) || trimmed.match(/^\/\*/)) commentLines++;
    else if (trimmed.match(/^(const|let|var|function|class|return|if|for|while|async|export|import|from)/) || trimmed.match(/=>/) || trimmed.match(/<\/?[A-Z]/)) codeLines++;
    else proseLines++;
  }

  // Repetition analysis
  const lineCounts = new Map();
  for (const line of lines) {
    const key = line.trim();
    if (key.length > 15) lineCounts.set(key, (lineCounts.get(key) || 0) + 1);
  }
  const repeated = Array.from(lineCounts.entries()).filter(([_, c]) => c > 1);

  return {
    totalChars, totalTokens, lines: lines.length,
    codeLines, proseLines, importLines, commentLines, blankLines, stackTraceLines,
    repeatedLines: repeated.slice(0, 5),
    repeatedChars: repeated.reduce((sum, [k, c]) => sum + k.length * (c - 1), 0)
  };
}

function main() {
  console.log('\nTokenKlaw Token Distribution Analysis\n' + '='.repeat(50));

  const results = [];
  let totals = { tokens: 0, code: 0, prose: 0, imports: 0, comments: 0, traces: 0, repeated: 0 };

  for (const [key, w] of Object.entries(WORKLOADS)) {
    const a = analyzePrompt(w.prompt);
    a.name = w.name;
    results.push(a);
    totals.tokens += a.totalTokens;
    totals.code += a.codeLines;
    totals.prose += a.proseLines;
    totals.imports += a.importLines;
    totals.comments += a.commentLines;
    totals.traces += a.stackTraceLines;
    totals.repeated += a.repeatedChars;

    console.log(`\n${w.name}:`);
    console.log(`  Tokens: ${a.totalTokens}, Code: ${a.codeLines}, Prose: ${a.proseLines}, Imports: ${a.importLines}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\nTotal: ${totals.tokens} tokens`);
  console.log(`Code: ${totals.code} (${(totals.code/(totals.code+totals.prose)*100).toFixed(1)}%)`);
  console.log(`Prose: ${totals.prose} (${(totals.prose/(totals.code+totals.prose)*100).toFixed(1)}%)`);
  console.log(`Imports: ${totals.imports}`);
  console.log(`Repeated chars: ${totals.repeated}`);

  // Generate markdown
  const md = `# Token Distribution Analysis

**Date:** ${new Date().toISOString().split('T')[0]}
**Purpose:** Identify where tokens are consumed to guide compression.

---

## Summary

| Category | Count | % Total |
|-----------|-------|--------|
| Code lines | ${totals.code} | ${(totals.code/(totals.code+totals.prose)*100).toFixed(1)}% |
| Prose lines | ${totals.prose} | ${(totals.prose/(totals.code+totals.prose)*100).toFixed(1)}% |
| Imports | ${totals.imports} | - |
| Comments | ${totals.comments} | - |
| Stack traces | ${totals.traces} | - |
| Repeated content | ${totals.repeated} chars | - |

---

## Per-Workload

| Workload | Tokens | Code | Prose | Imports | Repeated |
|---------|--------|------|------|--------|----------|
${results.map(r => `| ${r.name} | ${r.totalTokens} | ${r.codeLines} | ${r.proseLines} | ${r.importLines} | ${r.repeatedChars} |`).join('\n')}

---

## Where Tokens Are

### 1. Code (${(totals.code/(totals.code+totals.prose)*100).toFixed(1)}%)
- Function definitions, imports, JSX, CSS
- **Target:** Code pattern deduplication

### 2. Prose (${(totals.prose/(totals.code+totals.prose)*100).toFixed(1)}%)
- Explanations, requirements, questions
- **Target:** Conversation summarization

### 3. Imports (${totals.imports})
- Duplicate import statements
- **Target:** Import compression

### 4. Repeated Content (${totals.repeated} chars)
- Boilerplate across files
- **Target:** Template deduplication

---

## Compression Priority

| Priority | Strategy | Potential |
|----------|----------|----------|
| 1 | Code pattern deduplication | HIGH |
| 2 | Import compression | MEDIUM |
| 3 | Template extraction | MEDIUM |
| 4 | Conversation compression | LOW |

---

*Generated: ${new Date().toISOString().split('T')[0]}*`;

  require('fs').writeFileSync('docs/TOKEN-DISTRIBUTION-ANALYSIS.md', md);
  console.log('\nGenerated: docs/TOKEN-DISTRIBUTION-ANALYSIS.md');
}

main();