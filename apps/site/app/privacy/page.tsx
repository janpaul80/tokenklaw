import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy"
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:px-8 md:py-20">
      <article className="space-y-6 rounded-xl2 border border-line bg-panel p-8 text-sm leading-7 text-muted">
        <h1 className="text-3xl font-semibold tracking-tight text-text md:text-4xl">Privacy</h1>
        <p>
          TokenKlaw is designed as a local-first layer. Request metadata, cache entries, and token
          analytics are intended to stay in your local environment unless you explicitly configure
          external services.
        </p>
        <p>
          Do not send secrets, credentials, or regulated data to model providers unless your own
          compliance and security requirements are satisfied.
        </p>
        <p>
          For website analytics and issue tracking related to this site, only minimal operational
          data should be collected.
        </p>
      </article>
    </div>
  );
}
