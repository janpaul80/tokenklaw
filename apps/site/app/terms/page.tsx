import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms"
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:px-8 md:py-20">
      <article className="space-y-6 rounded-xl2 border border-line bg-panel p-8 text-sm leading-7 text-muted">
        <h1 className="text-3xl font-semibold tracking-tight text-text md:text-4xl">Terms</h1>
        <p>
          TokenKlaw is provided as open-source software under the MIT license. Use is at your own
          risk. You are responsible for validating outputs, handling credentials securely, and
          complying with provider terms for any connected model APIs.
        </p>
        <p>
          The project is under active development. Behavior, APIs, and CLI surfaces may change
          between releases.
        </p>
        <p>
          For production usage, pin versions, review changes before upgrades, and run your own
          validation in staging environments.
        </p>
      </article>
    </div>
  );
}
