import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-6xl flex-col gap-4 px-4 py-3 sm:px-6 md:h-24 md:flex-row md:items-center md:justify-between md:px-8 md:py-0">
        <Link href="/" className="inline-flex items-center gap-3 self-start text-sm font-semibold tracking-wide text-text md:self-auto">
          <Image
            src="/tokenklaw-logo.png"
            alt="TokenKlaw"
            width={56}
            height={56}
            className="h-12 w-12 object-contain"
            priority
          />
          <span>TokenKlaw</span>
        </Link>

        <nav className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted md:w-auto md:flex-nowrap md:gap-5">
          <Link href="/" className="transition hover:text-text">
            Home
          </Link>
          <a href="#install" className="transition hover:text-text">
            Install
          </a>
          <a href="#commands" className="transition hover:text-text">
            Commands
          </a>
          <Link href="/about" className="transition hover:text-text">
            About
          </Link>
          <a
            href="https://github.com/janpaul80/tokenklaw"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-text transition hover:bg-panel"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
