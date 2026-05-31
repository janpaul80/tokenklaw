import Image from "next/image";
import Link from "next/link";
import { MotionReveal } from "@/components/motion-reveal";
import { Section } from "@/components/section";

const runtimes = [
  { name: "Claude Code", status: "Validated", detail: "Commands, hook interception, statusline badge, full activation." },
  { name: "OpenClaw", status: "Experimental", detail: "SOUL integration, middleware compression, activation state." },
  { name: "Hermes", status: "Experimental", detail: "Startup context, memory compression, long-lived session optimization." },
  { name: "Gemini / Antigravity", status: "Investigation", detail: "Research phase – researching integration possibilities." },
  { name: "OpenCode", status: "Investigation", detail: "Research phase – researching configuration approaches." },
  { name: "Roo Code", status: "Experimental", detail: "Adapter scaffold generated." }
];

const commands = [
  ["/tokenklaw", "Activate TokenKlaw and write active state."],
  ["/tk", "Alias for /tokenklaw."],
  ["/tokenklaw-help", "Show the command table."],
  ["/tokenklaw-off", "Deactivate TokenKlaw and clear the badge."],
  ["/tokenklaw-stats", "Show active/inactive and statusline state."]
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 md:py-20">
          <MotionReveal className="space-y-6">
            <p className="inline-flex rounded-full border border-line px-3 py-1 text-xs text-muted">
              Production-first runtime activation for AI coding agents
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
                TokenKlaw
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted md:text-lg">
                A universal activation and token-optimization layer for coding agents and workspaces. TokenKlaw gives runtimes reliable commands, concise output rules, stateful activation, and a visible Claude Code status badge.
              </p>
            </div>
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
                Install TokenKlaw
              </a>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.08} className="flex items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-xl2 border border-line bg-panel p-8 shadow-soft">
              <Image
                src="https://raw.githubusercontent.com/janpaul80/tokenklaw/main/assets/tokenklaw-logo.png"
                alt="TokenKlaw logo"
                width={420}
                height={420}
                className="h-full w-full object-contain"
                unoptimized
                priority
              />
            </div>
          </MotionReveal>
        </div>
      </section>

      <Section
        id="claude"
        title="Claude Code Integration"
        subtitle="The current production path is validated in Claude Code with deterministic command handling and a visible statusline badge."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Runtime proof points</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`/tokenklaw       -> active
/tk              -> active
/tokenklaw-help  -> help
/tokenklaw-off   -> inactive
/tokenklaw-stats -> state

Statusline when active:
[TOKENKLAW]`}
            </pre>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Generated artifacts</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`~/.claude/commands/tokenklaw.md
~/.claude/commands/tk.md
~/.claude/hooks/tokenklaw.pre-response.cjs
~/.claude/hooks/tokenklaw-statusline.ps1
~/.claude/tokenklaw/activation-state.json
~/.claude/settings.json`}
            </pre>
          </div>
        </div>
      </Section>

      <Section id="commands" title="Runtime Commands" subtitle="Small, predictable commands users can trust during live demos and daily work.">
        <div className="overflow-hidden rounded-xl2 border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-panel">
              <tr>
                <th className="px-4 py-3 font-medium text-text">Command</th>
                <th className="px-4 py-3 font-medium text-text">Behavior</th>
              </tr>
            </thead>
            <tbody>
              {commands.map(([command, behavior]) => (
                <tr key={command} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-text">{command}</td>
                  <td className="px-4 py-3 text-muted">{behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="install" title="Install" subtitle="Use the public installer, or build from source for local development.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">macOS, Linux, WSL</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`curl -fsSL https://token.klaw.at/install.sh | bash

# Claude Code runtime
curl -fsSL https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.sh | bash -s -- --runtime claude`}
            </pre>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Windows PowerShell</p>
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted">
{`irm https://token.klaw.at/install.ps1 | iex

# From a cloned repo
powershell -ExecutionPolicy Bypass -File .\\install.ps1 -Runtime claude`}
            </pre>
          </div>
        </div>
      </Section>

      <Section id="runtimes" title="Runtime Coverage" subtitle="Claude Code is validated first; additional runtimes keep explicit experimental/scaffold status until proven in their real environments.">
        <div className="grid gap-3 md:grid-cols-3">
          {runtimes.map((runtime) => (
            <div key={runtime.name} className="rounded-xl2 border border-line bg-panel p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-text">{runtime.name}</p>
                <span className="rounded-full border border-line px-2 py-1 text-[11px] uppercase tracking-wide text-muted">
                  {runtime.status}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted">{runtime.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="vision" title="Vision" subtitle="TokenKlaw is designed as a universal activation layer for AI coding agents, not just a Claude-only tool.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Target Ecosystem</p>
            <div className="flex flex-wrap gap-2">
              {["Claude Code", "OpenClaw", "Hermes", "Gemini", "OpenCode", "Roo", "Cursor", "Cline", "Continue", "Windsurf", "aider", "OpenDevin"].map((runtime) => (
                <span key={runtime} className="rounded-full border border-line px-2 py-1 text-xs text-muted">
                  {runtime}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl2 border border-line bg-panel p-5">
            <p className="mb-3 text-sm font-medium text-text">Key Capabilities</p>
            <ul className="space-y-2 text-xs text-muted">
              <li>• One-command install per runtime</li>
              <li>• Runtime activation commands</li>
              <li>• Context reduction and compression</li>
              <li>• Duplicate suppression</li>
              <li>• Cache intelligence</li>
              <li>• Status visibility (badges)</li>
              <li>• Token accounting</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="architecture" title="Architecture" subtitle="TokenKlaw keeps activation state local and uses runtime-specific hooks only where they are validated.">
        <pre className="overflow-x-auto rounded-xl2 border border-line bg-panel p-5 text-xs text-muted">
{`Agent runtime
  -> TokenKlaw activation command
  -> Runtime hook / state file
  -> Concise output policy + status visibility
  -> Provider request path and cache guidance`}
        </pre>
      </Section>

      <section className="border-t border-line py-14">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-sm text-muted">Created by Paul Hartmann (@janpaul80)</p>
            <p className="mt-1 text-sm text-text">Production-first runtime infrastructure for AI-native development.</p>
          </div>
          <Link
            href="/about"
            className="rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-medium text-text transition hover:border-accent"
          >
            About TokenKlaw
          </Link>
        </div>
      </section>
    </div>
  );
}
