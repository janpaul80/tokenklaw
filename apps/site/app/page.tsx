import Link from "next/link";
import { MotionReveal } from "@/components/motion-reveal";
import { Section } from "@/components/section";

const tools = [
  "Claude Code",
  "Codex CLI",
  "Roo Code",
  "Cursor",
  "Cline",
  "Continue",
  "Gemini / Antigravity",
  "OpenClaw",
  "Hermes"
];

const futureRuntimes = ["Windsurf", "OpenCode", "aider", "OpenDevin"];

const benchmarks = [
  { task: "Repeated repo analysis", without: "12,000", with: "3,480", saved: "71%" },
  { task: "Duplicate logs in debug loop", without: "8,500", with: "4,200", saved: "50%" },
  { task: "Repeated stack trace explanation", without: "5,200", with: "2,100", saved: "60%" },
  { task: "Exact prompt repeat (cache hit)", without: "6,000", with: "0", saved: "up to 100%" }
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24">
          <MotionReveal className="space-y-6">
            <p className="inline-flex rounded-full border border-line px-3 py-1 text-xs text-muted">
              Open-source token-saving layer
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
              Save tokens across AI coding agents.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted md:text-lg">
              Install TokenKlaw, install into your runtime, then activate with <code>/tokenklaw</code> or <code>/tk</code>.
              Claude Code now recognizes both commands through plugin-style integration, with clean activation responses and no reasoning leakage.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/janpaul80/tokenklaw"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-medium text-text transition hover:border-accent"
              >
                View on GitHub
              </a>
              <a
                href="#install"
                className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:text-text"
              >
                Install in 2 minutes
              </a>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.08} className="rounded-xl2 border border-line bg-panel p-6 shadow-soft">
            <p className="mb-4 text-sm font-medium text-text">Example repeated-context savings</p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-muted">Before</p>
                <p className="font-mono text-text">████████████████████ 12,000 tokens</p>
              </div>
              <div>
                <p className="mb-1 text-muted">After TokenKlaw</p>
                <p className="font-mono text-text">██████ 3,480 tokens</p>
              </div>
              <div>
                <p className="text-muted">Saved</p>
                <p className="text-xl font-semibold text-text">71%</p>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <Section
        id="claude-proof"
        title="Works Inside Claude Code"
        subtitle="Validated plugin-style runtime integration: command recognition + clean activation behavior."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Verified command recognition</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`/tokenklaw  -> recognized
/tk         -> recognized

Expected clean activation:
TokenKlaw active.`}
            </pre>
            <p className="mt-3 text-xs text-muted">
              Public activation behavior is refined for final-output only responses (no internal reasoning narration).
            </p>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Claude plugin structure</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`~/.claude/.claude-plugin/plugin.json
~/.claude/.claude-plugin/marketplace.json
~/.claude/commands/tokenklaw.toml
~/.claude/commands/tk.toml
~/.claude/skills/tokenklaw/SKILL.md
~/.claude/hooks/tokenklaw.pre-response.md
~/.claude/CLAUDE.md`}
            </pre>
          </div>
        </div>
      </Section>

      <Section
        id="flow"
        title="Install → Integrate → Activate → Save Tokens"
        subtitle="Central activation flow across runtimes."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Step 1</p>
            <p className="text-sm font-medium text-text">Install TokenKlaw</p>
            <p className="mt-2 text-xs text-muted">Build once locally and run the installer.</p>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Step 2</p>
            <p className="text-sm font-medium text-text">Install into Claude / Roo / Cursor / others</p>
            <p className="mt-2 text-xs text-muted">Runtime-specific installer adapters generate the right artifacts.</p>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Step 3</p>
            <p className="text-sm font-medium text-text">Activate with /tokenklaw or /tk</p>
            <p className="mt-2 text-xs text-muted">Native command path inside supported runtime UX.</p>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Step 4</p>
            <p className="text-sm font-medium text-text">Token-saving mode enabled</p>
            <p className="mt-2 text-xs text-muted">Context compression, duplicate suppression, cleaner responses.</p>
          </div>
        </div>
      </Section>

      <Section id="tools" title="Supported runtimes" subtitle="Universal runtime installer architecture across current targets and future scaffolds.">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {tools.map((tool) => (
            <div key={tool} className="rounded-xl2 border border-line bg-panel px-4 py-3 text-sm text-text">
              {tool}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl2 border border-line bg-panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Future scaffold</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {futureRuntimes.map((runtime) => (
              <span key={runtime} className="rounded-full border border-line px-3 py-1 text-xs text-text">
                {runtime}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section id="comparison" title="Before / after examples" subtitle="Realistic prompt compression and cache-hit scenarios.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">React rerender debugging</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`Without:
"Let me explain your React rerender in detail..."
[1,280 tokens]

With TokenKlaw:
"Inline object ref causes rerender. Memoize with useMemo."
[312 tokens]

Saved: 75%`}
            </pre>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Auth middleware bug</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`Without:
Long branch-by-branch explanation with repeated logs
[2,050 tokens]

With TokenKlaw:
"Duplicate auth checks. Consolidate guard + avoid full request logs."
[640 tokens]

Saved: 69%`}
            </pre>
          </div>
        </div>
      </Section>

      <Section id="install" title="One-command install" subtitle="Public install UX for macOS/Linux/WSL and Windows PowerShell.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">macOS / Linux / WSL</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`curl -fsSL https://token.klaw.at/install.sh | bash

# runtime example:
curl -fsSL https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.sh | bash -s -- --runtime claude`}
            </pre>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Windows PowerShell</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`irm https://token.klaw.at/install.ps1 | iex

# runtime example:
powershell -ExecutionPolicy Bypass -File .\\install.ps1 -Runtime claude`}
            </pre>
          </div>
        </div>
        <div className="mt-4 rounded-xl2 border border-line bg-panel p-5">
          <p className="mb-2 text-sm font-medium text-text">Then activate in your agent</p>
          <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`/tokenklaw
/tk`}
          </pre>
        </div>
      </Section>

      <Section id="benchmarks" title="Benchmarks" subtitle="Example repeated-context scenarios. Results vary by workflow and cache hit rate.">
        <div className="overflow-hidden rounded-xl2 border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-panel">
              <tr>
                <th className="px-4 py-3 font-medium text-text">Task</th>
                <th className="px-4 py-3 font-medium text-text">Without</th>
                <th className="px-4 py-3 font-medium text-text">With TokenKlaw</th>
                <th className="px-4 py-3 font-medium text-text">Saved</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((row) => (
                <tr key={row.task} className="border-t border-line">
                  <td className="px-4 py-3 text-text">{row.task}</td>
                  <td className="px-4 py-3 text-muted">{row.without}</td>
                  <td className="px-4 py-3 text-muted">{row.with}</td>
                  <td className="px-4 py-3 text-text">{row.saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="how" title="How it works" subtitle="Simple request path, local-first internals.">
        <pre className="overflow-x-auto rounded-xl2 border border-line bg-panel p-5 text-xs text-muted">
{`Agent
  ↓
TokenKlaw
  ↓
Fingerprint + Context Reduction + Cache
  ↓
OpenAI / Anthropic / Gemini / Local models`}
        </pre>
      </Section>

      <Section id="cli" title="CLI preview" subtitle="Install + activation commands first, then regular token/cost stats.">
        <div className="rounded-xl2 border border-line bg-panel p-5">
          <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`$ tokenklaw install claude --dry-run
ok: true
agent: claude
written:
  tokenklaw.rules.md
  tokenklaw.skill.md
  tokenklaw.prompt.md
  tokenklaw.slash-commands.md

$ tokenklaw activate on
TokenKlaw active.
Context reduction: on
Duplicate detection: on
Cache guidance: on
Verbose replies: reduced
Token-saving mode: enabled

$ tokenklaw activate stats
active: true
token_saving_mode: enabled`}
          </pre>
        </div>
      </Section>

      <Section id="media" title="Media" subtitle="Responsive placeholders for upcoming demos, recordings, and validation assets.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl2 border border-line bg-panel p-6 text-sm text-text">
            <p className="font-medium">MP4 Placeholder</p>
            <p className="mt-2 text-xs text-muted">Terminal installation walkthrough recording.</p>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-6 text-sm text-text">
            <p className="font-medium">GIF Placeholder</p>
            <p className="mt-2 text-xs text-muted">Claude Code command recognition and activation flow.</p>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-6 text-sm text-text">
            <p className="font-medium">PNG/JPG Placeholder</p>
            <p className="mt-2 text-xs text-muted">Plugin structure visuals and architecture diagrams.</p>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-6 text-sm text-text">
            <p className="font-medium">Token Comparison Placeholder</p>
            <p className="mt-2 text-xs text-muted">Before/after token reduction and context compression charts.</p>
          </div>
        </div>
      </Section>

      <section className="border-t border-line py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-sm text-muted">Created by Paul Hartmann (@janpaul80)</p>
            <p className="mt-1 text-sm text-text">Building practical infrastructure for AI-native development.</p>
          </div>
          <Link
            href="/about"
            className="rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-medium text-text transition hover:border-accent"
          >
            Read about TokenKlaw
          </Link>
        </div>
      </section>
    </div>
  );
}
