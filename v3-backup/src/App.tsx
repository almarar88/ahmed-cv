/* Ahmed Ali Almarar — CV v2: an immersive WebGL journey (R3F + drei + postprocessing) driven by GSAP ScrollTrigger + Lenis.
   CV content only come from Ahmed's CV (src/data/cv.json). Static fallback for reduced motion / no WebGL. */
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useProgress } from '@react-three/drei';
import { Phone, Mail, MapPin, Award, Briefcase, GraduationCap, Moon, Sun, Volume2, VolumeX, ChevronLeft, ChevronRight, Hand, X as Close, Smartphone, Network, ArrowUp, Link2 } from 'lucide-react';
import { HeroMesh } from '@/registry/blocks/hero-section/hero-mesh';
import { MagneticButton } from '@/vendor/easyui/ui/MagneticButton';
import { NeonEdgeLink } from '@/vendor/easyui/ui/NeonEdgeLink';
import { SpotlightCard } from '@/vendor/easyui/ui/SpotlightCard';
import { Callout } from '@/registry/default/callout/callout';
import { S } from './v2/store';
import { sampleName } from './v2/textures';
import cv from './data/cv.json';
const C = cv.ar as any;
const PHONE = C.contacts[0][1] as string, EMAIL = C.contacts[1][1] as string, LINKEDIN = 'https://www.' + C.linkedin;
const CERTS: { t: string; i: string; g: string }[] = (C.certs as [string, [string, string][]][]).flatMap(([g, items]) => items.map(([t, i]) => ({ t, i: i.replace(/^\s*\(|\)\s*$/g, ''), g: g.replace(/[:：]\s*$/, '') })));
const certCount = CERTS.length;
gsap.registerPlugin(ScrollTrigger);
const World = lazy(() => import('./v2/World'));
const Career = lazy(() => import('./cv/Career'));
const Voice = lazy(() => import('./cv/Voice'));

const X_ME = 'https://x.com/liwadc', IG_ME = 'https://www.instagram.com/liwadc/';
const SECTIONS = [['intro', 'البداية'], ['career', 'المسار'], ['skills', 'التعليم والمهارات'], ['certs', 'الشهادات'], ['contact', 'التواصل']] as const;
const MESH = [{ x: .15, y: .2, spread: .75 }, { x: .85, y: .25, spread: .6 }, { x: .5, y: .85, spread: .9 }, { x: .75, y: .7, spread: .45 }] as const;
const MESH_VARS = { ['--mesh-base' as any]: '#06100d', ['--mesh-1' as any]: '#1d6152', ['--mesh-2' as any]: '#7a5520', ['--mesh-3' as any]: '#0f2a23', ['--mesh-4' as any]: '#4a2440' };
const XIcon = ({ c = 'h-5 w-5' }) => <svg viewBox="0 0 24 24" className={c} fill="currentColor" aria-hidden><path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20Z" /></svg>;
const IgIcon = ({ c = 'h-5 w-5' }) => <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;

function webglOK() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } }

/* ---------- sound: off by default, soft ambient pad + UI ticks (WebAudio) ---------- */
let AC: AudioContext | null = null, pad: GainNode | null = null;
function sound(on: boolean) {
  if (on) {
    AC ??= new AudioContext(); AC.resume();
    if (!pad) { pad = AC.createGain(); pad.gain.value = 0; const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700; f.connect(pad); pad.connect(AC.destination);
      [110, 164.8, 220.5].forEach((hz) => { const o = AC!.createOscillator(); o.type = 'sine'; o.frequency.value = hz; o.connect(f); o.start(); }); }
    pad.gain.setTargetAtTime(.035, AC.currentTime, .8);
  } else if (pad && AC) pad.gain.setTargetAtTime(0, AC.currentTime, .3);
}
function tick() { if (!AC || !pad || pad.gain.value < .01) return; const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = 880; g.gain.value = .04; g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + .12); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + .13); }

