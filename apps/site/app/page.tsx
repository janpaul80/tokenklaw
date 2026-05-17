import Link from "next/link";
import { MotionReveal } from "@/components/motion-reveal";
import { Section } from "@/components/section";

const tools = [
  "Claude Code",
  "Codex CLI",
  "Roo Code",
  "Cline",
  "Continue",
  "Gemini / Antigravity",
  "OpenClaw",
  "KLAW"
];

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
              Install TokenKlaw, install into your agent, then activate with <code>/tokenklaw</code> or <code>/tk</code>.
              Token-saving mode then reduces repeated context, duplicate logs, and noisy retries.
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

      <Section id="tools" title="Supported tools" subtitle="Planned adapters across current and emerging AI coding environments.">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {tools.map((tool) => (
            <div key={tool} className="rounded-xl2 border border-line bg-panel px-4 py-3 text-sm text-text">
              {tool}
            </div>
          ))}
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

      <Section id="install" title="Install + activate" subtitle="Activation-first flow: install TokenKlaw, install into agent, then enable token-saving mode.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">1) Install TokenKlaw (source)</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`git clone https://github.com/janpaul80/tokenklaw.git
cd tokenklaw
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
pnpm doctor`}
            </pre>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">2) Install into agent + activate</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`tokenklaw install claude
# or: tokenklaw install all

# inside agent chat:
/tokenklaw
# alias:
/tk`}
            </pre>
          </div>
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

      <Section id="media" title="Media" subtitle="Launch visuals and product demos.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl2 border border-line bg-panel p-6 text-sm text-text">
            Terminal session demo (coming in launch update)
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-6 text-sm text-text">
            Architecture visual pack (in production)
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-6 text-sm text-text">
            Social preview kit for announcements
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
