/* Sticky section nav = easyui PillNavigation (scroll-spy via the v12 `value` patch); floating quick-jump = easyui GooeyMenu. */
import { useEffect, useState } from 'react';
import { PillNavigation } from '@/vendor/easyui/ui/PillNavigation';
import { GooeyMenu } from '@/vendor/easyui/ui/GooeyMenu';
const NAV = [
  { id: 'about', label: 'عن المركز', children: [{ id: 'stats', label: 'حقائق وأرقام' }, { id: 'partners', label: 'الشركاء' }] },
  { id: 'programmes', label: 'البرامج' },
  { id: 'languages', label: 'اللغات', children: [{ id: 'explorer', label: 'مستكشف الدورات' }] },
  { id: 'register', label: 'التسجيل' },
  { id: 'faq', label: 'الأسئلة' },
  { id: 'contact', label: 'تواصل' },
];
const PARENT: Record<string, string> = { about: 'about', stats: 'about', partners: 'about', programmes: 'programmes', languages: 'languages', explorer: 'languages', register: 'register', faq: 'faq', contact: 'contact' };
const go = (id: string) => { const el = document.getElementById(id); if (!el) return; el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); history.replaceState(null, '', '#' + id); };

export function SectionNav() {
  const [active, setActive] = useState('about');
  useEffect(() => {
    const ids = Object.keys(PARENT);
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setActive(PARENT[e.target.id]); }); }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="أقسام الصفحة" className="sticky top-3 z-30 hidden justify-center px-4 lg:flex">
      <PillNavigation items={NAV} value={active} onChange={(id, sub) => go(sub || id)} />
    </nav>
  );
}

const QUICK = [['عن المركز', 'about'], ['البرامج', 'programmes'], ['اللغات', 'languages'], ['المواعيد', 'explorer'], ['التسجيل', 'register'], ['الأسئلة', 'faq']] as const;
export function QuickJump() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(scrollY > innerHeight * 0.85);
    f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f);
  }, []);
  return (
    <div className="gooey-dock pointer-events-none fixed start-3 top-3 z-40 transition-opacity duration-300 lg:hidden" data-on={on || undefined} style={{ opacity: on ? 1 : 0, visibility: on ? 'visible' : 'hidden' }}>
      <GooeyMenu options={QUICK.map((q) => q[0])} onSelect={(_o: string, i: number) => go(QUICK[i][1])} width={176} aria-label="انتقال سريع بين الأقسام" />
    </div>
  );
}
