/* Ahmed Ali Almarar — personal CV. Verified content only; placeholders are marked «يُضاف لاحقاً».
   Components: Arc HeroMesh (uiarc.dev) · easyui CursorFollower, MagneticButton, SpotlightCard, NeonEdgeLink ·
   audiocn SmoothWaveform · gauge-ui Gauge · mdxcn Callout + Steps · pele diagram. */
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Moon, Sun, ChevronLeft, ChevronRight, ExternalLink, BookOpen, Languages, GraduationCap, Sparkles, Mail, Store } from 'lucide-react';
import { HeroMesh } from '@/registry/blocks/hero-section/hero-mesh';
import { CursorFollower } from '@/vendor/easyui/ui/CursorFollower';
import { MagneticButton } from '@/vendor/easyui/ui/MagneticButton';
import { SpotlightCard } from '@/vendor/easyui/ui/SpotlightCard';
import { NeonEdgeLink } from '@/vendor/easyui/ui/NeonEdgeLink';
import { Callout } from '@/registry/default/callout/callout';
import { Steps, Step } from '@/registry/default/steps/steps';
import { WhenVisible } from './cv/Lazy';
import { aboutAlcode } from './cv/about-alcode';
import books from './data/books.json';
import ads from './data/ads.json';
const Voice = lazy(() => import('./cv/Voice'));
const Career = lazy(() => import('./cv/Career'));
const PriceGauge = lazy(() => import('./cv/PriceGauge'));

const STORE = 'https://alcode.ae';
const IG_ALCODE = 'https://www.instagram.com/alcode.ae/';
const X_ME = 'https://x.com/liwadc';
const IG_ME = 'https://www.instagram.com/liwadc/';
const MESH = [{ x: .15, y: .2, spread: .75 }, { x: .85, y: .25, spread: .6 }, { x: .5, y: .85, spread: .9 }, { x: .75, y: .7, spread: .45 }] as const;

const XIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20Z"/></svg>;
const IgIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>;

