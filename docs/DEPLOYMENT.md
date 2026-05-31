# TokenKlaw Deployment Guide

## Production Deployment

### Command (Required)

**Always deploy from repo root:**

```bash
cd /c/Users/hartm/tokenklaw
npx vercel --prod --project tokenklawsite --yes
```

### Why This Command?

| Component | Purpose |
|-----------|---------|
| `cd /c/Users/hartm/tokenklaw` | Must run from repo root (not `apps/site/`) |
| `--prod` | Production deployment |
| `--project tokenklawsite` | Deploys to correct Vercel project |
| `--yes` | Non-interactive mode |

### Warning: Wrong Project!

**DO NOT deploy from `apps/site/`:**

```bash
# WRONG - deploys to wrong project
cd apps/site
npx vercel --prod
```

This deploys to the `site` project, not `tokenklawsite`.

### Vercel Project Mapping

| Project | Production URL | Domain | Root |
|---------|---------------|--------|------|
| **tokenklawsite** | token.klaw.at | token.klaw.at | `.` (handled by vercel.json) |
| **site** | site-two-mu-21.vercel.app | - | apps/site |

## Verification

After deployment, verify:

```bash
curl -sI https://token.klaw.at
```

Expected:
- `Age: 0` or small
- `X-Vercel-Cache: PRERENDER` or `MISS`

Check runtime matrix:
1. Visit https://token.klaw.at
2. Verify OpenClaw and Hermes appear
3. Check footer has build date

## Domain

Production domain: https://token.klaw.at

## Deployment Checklist

- [ ] Push to `main` branch on GitHub
- [ ] Run deployment from repo root
- [ ] Verify cache headers
- [ ] Verify runtime matrix
- [ ] Verify install scripts work