/* ---------- custom cursor ---------- */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0, dom = false;
    const mv = (e: PointerEvent) => { x = e.clientX; y = e.clientY; dom = !!(e.target as Element)?.closest?.('a,button,[role=button],summary,input'); };
    const loop = () => { rx += (x - rx) * .18; ry += (y - ry) * .18;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px)`;
      if (ring.current) { ring.current.style.transform = `translate(${rx}px,${ry}px) scale(${S.hover || dom ? 2.2 : 1})`; ring.current.dataset.on = S.hover || dom ? '1' : ''; }
      raf = requestAnimationFrame(loop); };
    addEventListener('pointermove', mv); loop(); document.documentElement.classList.add('has-cursor');
    return () => { removeEventListener('pointermove', mv); cancelAnimationFrame(raf); document.documentElement.classList.remove('has-cursor'); };
  }, []);
  return <><div ref={ring} className="cur-ring" aria-hidden /><div ref={dot} className="cur-dot" aria-hidden /></>;
}

/* magnetic wrapper for anchors (contact) */
function Magnet({ children, strength = .4 }: { children: React.ReactNode; strength?: number }) {
  const r = useRef<HTMLDivElement>(null);
  return <div ref={r} className="magnet" onPointerMove={(e) => { const b = r.current!.getBoundingClientRect(); r.current!.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * strength}px,${(e.clientY - b.top - b.height / 2) * strength}px)`; }} onPointerLeave={() => { r.current!.style.transform = ''; }}>{children}</div>;
}
function Modal({ label, onClose, children, wide }: { label: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLElement>('button')?.focus(); const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [onClose]);
  return <div className="modal" role="dialog" aria-modal="true" aria-label={label} onClick={onClose} data-lenis-prevent>
    <div ref={ref} className={'modal-box ' + (wide ? 'wide' : '')} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="icon-btn modal-x" onClick={onClose} aria-label="إغلاق"><Close className="h-5 w-5" aria-hidden /></button>{children}</div></div>;
}

