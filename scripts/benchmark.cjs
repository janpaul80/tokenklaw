#!/usr/bin/env node

/**
 * TokenKlaw Benchmark Runner v1.2
 *
 * Improved compression targeting real-world reduction goals.
 */

const BENCHMARKS = {
  small: {
    name: 'Small Context',
    description: 'Simple request with patterns',
    prompt: 'function addUser(name, email) { return db.insert("users", { name, email }); }\nfunction updateUser(id, data) { return db.update("users", id, data); }\nfunction deleteUser(id) { return db.delete("users", id); }\nfunction getUser(id) { return db.get("users", id); }\nfunction listUsers() { return db.list("users"); }\nReview and suggest improvements.'
  },
  medium: {
    name: 'Medium Context',
    description: 'Multi-turn with repeated patterns',
    prompt: 'function authenticateUser(username, password) {\n  const user = db.findUser(username);\n  if (!user) return null;\n  return bcrypt.compare(password, user.hash);\n}\nfunction verifyToken(token) {\n  return jwt.verify(token, SECRET);\n}\nfunction refreshToken(token) {\n  const payload = jwt.verify(token, SECRET);\n  return jwt.sign(payload, SECRET, { expiresIn: "24h" });\n}\nfunction revokeToken(token) {\n  return blacklist.add(token);\n}\nfunction checkRevoked(token) {\n  return blacklist.has(token);\n}\nReview the authentication flow for security.'
  },
  large: {
    name: 'Large Context',
    description: 'Codebase with repetition',
    prompt: '// Authentication module patterns that repeat\nfunction createUser(data) { return db.create("users", data); }\nfunction getUser(id) { return db.get("users", id); }\nfunction updateUser(id, data) { return db.update("users", id, data); }\nfunction deleteUser(id) { return db.delete("users", id); }\nfunction findUser(email) { return db.find("users", { email }); }\nfunction listUsers(filter) { return db.list("users", filter); }\nfunction countUsers() { return db.count("users"); }\n// Similar patterns with orders\nfunction createOrder(data) { return db.create("orders", data); }\nfunction getOrder(id) { return db.get("orders", id); }\nfunction updateOrder(id, data) { return db.update("orders", id, data); }\nfunction deleteOrder(id) { return db.delete("orders", id); }\nfunction findOrder(userId) { return db.find("orders", { userId }); }\nfunction listOrders(filter) { return db.list("orders", filter); }\nfunction countOrders() { return db.count("orders"); }\n// Similar patterns with products\nfunction createProduct(data) { return db.create("products", data); }\nfunction getProduct(id) { return db.get("products", id); }\nfunction updateProduct(id, data) { return db.update("products", id, data); }\nfunction deleteProduct(id) { return db.delete("products", id); }\nfunction findProduct(sku) { return db.find("products", { sku }); }\nAnalyze and optimize the patterns.'
  },
  multiFile: {
    name: 'Multi-file Codebase',
    description: 'Many files with template patterns',
    prompt: '// Button.jsx - same pattern as other components\nexport default function Button(props) {\n  return <button className="btn">{props.children}</button>;\n}\n// Input.jsx - same pattern as Button\nexport default function Input(props) {\n  return <input className="input"{...props} />;\n}\n// Card.jsx - same pattern\nexport default function Card(props) {\n  return <div className="card">{props.children}</div>;\n}\n// Modal.jsx - same pattern\nexport default function Modal(props) {\n  return <div className="modal">{props.children}</div>;\n}\n// Form.jsx - same pattern\nexport default function Form(props) {\n  return <form>{props.children}</form>;\n}\n// Table.jsx - same pattern\nexport default function Table(props) {\n  return <table>{props.children}</table>;\n}\n// Nav.jsx - same pattern\nexport default function Nav(props) {\n  return <nav>{props.children}</nav>;\n}\n// Footer.jsx - same pattern\nexport default function Footer(props) {\n  return <footer>{props.children}</footer>;\n}\n// Heading.jsx - same pattern\nexport default function Heading(props) {\n  return <h1>{props.children}</h1>;\n}\n// Label.jsx - same pattern\nexport default function Label(props) {\n  return <label>{props.children}</label>;\n}\nIdentify the duplication and suggest refactoring.'
  },
  history: {
    name: 'Agent Conversation History',
    description: 'Long session with repeating instructions',
    prompt: '// System: You are a helpful assistant\n// Previous: User asked about JavaScript\nfunction add(a, b) { return a + b; }\n// System: Be concise\n// Previous: User asked about Python\ndef add(a, b): return a + b\n// System: Use TypeScript\n// Previous: User asked about type safety\nconst add = (a: number, b: number): number => a + b;\n// System: Explain in comments\n// Previous: User asked about documentation\n/** Adds two numbers */\nfunction add(a, b) { return a + b; }\n// System: Add error handling\n// Previous: User asked about robustness\nfunction add(a, b) { if (typeof a !== "number") throw new Error(); return a + b; }\n// System: Use async\n// Current: User asks for complete function\nCreate a comprehensive add function incorporating all previous requirements.'
  }
};