function useReduced() {
  const [r, setR] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const m = matchMedia('(prefers-reduced-motion: reduce)'); const f = () => setR(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return r;
}
/* scroll storytelling: reveal on enter */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null); const [on, setOn] = useState(false);
  useEffect(() => { const el = ref.current!; const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: .15 }); io.observe(el); return () => io.disconnect(); }, []);
  return <div ref={ref} className={'reveal ' + (on ? 'is-on ' : '') + className} style={{ transitionDelay: delay + 'ms' }}>{children}</div>;
}
function Social({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const c = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11';
  return (
    <ul className="flex list-none items-center gap-3 p-0 m-0" aria-label="الحسابات الشخصية">
      <li><a href={X_ME} target="_blank" rel="noopener" className={`social ${c}`} aria-label="حساب أحمد على إكس @liwadc (يفتح في نافذة جديدة)"><XIcon /></a></li>
      <li><a href={IG_ME} target="_blank" rel="noopener" className={`social ${c}`} aria-label="حساب أحمد على إنستغرام @liwadc (يفتح في نافذة جديدة)"><IgIcon /></a></li>
    </ul>
  );
}
function Head({ k, title, sub }: { k: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-10 max-w-3xl">
      <p className="m-0 text-sm font-semibold text-[var(--accent)]">{k}</p>
      <h2 className="font-display m-0 mt-2 text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight">{title}</h2>
      {sub && <p className="mt-3 text-lg text-[var(--muted-foreground)]">{sub}</p>}
    </Reveal>
  );
}
function Placeholder({ title }: { title: string }) {
  return (
    <Callout type="note" title="يُضاف لاحقاً" className="mdx-ar placeholder">
      سيُستكمل قسم «{title}» بعد استلام السيرة الذاتية من أحمد.
    </Callout>
  );
}

export default function App() {
  const reduced = useReduced();
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');
  const [en, setEn] = useState(false);
  const [i, setI] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const [fine, setFine] = useState(false);
  const [prog, setProg] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lb, setLb] = useState<string | null>(null);
  const N = books.length;
  const prices = useMemo(() => books.map((b) => b.p), []);
  const pmin = 0, pmax = Math.max(...prices);

  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('aam-theme', dark ? 'dark' : 'light'); } catch {} }, [dark]);
  useEffect(() => { setFine(matchMedia('(pointer: fine)').matches); }, []);
  useEffect(() => { const f = () => { const h = document.documentElement; setProg(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)); }; addEventListener('scroll', f, { passive: true }); f(); return () => removeEventListener('scroll', f); }, []);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setLb(null); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, []);
  const go = (d: number) => setI((x) => (x + d + N) % N);
  const b = books[i];

  return (
    <div className="min-h-screen overflow-x-clip">
      <div className="fixed inset-x-0 top-0 z-50 h-1 origin-right bg-[var(--accent)]" style={{ transform: `scaleX(${prog})` }} aria-hidden />
      {fine && !reduced && <CursorFollower size={26} className="cursor-dot" />}

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40">
        <nav className="nav-glass mx-auto mt-3 flex max-w-[1240px] items-center justify-between gap-2 rounded-full px-3 py-2 sm:px-5" aria-label="التنقل الرئيسي">
          <a href="#top" className="font-display rounded-full px-2 text-lg font-bold no-underline">أ.م</a>
          <ul className="m-0 hidden list-none gap-1 p-0 md:flex">
            {[['#career', 'المسار'], ['#alcode', 'مؤسسة الكود'], ['#education', 'التعليم'], ['#skills', 'المهارات'], ['#contact', 'التواصل']].map(([h, t]) => <li key={h}><a href={h} className="navlink">{t}</a></li>)}
          </ul>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setEn((v) => !v)} aria-pressed={en} className="pill-btn" lang={en ? 'ar' : 'en'}>{en ? 'عربي' : 'EN'}<span className="sr-only">{en ? 'عرض الاسم والمسمى بالعربية' : 'Show name and role in English'}</span></button>
            <button type="button" onClick={() => setDark((d) => !d)} aria-pressed={dark} aria-label={dark ? 'الوضع الفاتح' : 'الوضع الداكن'} className="pill-btn grid w-11 place-items-center">{dark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}</button>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section style={{ background: "#0b1411", color: "#f1ede5" }} className="stage grain relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
          onPointerMove={(e) => { if (reduced) return; const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: (e.clientX - r.left) / r.width - .5, y: (e.clientY - r.top) / r.height - .5 }); }}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
          <HeroMesh points={MESH} grain={.3} speed={reduced ? 0 : .5} className="-z-10" style={{ ["--mesh-base" as any]: "#0b1411", ["--mesh-1" as any]: "#1d6152", ["--mesh-2" as any]: "#7a5520", ["--mesh-3" as any]: "#123029", ["--mesh-4" as any]: "#4a2440" }} />
          <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.25fr_.75fr]">
            <div>
              <p className="hero-chip"><Sparkles className="h-4 w-4" aria-hidden />السيرة الشخصية</p>
              {en
                ? <h1 lang="en" dir="ltr" className="font-display hero-name text-start">Ahmed Ali Almarar</h1>
                : <h1 className="font-display hero-name">{'أحمد علي المرر'.split(' ').map((w, k) => <span key={k} className="word" style={{ animationDelay: k * 140 + 'ms' }}>{w}</span>)}</h1>}
              <p className="mt-5 max-w-2xl text-[clamp(1.05rem,2vw,1.35rem)] text-[#dfe5e1]" lang={en ? 'en' : 'ar'} dir={en ? 'ltr' : 'rtl'}>
                {en ? <>Languages Officer, Languages Section, Continuing Education Center, Mohamed bin Zayed University for Humanities · Founder of Alcode</>
                    : <>ضابط لغات في قسم اللغات بمركز التعليم المستمر، جامعة محمد بن زايد للعلوم الإنسانية · مؤسس <b className="text-[#f3d9a6]">مؤسسة الكود</b></>}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <MagneticButton variant="primary" size="lg" glow onClick={() => document.getElementById('alcode')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })} className="mag-cta">
                  <BookOpen className="h-5 w-5" aria-hidden /> كتب مؤسسة الكود
                </MagneticButton>
                <NeonEdgeLink href={STORE} target="_blank" rel="noopener" icon={<Store className="h-4 w-4 text-[#e0b26a]" aria-hidden />}>
                  <bdi className="bdi-ltr">alcode.ae</bdi><span className="sr-only"> (يفتح في نافذة جديدة)</span>
                </NeonEdgeLink>
                <div className="text-white"><Social /></div>
              </div>
              <div className="mt-10 h-16 max-w-md" aria-hidden><Suspense fallback={null}>{!reduced && <Voice />}</Suspense></div>
            </div>
            {/* interactive book stack: tilts with the cursor */}
            <div className="hero-stack relative mx-auto h-[320px] w-[240px] sm:h-[380px] sm:w-[280px]" aria-hidden
              style={{ transform: `perspective(900px) rotateY(${tilt.x * -18}deg) rotateX(${tilt.y * 12}deg)` }}>
              {[books[3], books[12], books[19]].map((bk, k) => (
                <img key={k} src={bk.c} alt="" width={bk.w} height={bk.h} className="hero-cover" style={{ ['--k' as any]: k }} />
              ))}
            </div>
          </div>
          <a href="#career" className="scroll-cue" aria-label="انتقل إلى المسار المهني"><span /></a>
        </section>

        {/* CAREER */}
        <section id="career" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <Head k="01 · المسار المهني" title="من الكلمة إلى الكتاب" sub="محطّتان تصنعان الحكاية: العمل في اللغات، وتأسيس مؤسسة الكود." />
          <ol className="timeline m-0 list-none p-0">
            <Reveal><li className="tl-item">
              <SpotlightCard spotlightColor="rgba(224,178,106,.22)" className="tl-card">
                <span className="tl-date">منذ مايو 2025</span>
                <div className="flex items-start gap-3"><Languages className="mt-1 h-7 w-7 shrink-0 text-[var(--accent)]" aria-hidden />
                  <div><h3 className="font-display m-0 text-xl font-bold">ضابط لغات</h3>
                  <p className="m-0 mt-1 text-[var(--muted-foreground)]">قسم اللغات · مركز التعليم المستمر · جامعة محمد بن زايد للعلوم الإنسانية</p>
                  <p className="m-0 mt-1 text-sm text-[var(--muted-foreground)]" lang="en" dir="ltr">Languages Officer · Mohamed bin Zayed University for Humanities</p></div></div>
              </SpotlightCard></li></Reveal>
            <Reveal delay={120}><li className="tl-item">
              <SpotlightCard spotlightColor="rgba(29,97,82,.25)" className="tl-card">
                <span className="tl-date">المؤسس</span>
                <div className="flex items-start gap-3"><BookOpen className="mt-1 h-7 w-7 shrink-0 text-[var(--accent)]" aria-hidden />
                  <div><h3 className="font-display m-0 text-xl font-bold">مؤسس مؤسسة الكود</h3>
                  <p className="m-0 mt-1 text-[var(--muted-foreground)]">ومتجرها الإلكتروني <a href={STORE} target="_blank" rel="noopener" className="link"><bdi className="bdi-ltr">alcode.ae</bdi></a> · {N} عنواناً متاحاً في المتجر</p></div></div>
              </SpotlightCard></li></Reveal>
            <Reveal delay={240}><li className="tl-item"><div className="tl-card tl-ghost"><span className="tl-date">قبل ذلك</span><p className="m-0 font-semibold">يُضاف لاحقاً</p><p className="m-0 text-sm text-[var(--muted-foreground)]">الخبرات السابقة تُستكمل من السيرة الذاتية.</p></div></li></Reveal>
          </ol>
          <Reveal className="mt-14 rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-4 sm:p-8">
            <p className="m-0 mb-4 text-center text-sm font-semibold text-[var(--muted-foreground)]">خريطة المسار</p>
            <WhenVisible minHeight={260}><Suspense fallback={<div className="h-[260px]" />}><Career /></Suspense></WhenVisible>
          </Reveal>
        </section>

        {/* ALCODE */}
        <section id="alcode" style={{ background: "#0b1411", color: "#f1ede5" }} className="stage relative py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <Head k="02 · مؤسسة الكود" title="مؤسسة الكود" sub={`رفوف المتجر: ${N} عنواناً كما تظهر في alcode.ae.`} />
            <div className="about-alcode mb-10 max-w-3xl" data-replaceable="about-alcode">
              {aboutAlcode.paragraphs.length ? aboutAlcode.paragraphs.map((p, k) => <p key={k} className="text-lg">{p}</p>) : null}
              <div className="flex flex-wrap gap-3">
                <a href={STORE} target="_blank" rel="noopener" className="chip-link"><Store className="h-4 w-4" aria-hidden />المتجر <bdi className="bdi-ltr">alcode.ae</bdi></a>
                <a href={IG_ALCODE} target="_blank" rel="noopener" className="chip-link"><IgIcon />إنستغرام <bdi className="bdi-ltr">@alcode.ae</bdi></a>
              </div>
            </div>

            {/* 3D carousel */}
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_280px]">
              <div className="shelf" role="region" aria-roledescription="معرض دوّار" aria-label="كتب مؤسسة الكود"
                onPointerDown={(e) => setDrag(e.clientX)} onPointerUp={(e) => { if (drag !== null) { const d = e.clientX - drag; if (Math.abs(d) > 40) go(d > 0 ? 1 : -1); } setDrag(null); }}
                onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(1); if (e.key === 'ArrowRight') go(-1); }} tabIndex={0}>
                {books.map((bk, k) => {
                  let o = k - i; if (o > N / 2) o -= N; if (o < -N / 2) o += N;
                  const vis = Math.abs(o) <= 3;
                  return (
                    <button key={k} type="button" className="shelf-book" tabIndex={o === 0 ? 0 : -1} aria-hidden={!vis} onClick={() => (o === 0 ? window.open(bk.u, '_blank', 'noopener') : setI(k))}
                      aria-label={o === 0 ? `${bk.t} — ${bk.p} درهماً، افتح في المتجر` : `اعرض ${bk.t}`}
                      style={{ ['--o' as any]: o, opacity: vis ? 1 - Math.abs(o) * .18 : 0, pointerEvents: vis ? 'auto' : 'none', zIndex: 10 - Math.abs(o) }}>
                      <img src={bk.c} alt="" width={bk.w} height={bk.h} loading="lazy" draggable={false} />
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <WhenVisible minHeight={240}><Suspense fallback={<div className="h-[240px]" />}><PriceGauge value={b.p} min={pmin} max={pmax} /></Suspense></WhenVisible>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center gap-4 text-center" aria-live="polite">
              <h3 className="font-display m-0 max-w-3xl text-[clamp(1.15rem,2.4vw,1.6rem)] font-bold leading-snug">{b.t}</h3>
              <p className="m-0 text-[var(--muted-foreground)]">{b.p} درهم · {i + 1} / {N}</p>
              <div className="flex items-center gap-3">
                <button type="button" className="round-btn" onClick={() => go(-1)} aria-label="الكتاب السابق"><ChevronRight className="h-6 w-6" aria-hidden /></button>
                <a href={b.u} target="_blank" rel="noopener" className="buy-btn">صفحة الكتاب في المتجر<ExternalLink className="h-4 w-4" aria-hidden /></a>
                <button type="button" className="round-btn" onClick={() => go(1)} aria-label="الكتاب التالي"><ChevronLeft className="h-6 w-6" aria-hidden /></button>
              </div>
            </div>

            {/* full grid */}
            <details className="mt-14 group">
              <summary className="chip-link mx-auto w-fit cursor-pointer list-none">كل العناوين ({N})</summary>
              <ul className="mt-8 grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-3 lg:grid-cols-5">
                {books.map((bk, k) => (
                  <li key={k}><a href={bk.u} target="_blank" rel="noopener" className="grid-book">
                    <img src={bk.c} alt="" width={bk.w} height={bk.h} loading="lazy" />
                    <span className="mt-2 block text-sm font-semibold leading-snug">{bk.t}</span>
                    <span className="text-sm text-[var(--accent)]">{bk.p} درهم</span>
                  </a></li>
                ))}
              </ul>
            </details>

            {/* Instagram post designs */}
            <h3 className="font-display mt-20 mb-6 text-2xl font-bold">من تصاميم حساب الكود على إنستغرام</h3>
            <ul className="ads m-0 flex list-none gap-5 overflow-x-auto p-0 pb-4" aria-label="تصاميم منشورات الكتب">
              {ads.map((a: string) => (
                <li key={a} className="shrink-0"><button type="button" className="ad-card" onClick={() => setLb(a)} aria-label="تكبير تصميم المنشور">
                  <img src={`/ads/${a}.webp`} alt="تصميم منشور لكتاب من مؤسسة الكود" width={540} height={675} loading="lazy" />
                </button></li>
              ))}
            </ul>
          </div>
        </section>

        {/* EDUCATION / SKILLS (placeholders) */}
        <section id="education" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <Head k="03 · التعليم" title="التعليم" />
          <Reveal><Placeholder title="التعليم" /></Reveal>
        </section>
        <section id="skills" className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8">
          <Head k="04 · المهارات" title="المهارات" />
          <Reveal className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <Placeholder title="المهارات" />
            <div className="mdx-ar"><Steps title="ما بعد استلام السيرة">
              <Step title="استلام السيرة الذاتية">يُضاف لاحقاً</Step>
              <Step title="التعليم والمهارات">يُضاف لاحقاً</Step>
              <Step title="بيانات التواصل">يُضاف لاحقاً</Step>
            </Steps></div>
          </Reveal>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ background: "#0b1411", color: "#f1ede5" }} className="stage grain relative py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <Head k="05 · التواصل" title="لنتواصل" />
            <div className="grid gap-6 md:grid-cols-2">
              <Reveal><div className="contact-card">
                <h3 className="font-display m-0 mb-4 text-xl font-bold">الحسابات الشخصية</h3>
                <div className="flex flex-col gap-3">
                  <a href={X_ME} target="_blank" rel="noopener" className="chip-link w-fit"><XIcon /><bdi className="bdi-ltr">@liwadc</bdi> · إكس</a>
                  <a href={IG_ME} target="_blank" rel="noopener" className="chip-link w-fit"><IgIcon /><bdi className="bdi-ltr">@liwadc</bdi> · إنستغرام</a>
                </div>
              </div></Reveal>
              <Reveal delay={120}><div className="contact-card">
                <h3 className="font-display m-0 mb-4 flex items-center gap-2 text-xl font-bold"><Mail className="h-5 w-5" aria-hidden />البريد والهاتف</h3>
                <Placeholder title="التواصل" />
              </div></Reveal>
            </div>
          </div>
        </section>
      </main>
      <footer style={{ background: "#0b1411" }} className="stage border-t border-white/10 py-8 text-center text-sm text-[#b9c2bd]">
        <p className="m-0">© أحمد علي المرر · <span lang="en">Ahmed Ali Almarar</span></p>
      </footer>

      {lb && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="تصميم المنشور" onClick={() => setLb(null)}>
          <img src={`/ads/${lb}.webp`} alt="تصميم منشور لكتاب من مؤسسة الكود" />
          <button type="button" className="round-btn absolute top-4 left-4" onClick={() => setLb(null)} aria-label="إغلاق">×</button>
        </div>
      )}
    </div>
  );
}
