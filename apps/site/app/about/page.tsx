import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-6 rounded-xl2 border border-line bg-panel p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">About</p>
        <h1 className="text-3xl font-semibold tracking-tight text-text md:text-4xl">
          Paul Hartmann
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted md:text-base">
          Builder focused on practical tooling for AI-native development. TokenKlaw is built as a
          token-saving runtime layer that makes coding agents cheaper and more predictable in daily
          use.
        </p>

        <div className="grid gap-4 pt-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-black/20 p-4">
            <p className="text-sm font-medium text-text">Projects</p>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              <li>TokenKlaw</li>
              <li>OpenClaw</li>
              <li>KLAW</li>
              <li>AI coding infrastructure experiments</li>
            </ul>
          </div>
          <div className="rounded-xl2 border border-line bg-black/20 p-4">
            <p className="text-sm font-medium text-text">Base</p>
            <p className="mt-2 text-sm text-muted">Austria</p>
            <p className="mt-4 text-sm font-medium text-text">Portfolio</p>
            <a
              href="https://paulhartmann.dev"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-muted underline-offset-4 transition hover:text-text hover:underline"
            >
              paulhartmann.dev
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
