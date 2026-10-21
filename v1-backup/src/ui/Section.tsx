import type { ReactNode } from 'react';
import { InViewTitle } from '@/registry/components/in-view-title/in-view-title';
import { cn } from '@/lib/utils';
/** Section shell: Arc InViewTitle (blur variant) as the heading, a kicker and a lead. */
export function Section({ id, kicker, title, lead, children, className, stage = false, titleId }: { id: string; kicker?: string; title: string; lead?: ReactNode; children: ReactNode; className?: string; stage?: boolean; titleId?: string }) {
  const hid = titleId || id + '-h';
  return (
    <section id={id} aria-labelledby={hid} className={cn('relative py-20 sm:py-28', stage && 'stage', className)}>
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <header className="mb-10 sm:mb-14 max-w-3xl">
          {kicker && <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]"><span className="h-px w-8 bg-current" aria-hidden="true" />{kicker}</p>}
          <InViewTitle id={hid} text={title} variant="blur" as="h2" className="font-display text-[clamp(2rem,1.3rem+3vw,3.6rem)] font-bold leading-[1.15]" />
          {lead && <div className="mt-4 text-lg leading-8 text-[var(--text-secondary)]">{lead}</div>}
        </header>
        {children}
      </div>
    </section>
  );
}
