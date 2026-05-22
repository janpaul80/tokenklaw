import { ReactNode } from "react";

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="border-t border-line py-16 first:border-t-0 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="mb-8 max-w-2xl space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-text md:text-3xl">{title}</h2>
          {subtitle ? <p className="text-sm leading-6 text-muted md:text-base">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
