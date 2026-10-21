/* Ahmed Ali Almarar — CV site v4 (hero + shell). Arc HeroMesh background; sections lazy-loaded from Sections.tsx. Content: src/data/cv.json only. */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { MapPin, Download, Moon, Sun, Languages, Phone, Mail } from 'lucide-react';
import { HeroMesh } from '@/registry/blocks/hero-section/hero-mesh';
import { C, CERTS, PHONE, EMAIL, LINKEDIN, X_ME, IG_ME, NAV, MESH, MESH_VARS, XIcon, IgIcon, LiIcon, reduced, CountUp, Magnet, useToast, clean } from './shared';
const Sections = lazy(() => import('./Sections'));

export default function App() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');
  const [active, setActive] = useState<string>('');
  const [prog, setProg] = useState(0);
  const { show, el: toastEl } = useToast();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('aam-theme', dark ? 'dark' : 'light'); } catch {} }, [dark]);
  useEffect(() => {
    if (!reduced()) { const l = new Lenis({ lerp: .12 }); lenis.current = l; let raf = 0; const f = (t: number) => { l.raf(t); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => { cancelAnimationFrame(raf); l.destroy(); }; }
  }, []);
  useEffect(() => {
    const f = () => { const h = document.documentElement; setProg(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
      const tl = document.querySelector<HTMLElement>('.tl'); if (tl) { const b = tl.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * .7 - b.top) / b.height)); tl.style.setProperty('--draw', String(reduced() ? 1 : p)); } };
    addEventListener('scroll', f, { passive: true }); f();
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
    const seen = new Set<string>(); const obs = () => NAV.forEach(([id]) => { const s = document.getElementById(id); if (s && !seen.has(id)) { seen.add(id); io.observe(s); } }); obs();
    const mo = new MutationObserver(obs); mo.observe(document.querySelector('main')!, { childList: true, subtree: true });
    return () => { removeEventListener('scroll', f); io.disconnect(); mo.disconnect(); };
  }, []);
  useEffect(() => { const nav = document.querySelector<HTMLElement>('.nav'); const a = nav?.querySelector<HTMLElement>(`a[href="#${active}"]`); if (!nav || !a || nav.scrollWidth <= nav.clientWidth) return;
    const nb = nav.getBoundingClientRect(), ab = a.getBoundingClientRect(); nav.scrollBy({ left: ab.left + ab.width / 2 - (nb.left + nb.width / 2), behavior: reduced() ? 'auto' : 'smooth' }); }, [active]);
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); const el = document.getElementById(id)!; if (lenis.current) lenis.current.scrollTo(el, { offset: -70 }); else el.scrollIntoView(); history.replaceState(null, '', '#' + id); };

  return (
    <div className="v4">
      <div className="progress" style={{ transform: `scaleX(${prog})` }} aria-hidden />
      <a href="#summary" className="skip">تخطَّ إلى المحتوى</a>

      <header className="topbar">
        <div className="wrap topbar-in">
          <a href="#top" onClick={go('top')} className="brand" aria-label="أحمد علي المرر — إلى الأعلى"><img src="/ahmed.webp" alt="" width={36} height={36} /><span>أحمد علي المرر</span></a>
          <nav className="nav" aria-label="أقسام الصفحة"><ul>{NAV.map(([id, t]) => <li key={id}><a href={'#' + id} onClick={go(id)} aria-current={active === id ? 'true' : undefined} className={active === id ? 'on' : ''}>{t}</a></li>)}</ul></nav>
          <button type="button" className="icon-btn" onClick={() => setDark((d) => !d)} aria-pressed={dark} aria-label={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}>{dark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}</button>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" aria-labelledby="h-name">
          <HeroMesh points={MESH} grain={.2} speed={reduced() ? 0 : .35} className="hero-bg" style={MESH_VARS} />
          <div className="wrap hero-in">
            <div className="hero-photo"><img src="/ahmed.webp" alt="صورة أحمد علي المرر" width={360} height={360} /></div>
            <div className="hero-txt">
              <h1 id="h-name">أحمد علي المرر</h1>
              <p className="hero-en" lang="en" dir="ltr">Ahmed Ali Almarar</p>
              <p className="hero-title">{clean(C.job_title)} · مركز التعليم المستمر، جامعة محمد بن زايد للعلوم الإنسانية</p>
              <p className="hero-tag">{clean(C.tagline.split('|')[1] ?? '')}</p>
              <ul className="hero-meta">
                <li><MapPin className="h-4 w-4" aria-hidden />{C.contacts_loc}</li>
                <li><Languages className="h-4 w-4" aria-hidden />{C.languages}</li>
              </ul>
              <div className="hero-cta">
                <Magnet><a className="btn btn-gold" href="/cv/Ahmed_Almarar_CV_Arabic.pdf" download><Download className="h-5 w-5" aria-hidden />السيرة الذاتية (عربي) PDF</a></Magnet>
                <Magnet><a className="btn btn-ghost" href="/cv/Ahmed_Almarar_CV_English.pdf" download><Download className="h-5 w-5" aria-hidden /><span>CV (English) PDF</span></a></Magnet>
              </div>
              <ul className="quick" aria-label="تواصل سريع">
                <li><a href={`tel:${PHONE.replace(/\s/g, '')}`} aria-label={`اتصال ${PHONE}`}><Phone className="h-5 w-5" aria-hidden /></a></li>
                <li><a href={`mailto:${EMAIL}`} aria-label={`بريد ${EMAIL}`}><Mail className="h-5 w-5" aria-hidden /></a></li>
                <li><a href={LINKEDIN} target="_blank" rel="noopener" aria-label="لينكد إن"><LiIcon /></a></li>
                <li><a href={X_ME} target="_blank" rel="noopener" aria-label="إكس @liwadc"><XIcon /></a></li>
                <li><a href={IG_ME} target="_blank" rel="noopener" aria-label="إنستغرام @liwadc"><IgIcon /></a></li>
              </ul>
            </div>
          </div>
          <div className="wrap">
            <ul className="hero-stats">
              {[[36, 'دورة لغوية حضورية للربع الرابع من 2026'], [4, 'لغات'], [3, 'مستويات'], [150, 'جهة حكومية وخاصة (نحو)'], [CERTS.length, 'رخصة وشهادة']].map(([n, t]) => (
                <li key={t as string}><CountUp to={n as number} className="stat-n" /><span>{t}</span></li>))}
            </ul>
          </div>
        </section>

        <Suspense fallback={<div style={{ minHeight: "200vh" }} />}><Sections toast={show} lenis={lenis} /></Suspense>
      </main>
      <footer className="foot"><div className="wrap">© أحمد علي المرر · <span lang="en" dir="ltr">Ahmed Ali Almarar</span></div></footer>
      {toastEl}
    </div>
  );
}
