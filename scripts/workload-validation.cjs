/**
 * TokenKlaw Real Workload Validation Dataset
 *
 * Realistic prompts from actual Claude Code usage patterns.
 * NOT synthetic benchmarks - these reflect genuine user sessions.
 */

const WORKLOADS = {
  coding: {
    name: 'Code Fix',
    category: 'coding',
    prompt: `Fix the bug in user authentication where sessions persist after logout.

The issue is in auth_service.js: token is not removed from localStorage on logout.
Current logout function only clears the token variable but doesn't remove from storage.

Expected behavior: clicking logout should remove token from localStorage.`
  },

  debugging: {
    name: 'Debug Session',
    category: 'debugging',
    prompt: `Debug: API returns 500 error on /api/users endpoint.

Steps taken:
1. Checked server logs - no error visible
2. Verified database connection - works
3. Tested with curl - same error
4. Checked middleware - all pass

The error only happens in production, not local. What could be different?`
  },

  architecture: {
    name: 'Architecture Review',
    category: 'architecture',
    prompt: `Review the proposed microservices architecture for the payment system.

Current monolithic approach:
- Order service handles all payment logic
- Single database for orders, payments, users
- Synchronous calls between services

Proposed:
- Separate payment service
- Async event-driven
- New payment database

Is this over-engineering for 1000 users/day?`
  },

  documentation: {
    name: 'API Documentation',
    category: 'documentation',
    prompt: `Write API documentation for the user service endpoints.

Required:
- POST /api/users - create user
- GET /api/users/:id - get user by ID
- PUT /api/users/:id - update user
- DELETE /api/users/:id - delete user
- GET /api/users - list all users

Include request/response examples for each.`
  },

  multiFile: {
    name: 'Multi-file Refactor',
    category: 'refactoring',
    prompt: `Refactor form validation across the codebase.

Files affected:
- forms/registration.js
- forms/profile.js
- forms/checkout.js
- components/Input.jsx
- components/Form.jsx

Current: each form has duplicate validation logic.
Desired: shared validation utility.

Ensure backward compatibility.`
  },

  longHistory: {
    name: 'Extended Session',
    category: 'conversation',
    prompt: `Session: refactoring authentication system

Turn 1: User asked about JWT vs sessions
- Previous: I explained JWT pros/cons
- You asked about session duration needed

Turn 2: User said 30 days
- Previous: I suggested refresh tokens
- You asked about storage security

Turn 3: User wants refresh tokens
- Current: implement refresh token flow
- Include token rotation
- Add secure httpOnly cookies

Create authentication system with refresh tokens.`
  },

  bugFix: {
    name: 'Bug Fix Multiple Files',
    category: 'bugfix',
    prompt: `Fix memory leak in React application.

Memory grows continuously in timeline:
1. User loads dashboard - memory +10MB
2. User navigates between pages - memory +5MB each
3. After 10 navigations - app becomes unresponsive

Suspected:
- Event listeners not cleaned up
- Component subscriptions left open
- Interval timers not cleared

Files to check:
- Dashboard.jsx
- Navigation.jsx
- useData hook
- useSubscription hook`
  },

  codeReview: {
    name: 'Pull Request Review',
    category: 'codereview',
    prompt: `Review PR #247 for the authentication changes.

Changes:
- Added password reset flow
- Updated login to use attempt limiting
- Changed session timeout to 24h
- Added 2FA setup endpoint

Questions:
1. Is attempt limiting rate-limited itself?
2. Are tokens properly rotated on reset?
3. Is 24h session too long for sensitive actions?`
  },

  database: {
    name: 'Database Migration',
    category: 'database',
    prompt: `Create migration for adding user roles.

Current: only admin and user roles
Desired: add moderator, editor, viewer

Migration should:
- Add role column to users table
- Set default role to viewer
- Update existing users to user role
- Add role check middleware

Include rollback.`
  },

  test: {
    name: 'Test Coverage',
    category: 'testing',
    prompt: `Add tests for user authentication flow.

Current coverage: 23%
Missing tests:
- Login with wrong password
- Login with locked account
- Session expiry handling
- Logout clears all state
- Token refresh on expiry

Use Jest and React Testing Library.`
  }
};

function countTokens(text) {
  return Math.ceil(text.length / 4);
}

function runWorkloadValidation() {
  const PHRASE_NORMALIZATIONS = [
    [/Previous:/g, 'Prev:'],
    [/Current request:/g, 'Current:'],
    [/User wants me to/gi, 'User asked:'],
    [/Please analysis/gi, 'Analyze'],
    [/Please review/gi, 'Review'],
    [/Return suggestions as a bullet list/gi, 'Return bullets'],
    [/Identify the duplication and suggest refactoring/gi, 'Find duplication + refactor'],
  ];

  function normalize(text) {
    let result = text;
    for (const [pattern, repl] of PHRASE_NORMALIZATIONS) {
      result = result.replace(pattern, repl);
    }
    return result;
  }

  console.log('TokenKlaw Real Workload Validation\n' + '='.repeat(50));

  for (const [key, workload] of Object.entries(WORKLOADS)) {
    const originalTokens = countTokens(workload.prompt);
    const normalized = normalize(workload.prompt);
    const compressedTokens = countTokens(normalized);
    const reduction = ((originalTokens - compressedTokens) / originalTokens * 100);
    const savings = originalTokens - compressedTokens;

    console.log(`\n${workload.name} (${workload.category})`);
    console.log(`  ${originalTokens} → ${compressedTokens} tokens (${reduction.toFixed(1)}%)`);
    console.log(`  Savings: ${savings} chars`);
  }

  // Summary
  const results = Object.values(WORKLOADS).map(w => {
    const normalized = normalize(w.prompt);
    return countTokens(w.prompt) - countTokens(normalized);
  });

  const totalSavings = results.reduce((a, b) => a + b, 0);
  console.log(`\n---`);
  console.log(`Total workloads: ${Object.keys(WORKLOADS).length}`);
  console.log(`Total potential savings: ${totalSavings} chars`);
}

runWorkloadValidation();