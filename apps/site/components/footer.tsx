import Image from "next/image";
import Link from "next/link";
import { DiscordIcon, GithubIcon, LinkedInIcon, XIcon } from "@/components/icons";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/janpaul80", icon: GithubIcon },
  { name: "X", href: "https://x.com/revprodev?s=21", icon: XIcon },
  { name: "Discord", href: "https://discord.com/users/paulhartmanndev", icon: DiscordIcon },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/hartmanndev?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    icon: LinkedInIcon
  }
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-[#080a0f]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
        <div className="space-y-2">
          <div className="inline-flex items-center">
            <Image
              src="/tokenklaw-logo.png"
              alt="TokenKlaw"
              width={96}
              height={96}
              className="h-[72px] w-[72px] object-contain sm:h-[84px] sm:w-[84px] md:h-[96px] md:w-[96px]"
            />
          </div>
          <p className="text-sm text-muted">
            Open-source token-saving layer for AI coding agents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {socialLinks.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={name}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:text-text"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <a
            href="https://paulhartmann.dev"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-text"
          >
            paulhartmann.dev
          </a>
          <Link href="/terms" className="transition hover:text-text">
            Terms
          </Link>
          <Link href="/privacy" className="transition hover:text-text">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