export default function App() {
  const [staticMode] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches || !webglOK() || new URLSearchParams(location.search).has('static'));
  const mobile = useMemo(() => matchMedia('(max-width: 820px), (pointer: coarse)').matches, []);
  const fine = useMemo(() => matchMedia('(pointer: fine)').matches, []);
  const [night, setNight] = useState(() => document.documentElement.dataset.theme !== 'light');
  const [snd, setSnd] = useState(false);
  const [focus, setFocus] = useState(0);
  const [peleOpen, setPele] = useState(false);
  const [duties, setDuties] = useState(false);
  const [certs, setCerts] = useState(false);
  const [name, setName] = useState<{ pts: Float32Array; aspect: number } | null>(null);
  const [ready, setReady] = useState(staticMode);
  const [station, setStation] = useState(0);
  const [gyroAsk, setGyroAsk] = useState(false);
  const lenis = useRef<Lenis | null>(null);
  const { progress, active } = useProgress();
  S.mobile = mobile;

  useEffect(() => { S.night = night; document.documentElement.dataset.theme = night ? 'dark' : 'light'; try { localStorage.setItem('aam-theme', night ? 'dark' : 'light'); } catch {} }, [night]);
  useEffect(() => { sound(snd); }, [snd]);
  useEffect(() => { S.focus = focus; }, [focus]);

  // name particles
  useEffect(() => { if (staticMode) return; const narrow = innerWidth / innerHeight < .8; sampleName(narrow ? ['أحمد علي', 'المرر'] : ['أحمد علي المرر'], mobile ? 5000 : 14000).then((r) => { (window as any).__name = [r.aspect, r.pts[0], r.pts[1], r.pts.length]; setName(r); }); }, [staticMode, mobile]);
  // loader → morph
  const [minT, setMinT] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMinT(true), 1400); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (staticMode || ready) return;
    if (name && minT && (!active || progress >= 100)) { setReady(true); gsap.to(S.morph, { v: 1, duration: 2.6, ease: 'power3.inOut', delay: .3 }); }
  }, [name, minT, active, progress, staticMode, ready]);

  // Lenis + ScrollTrigger
  useEffect(() => {
    if (staticMode) return;
    const l = new Lenis({ lerp: .09, smoothWheel: true }); lenis.current = l;
    l.on('scroll', ScrollTrigger.update);
    const tk = (t: number) => l.raf(t * 1000); gsap.ticker.add(tk); gsap.ticker.lagSmoothing(0);
    const st = SECTIONS.map(([id], i) => ScrollTrigger.create({ trigger: '#' + id, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => { S.local[i] = self.progress; S.s = i + self.progress; },
      onToggle: (self) => { if (self.isActive) setStation(i); } }));
    // reveal choreography per scene
    const tw = SECTIONS.filter(([id]) => document.querySelector(`#${id} [data-rv]`)).map(([id]) => gsap.fromTo(`#${id} [data-rv]`, { y: 36, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '#' + id, start: 'top 55%', toggleActions: 'play none none reverse' } }));
    // hero copy drifts out as the camera leaves
    const out = gsap.to('#intro .hero-copy', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#intro', start: 'top top', end: 'bottom 60%', scrub: true } });
    return () => { st.forEach((s) => s.kill()); tw.forEach((t) => t.kill()); out.kill(); gsap.ticker.remove(tk); l.destroy(); };
  }, [staticMode]);
  useEffect(() => { if (!staticMode && !ready) lenis.current?.stop(); else lenis.current?.start(); }, [ready, staticMode]);

  // pointer + gyro
  useEffect(() => {
    const mv = (e: PointerEvent) => { if (e.pointerType === 'mouse') { S.mouse.x = e.clientX / innerWidth * 2 - 1; S.mouse.y = -(e.clientY / innerHeight * 2 - 1); S.pm.x = S.mouse.x; S.pm.y = S.mouse.y; } };
    addEventListener('pointermove', mv);
    const go = (e: DeviceOrientationEvent) => { S.gyro.x = clamp((e.gamma ?? 0) / 30) * .8; S.gyro.y = clamp(((e.beta ?? 45) - 45) / 30) * -.5; };
    const DOE = (window as any).DeviceOrientationEvent;
    if (mobile && DOE) { if (typeof DOE.requestPermission === 'function') setGyroAsk(true); else addEventListener('deviceorientation', go); }
    (window as any).__gyro = go;
    return () => { removeEventListener('pointermove', mv); removeEventListener('deviceorientation', go); };
  }, [mobile]);
  const askGyro = async () => { try { const r = await (window as any).DeviceOrientationEvent.requestPermission(); if (r === 'granted') addEventListener('deviceorientation', (window as any).__gyro); } catch {} setGyroAsk(false); };

  // keyboard on the certificate ring
  const step = useCallback((d: number) => { setFocus((f) => (f + d + certCount) % certCount); tick(); }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (station !== 3 || peleOpen || duties || certs) return; if (e.key === 'ArrowLeft') step(1); else if (e.key === 'ArrowRight') step(-1); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [station, peleOpen, duties, certs, step]);

  const jump = (i: number) => { const el = document.getElementById(SECTIONS[i][0])!; if (lenis.current) lenis.current.scrollTo(el, { offset: i ? el.offsetHeight * .25 : 0, duration: 1.6 }); else el.scrollIntoView(); };

  return (
    <div className={'app ' + (staticMode ? 'is-static' : 'is-3d')}>
      <a href="#career" className="skip">تخطَّ إلى المحتوى</a>
      {!staticMode && <Suspense fallback={null}><World name={name} certs={CERTS} onPick={(i) => { setFocus(i); tick(); }} mobile={mobile} /></Suspense>}
      {fine && !staticMode && <Cursor />}

      {/* loader */}
      {!staticMode && (
        <div className={'loader ' + (ready ? 'done' : '')} aria-hidden={ready} role="status">
          <HeroMesh points={MESH} grain={.3} speed={.4} style={MESH_VARS} />
          <div className="relative z-10 text-center">
            <p className="loader-num font-display" aria-live="polite">{Math.round(ready ? 100 : Math.min(progress, name ? 99 : 80))}<span>%</span></p>
            <p className="m-0 text-lg text-[#e7ece9]">أحمد علي المرر</p>
          </div>
        </div>
      )}

      {/* HUD */}
      <header className="hud-top">
        <button type="button" className="mono font-display" onClick={() => jump(0)} aria-label="العودة إلى البداية">أ.م</button>
        <nav aria-label="مشاهد الرحلة"><ol className="dots">
          {SECTIONS.map(([id, t], i) => <li key={id}><button type="button" onClick={() => jump(i)} aria-current={station === i ? 'step' : undefined} className={station === i ? 'on' : ''}><span className="dot" aria-hidden /><span className="lbl">{t}</span></button></li>)}
        </ol></nav>
        <div className="flex items-center gap-2">
          {gyroAsk && <button type="button" className="icon-btn" onClick={askGyro} aria-label="تفعيل إمالة الجهاز"><Smartphone className="h-5 w-5" aria-hidden /></button>}
          {!staticMode && <button type="button" className="icon-btn snd" onClick={() => setSnd((v) => !v)} aria-pressed={snd} aria-label={snd ? 'إيقاف الصوت' : 'تشغيل الصوت'}>
            {snd ? <><Volume2 className="h-5 w-5" aria-hidden /><span className="snd-wave"><Suspense fallback={null}><Voice /></Suspense></span></> : <VolumeX className="h-5 w-5" aria-hidden />}
          </button>}
          <button type="button" className="icon-btn" onClick={() => { setNight((n) => !n); tick(); }} aria-pressed={!night} aria-label={night ? 'وضع النهار' : 'وضع الليل'}>{night ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}</button>
        </div>
      </header>

      <main>
        {/* 1 · INTRO */}
        <section id="intro" className="sec h-intro" aria-labelledby="h-name">
          <div className="pin">
            {staticMode && <HeroMesh points={MESH} grain={.25} speed={0} className="-z-10" style={MESH_VARS} />}
            <h1 id="h-name" className={staticMode ? 'static-name font-display' : 'sr-only'}>أحمد علي المرر <span lang="en" dir="ltr" className="mt-[.5em] block text-[.32em] font-bold leading-tight text-[#e0b26a]">Ahmed Ali Almarar</span></h1>
            <div className="hero-copy">
              <img src="/ahmed.webp" alt="صورة أحمد علي المرر" width={360} height={360} className="avatar" />
              {!staticMode && <p className="m-0 mb-2 text-sm font-semibold tracking-normal text-[var(--gold)]" lang="en" dir="ltr">Ahmed Ali Almarar</p>}
              <p className="hero-role">ضابط لغات · مركز التعليم المستمر، جامعة محمد بن زايد للعلوم الإنسانية</p>
              <p className="hint mt-1">{C.tagline.replace(/\s+/g, ' ').split('|')[1]?.trim()}</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <MagneticButton variant="primary" size="lg" glow className="gold-btn" onClick={() => jump(1)}>ابدأ الرحلة</MagneticButton>
                <NeonEdgeLink href={LINKEDIN} target="_blank" rel="noopener" icon={<Link2 className="h-4 w-4 text-[#e0b26a]" aria-hidden />}>لينكد إن<span className="sr-only"> (نافذة جديدة)</span></NeonEdgeLink>
                <a href={X_ME} target="_blank" rel="noopener" className="soc" aria-label="أحمد على إكس @liwadc"><XIcon /></a>
                <a href={IG_ME} target="_blank" rel="noopener" className="soc" aria-label="أحمد على إنستغرام @liwadc"><IgIcon /></a>
              </div>
              {!staticMode && <p className="hint mt-6">مرّر للأسفل لتطير الكاميرا · حرّك المؤشر فوق الاسم</p>}
            </div>
          </div>
        </section>

        {/* 2 · CAREER */}
        <section id="career" className="sec h-career" aria-labelledby="h-career">
          <div className="pin">
            <div className="hud-panel hud-bottom">
              <p data-rv className="kicker">01 · المسار المهني</p>
              <h2 data-rv id="h-career" className="h2">ضابط لغات · منذ مايو 2025</h2>
              <ul data-rv className={staticMode ? 'tl' : 'sr-only'}>
                <li><b>منذ مايو 2025 · ضابط لغات</b><span>قسم اللغات، مركز التعليم المستمر، جامعة محمد بن زايد للعلوم الإنسانية <span lang="en" dir="ltr">(Languages Officer)</span></span></li>
                <li><b>{C.edu[0][0]}</b><span>{C.edu[0][2]} · {C.edu[0][1].replace('|', '').trim()}</span></li>
              </ul>
              <ul data-rv className="kpis" aria-label="أبرز الأرقام">
                <li><b>36</b><span>دورة لغوية حضورية · الربع الرابع 2026</span></li>
                <li><b>4</b><span>لغات · 3 مستويات</span></li>
                <li><b>150~</b><span>جهة حكومية وخاصة في حملة التواصل</span></li>
              </ul>
              <div data-rv className="flex flex-wrap gap-2">
                <button type="button" className="chip" onClick={() => setDuties(true)}><Briefcase className="h-4 w-4" aria-hidden />المهام والإنجازات</button>
                <button type="button" className="chip" onClick={() => setPele(true)}><Network className="h-4 w-4" aria-hidden />خريطة المسار</button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 · EDUCATION & SKILLS (from the CV) */}
        <section id="skills" className="sec h-pending" aria-labelledby="h-edu">
          <div className="pin">
            <div className="hud-panel hud-center" data-lenis-prevent>
              <p data-rv className="kicker">02 · المؤهلات</p>
              <h2 data-rv id="h-edu" className="h2">التعليم والمهارات</h2>
              <div data-rv className="mt-4 grid gap-5 md:grid-cols-2">
                <div className="grid gap-3 content-start"><h3 className="h3 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-[var(--gold)]" aria-hidden />المؤهلات العلمية</h3>
                  {C.edu.map((e: string[], k: number) => <div key={k} className="edu"><span className="edu-when">{e[1].replace('|', '').trim()}</span><b>{e[0]}</b><span>{e[2]}</span><span className="text-[var(--gold)]">{e[3].replace(/^\s*—\s*/, '')}</span></div>)}
                </div>
                <div className="grid gap-3 content-start">
                  {C.skills.map((s: string[], k: number) => <div key={k} className="skill"><h3 className="h3">{s[0].replace(/[:：]\s*$/, '')}</h3><ul className="tags">{s[1].split(' · ').map((t: string) => <li key={t}>{t}</li>)}</ul></div>)}
                </div>
              </div>
              <div data-rv className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="skill"><h3 className="h3">المهارات التقنية والرقمية</h3><p className="m-0 text-[.95rem]">{C.ai_skill}</p><ul className="tags mt-2">{C.tech.split(' · ').map((t: string) => <li key={t}>{t}</li>)}</ul></div>
                <div className="skill"><h3 className="h3">اللغات</h3><ul className="tags">{C.languages.split(' · ').map((t: string) => <li key={t}>{t}</li>)}</ul>
                  <h3 className="h3 mt-3">الاهتمامات المهنية</h3><ul className="tags">{C.interests.split(' · ').map((t: string) => <li key={t}>{t}</li>)}</ul></div>
                <div className="skill"><h3 className="h3">الدورات وورش العمل</h3><ul className="tags">{C.training.map((t: string[]) => <li key={t[0]}>{t[0]}{t[1]}</li>)}</ul></div>
              </div>
              <div data-rv className="mt-4"><Callout type="tip" title="المشاركة المجتمعية" className="mdx-ar">{C.community[0]}</Callout></div>
              <div data-rv className="mt-4 flex justify-center"><button type="button" className="chip" onClick={() => setCerts(true)}><Award className="h-4 w-4" aria-hidden />الرخص والشهادات ({certCount})</button></div>
            </div>
          </div>
        </section>

        {/* 4 · CERTIFICATES — 3D ring of cards */}
        <section id="certs" className="sec h-gallery" aria-labelledby="h-certs">
          <div className="pin">
            <div className="hud-panel hud-start">
              <p data-rv className="kicker">03 · التطوير المهني</p>
              <h2 data-rv id="h-certs" className="h2">الرخص والشهادات</h2>
              <p data-rv className="m-0 mt-1 text-[var(--muted)]">{certCount} شهادة في {C.certs.length} مجالات</p>
              <button data-rv type="button" className="chip" onClick={() => setCerts(true)}><Award className="h-4 w-4" aria-hidden />القائمة الكاملة</button>
            </div>
            {staticMode
              ? <ul className="static-certs">{CERTS.map((c) => <li key={c.t}><span className="kicker">{c.g}</span><b>{c.t}</b><span>{c.i}</span></li>)}</ul>
              : <SpotlightCard spotlightColor="rgba(224,178,106,.18)" className="cert-card" aria-live="polite">
                  <p className="kicker m-0">{c(focus).g} · {focus + 1} / {certCount}</p>
                  <h3 className="font-display m-0 mt-1 text-[clamp(1.05rem,2vw,1.4rem)] leading-snug" dir="auto">{c(focus).t}</h3>
                  <p className="m-0 text-[var(--muted)]" dir="auto">{c(focus).i}</p>
                  <div className="flex items-center justify-center gap-2">
                    <button type="button" className="icon-btn lg" onClick={() => step(-1)} aria-label="الشهادة السابقة"><ChevronRight className="h-6 w-6" aria-hidden /></button>
                    <p className="hint m-0 flex-1"><Hand className="inline h-4 w-4" aria-hidden /> اسحب الحلقة · انقر بطاقة · الأسهم</p>
                    <button type="button" className="icon-btn lg" onClick={() => step(1)} aria-label="الشهادة التالية"><ChevronLeft className="h-6 w-6" aria-hidden /></button>
                  </div>
                </SpotlightCard>}
          </div>
        </section>

        {/* 5 · CONTACT */}
        <section id="contact" className="sec h-contact" aria-labelledby="h-contact">
          <div className="pin">
            <div className="hud-panel hud-center text-center">
              <p data-rv className="kicker">04 · التواصل</p>
              <h2 data-rv id="h-contact" className="h2">لنتواصل</h2>
              <div data-rv className="mt-6 flex flex-wrap items-center justify-center gap-5">
                <Magnet><a href={X_ME} target="_blank" rel="noopener" className="big-soc"><XIcon c="h-7 w-7" /><bdi className="bdi-ltr">@liwadc</bdi><span className="sr-only"> على إكس</span></a></Magnet>
                <Magnet><a href={IG_ME} target="_blank" rel="noopener" className="big-soc"><IgIcon c="h-7 w-7" /><bdi className="bdi-ltr">@liwadc</bdi><span className="sr-only"> على إنستغرام</span></a></Magnet>
              </div>
              <ul data-rv className="contact-list">
                <li><a href={`tel:${PHONE.replace(/\s/g, '')}`}><Phone className="h-5 w-5" aria-hidden /><bdi className="bdi-ltr">{PHONE}</bdi></a></li>
                <li><a href={`mailto:${EMAIL}`}><Mail className="h-5 w-5" aria-hidden /><bdi className="bdi-ltr">{EMAIL}</bdi></a></li>
                <li><a href={LINKEDIN} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4V9Z"/></svg>لينكد إن<span className="sr-only"> (نافذة جديدة)</span></a></li>
                <li><span><MapPin className="h-5 w-5" aria-hidden />{C.contacts_loc}</span></li>
              </ul>
              <div data-rv className="mt-6 flex justify-center"><MagneticButton variant="outline" size="md" onClick={() => jump(0)} className="ghost-btn"><ArrowUp className="h-4 w-4" aria-hidden />عودة إلى البداية</MagneticButton></div>
              <p className="mt-6 text-sm text-[var(--muted)]">© أحمد علي المرر · <span lang="en">Ahmed Ali Almarar</span></p>
            </div>
          </div>
        </section>
      </main>

      {peleOpen && <Modal label="خريطة المسار" onClose={() => setPele(false)} wide><h2 className="h2 mb-4">خريطة المسار</h2><Suspense fallback={<div className="h-[300px]" />}><Career /></Suspense></Modal>}
      {duties && <Modal label="المهام والإنجازات" onClose={() => setDuties(false)} wide>
        <h2 className="h2">{C.job_title} <span className="text-[var(--gold)] text-[.6em]">{C.job_when.replace('|', '').trim()}</span></h2>
        <p className="mt-1 text-[var(--muted)]">{C.job_org}</p>
        <h3 className="h3 mt-4">الملخص المهني</h3><p className="m-0">{C.summary}</p>
        <h3 className="h3 mt-4">المهام</h3><ul className="bul">{C.job_bullets.map((t: string) => <li key={t}>{t}</li>)}</ul>
        <h3 className="h3 mt-4">أبرز الإنجازات</h3><ul className="bul">{C.achievements.map((t: string) => <li key={t}>{t}</li>)}</ul>
      </Modal>}
      {certs && <Modal label="الرخص والشهادات" onClose={() => setCerts(false)} wide>
        <h2 className="h2 mb-2">الرخص والشهادات · {certCount}</h2>
        {C.certs.map(([g, items]: [string, string[][]]) => <div key={g} className="mt-4"><h3 className="h3">{g.replace(/[:：]\s*$/, '')}</h3><ul className="bul">{items.map((it) => <li key={it[0]}>{it[0]}<span className="text-[var(--muted)]">{it[1]}</span></li>)}</ul></div>)}
      </Modal>}
    </div>
  );
}
function c(i: number) { return CERTS[i]; }
function clamp(v: number) { return Math.max(-1, Math.min(1, v)); }
