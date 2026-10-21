/* Ahmed Ali Almarar — CV site v4. Clarity-first one-page RTL layout; every fact visible on the page.
   Content: src/data/cv.json (exported from /workspace/cv/_src/content.py) — nothing invented.
   Shared helpers (no motion deps) so the hero paints before the lazy sections chunk loads. */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Phone, Mail, MapPin, Copy, Check, Download, Moon, Sun, Briefcase, GraduationCap, School, Award, Search, Sparkles, Languages, Wrench, Users, Lightbulb, HeartHandshake, ArrowUp, CalendarDays, Trophy, FileCheck2, Database, ClipboardCheck, Megaphone, BookOpenCheck, Link2 } from 'lucide-react';
import cv from './data/cv.json';
export { cv };

export const C = cv.ar as any, E = cv.en as any;
export const PHONE = C.contacts[0][1] as string, EMAIL = C.contacts[1][1] as string, LINKEDIN = 'https://www.' + C.linkedin;
export const X_ME = 'https://x.com/liwadc', IG_ME = 'https://www.instagram.com/liwadc/';
export const clean = (s: string) => s.replace(/\s+/g, ' ').replace(/^\s*[|—]\s*/, '').trim();
export const noColon = (s: string) => s.replace(/[:：]\s*$/, '').trim();
export type Cert = { t: string; i: string; g: string };
export const CERTS: Cert[] = (C.certs as [string, [string, string][]][]).flatMap(([g, items]) => items.map(([t, i]) => ({ t, i: i.replace(/^\s*\(|\)\s*$/g, ''), g: noColon(g) })));
export const GROUPS = (C.certs as [string, unknown[]][]).map(([g]) => noColon(g));
export const NAV = [['summary', 'نبذة'], ['role', 'الدور الحالي'], ['achievements', 'الإنجازات'], ['timeline', 'المسار'], ['skills', 'المهارات'], ['certs', 'الشهادات'], ['training', 'الدورات'], ['contact', 'التواصل']] as const;
export const MESH = [{ x: .12, y: .2, spread: .7 }, { x: .88, y: .18, spread: .6 }, { x: .5, y: .95, spread: .9 }, { x: .8, y: .75, spread: .4 }] as const;
export const MESH_VARS = { ['--mesh-base' as any]: '#0a1712', ['--mesh-1' as any]: '#1d6152', ['--mesh-2' as any]: '#7a5520', ['--mesh-3' as any]: '#0f2a23', ['--mesh-4' as any]: '#3c2a52' };
export const ACH_ICONS = [CalendarDays, Megaphone, FileCheck2, ClipboardCheck, Database];
export const ACH_NUM: (null | { n: number; pre?: string; unit: string })[] = [{ n: 36, unit: 'دورة لغوية' }, { n: 150, pre: 'نحو ', unit: 'جهة' }, null, null, null];

export const XIcon = ({ c = 'h-5 w-5' }) => <svg viewBox="0 0 24 24" className={c} fill="currentColor" aria-hidden><path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20Z" /></svg>;
export const IgIcon = ({ c = 'h-5 w-5' }) => <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
export const LiIcon = ({ c = 'h-5 w-5' }) => <svg viewBox="0 0 24 24" className={c} fill="currentColor" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4V9Z" /></svg>;

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* reveal: quick slide-in; final state is always fully opaque and untransformed */
export function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }: { children: ReactNode; className?: string; as?: any; delay?: number }) {
  const ref = useRef<HTMLElement>(null); const [on, setOn] = useState(false);
  useEffect(() => { const el = ref.current!; if (reduced()) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px' }); io.observe(el); return () => io.disconnect(); }, []);
  return <Tag ref={ref} className={'rv ' + (on ? 'rv-on ' : '') + className} style={{ transitionDelay: on ? delay + 'ms' : '0ms' }}>{children}</Tag>;
}
export function CountUp({ to, className = '' }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null); const [v, setV] = useState(0);
  useEffect(() => { const el = ref.current!; if (reduced()) { setV(to); return; }
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); const t0 = performance.now(), d = 1300;
      const f = (t: number) => { const p = Math.min(1, (t - t0) / d); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, { threshold: .4 });
    io.observe(el); return () => io.disconnect(); }, [to]);
  return <span ref={ref} className={className}><span aria-hidden>{v}</span><span className="sr-only">{to}</span></span>;
}
/* gentle hover lift + tilt (max 3°) */
export function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const r = useRef<HTMLDivElement>(null);
  return <div ref={r} className={'tilt ' + className}
    onPointerMove={(e) => { if (e.pointerType !== 'mouse' || reduced()) return; const b = r.current!.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; r.current!.style.transform = `translateY(-4px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`; }}
    onPointerLeave={() => { r.current!.style.transform = ''; }}>{children}</div>;
}
export function Magnet({ children, s = .3 }: { children: ReactNode; s?: number }) {
  const r = useRef<HTMLSpanElement>(null);
  return <span ref={r} className="magnet" onPointerMove={(e) => { if (e.pointerType !== 'mouse' || reduced()) return; const b = r.current!.getBoundingClientRect(); r.current!.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * s}px,${(e.clientY - b.top - b.height / 2) * s}px)`; }} onPointerLeave={() => { r.current!.style.transform = ''; }}>{children}</span>;
}
export function SectionHead({ n, title, icon: I, sub }: { n: string; title: string; icon: any; sub?: string }) {
  return <Reveal className="sec-head"><span className="sec-ico"><I className="h-6 w-6" aria-hidden /></span><div><p className="sec-n">{n}</p><h2 className="sec-title">{title}</h2>{sub && <p className="sec-sub">{sub}</p>}</div></Reveal>;
}
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null); const t = useRef<number>(0);
  const show = (m: string) => { setMsg(m); clearTimeout(t.current); t.current = window.setTimeout(() => setMsg(null), 2200); };
  const el = <div className={'toast ' + (msg ? 'on' : '')} role="status" aria-live="polite">{msg && <><Check className="h-5 w-5" aria-hidden />{msg}</>}</div>;
  return { show, el };
}
export function CopyBtn({ value, label, toast }: { value: string; label: string; toast: (m: string) => void }) {
  const [ok, setOk] = useState(false);
  return <button type="button" className="copy" onClick={async () => { try { await navigator.clipboard.writeText(value); } catch { const ta = document.createElement('textarea'); ta.value = value; document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); } setOk(true); toast(`تم نسخ ${label}`); setTimeout(() => setOk(false), 1600); }} aria-label={`نسخ ${label}`}>
    {ok ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}<span>{ok ? 'نُسخ' : 'نسخ'}</span></button>;
}