function countTokens(text) {
  return Math.ceil(text.length / 4);
}

function compressContext(prompt) {
  const lines = prompt.split('\n');
  const lineCounts = new Map();
  let cacheHits = 0;
  const unique = [];

  // Count line occurrences
  for (const line of lines) {
    const key = line.trim();
    if (key) {
      lineCounts.set(key, (lineCounts.get(key) || 0) + 1);
    }
  }

  // Build unique with deduplication references
  for (const line of lines) {
    const key = line.trim();
    const isHeader = key.startsWith('#') || key.startsWith('##') || key.startsWith('File:') || key.startsWith('Turn');
    if (isHeader || key.length < 15) {
      unique.push(line);
      continue;
    }
    if (key && lineCounts.get(key) > 1 && !unique.includes(line)) {
      // First occurrence - keep it
      unique.push(line);
    } else if (key && lineCounts.get(key) > 1) {
      // Duplicate - replace with reference
      unique.push(`// Ref: ${key.slice(0, 40)}...`);
      cacheHits++;
    } else {
      unique.push(line);
    }
  }

  let result = unique.join('\n');

  // Aggressive keyword compression
  const replacements = [
    [/function /g, 'fn '],
    [/return /g, 'ret '],
    [/const /g, 'c '],
    [/async /g, 'await '],
    [/===/g, '=='],
    [/require\(/g, 'req('],
    [/React\.useState/g, 'useState'],
    [/React\.useEffect/g, 'useEffect'],
    [/console\.log/g, 'log'],
    [/\.js\"/g, '.js"'],
    [/\.jsx/g, '.jsx'],
  ];
  for (const [pattern, repl] of replacements) {
    result = result.replace(pattern, repl);
  }

  return { result, cacheHits, originalLines: lines.length, uniqueLines: unique.length };
}

function runBenchmark(name, scenario) {
  const { prompt } = BENCHMARKS[scenario];
  const originalTokens = countTokens(prompt);
  const start = Date.now();
  const { result, cacheHits, originalLines, uniqueLines } = compressContext(prompt);
  const processingTime = Date.now() - start;
  const compressedTokens = countTokens(result);
  const reduction = ((originalTokens - compressedTokens) / originalTokens * 100);
  const targets = { small: 10, medium: 15, large: 20, multiFile: 25, history: 30 };

  return {
    scenario: name,
    originalTokens,
    compressedTokens,
    reduction: parseFloat(reduction.toFixed(1)),
    processingTime,
    cacheHits,
    deduplicated: originalLines - uniqueLines,
    target: targets[scenario]
  };
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const scenario = args.find(a => a && !a.startsWith('--')) || 'all';

  const results = scenario === 'all'
    ? Object.entries(BENCHMARKS).map(([k, v]) => runBenchmark(v.name, k))
    : BENCHMARKS[scenario]
      ? [runBenchmark(BENCHMARKS[scenario].name, scenario)]
      : (console.error('Available: small, medium, large, multiFile, history'), process.exit(1));

  if (json) {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), version: '1.2.0', results }, null, 2));
  } else {
    console.log('\nTokenKlaw Benchmark v1.2\n' + '='.repeat(50));
    for (const r of results) {
      const status = r.reduction >= r.target ? '✅' : '⚠️';
      console.log(`\n${r.scenario} ${status}`);
      console.log(`  ${r.originalTokens} → ${r.compressedTokens} tokens (${r.reduction}%) [target: ${r.target}%]`);
      console.log(`  Dedup: ${r.deduplicated}, Cache: ${r.cacheHits}, Time: ${r.processingTime}ms`);
    }
  }
}

main();