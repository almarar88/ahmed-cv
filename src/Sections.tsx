/* CV v4 sections below the hero — easyui MagneticButton, SpotlightCard, NeonEdgeLink · gauge-ui Gauge · mdxcn Callout. */
import { useMemo, useState, type MutableRefObject } from 'react';
import type Lenis from 'lenis';
import { Phone, Mail, MapPin, Copy, Check, Download, Moon, Sun, Briefcase, GraduationCap, School, Award, Search, Sparkles, Languages, Wrench, Users, Lightbulb, HeartHandshake, ArrowUp, CalendarDays, Trophy, FileCheck2, Database, ClipboardCheck, Megaphone, BookOpenCheck, Link2 } from 'lucide-react';
import { MagneticButton } from '@/vendor/easyui/ui/MagneticButton';
import { SpotlightCard } from '@/vendor/easyui/ui/SpotlightCard';
import { NeonEdgeLink } from '@/vendor/easyui/ui/NeonEdgeLink';
import { Callout } from '@/registry/default/callout/callout';
import { Gauge, GaugeTrack, GaugeArc, GaugeValue, GaugeText } from '@/components/gauge';
import { C, CERTS, GROUPS, PHONE, EMAIL, LINKEDIN, X_ME, IG_ME, ACH_ICONS, ACH_NUM, XIcon, IgIcon, LiIcon, CountUp, Tilt, Magnet, SectionHead, CopyBtn, Reveal, clean, noColon } from './shared';

export default function Sections({ toast: show, lenis }: { toast: (m: string) => void; lenis: MutableRefObject<Lenis | null> }) {
  const [group, setGroup] = useState<string>('الكل');
  const [q, setQ] = useState('');
  const shown = useMemo(() => CERTS.filter((c) => (group === 'الكل' || c.g === group) && (!q.trim() || (c.t + ' ' + c.i).toLowerCase().includes(q.trim().toLowerCase()))), [group, q]);
  return (<>
        {/* SUMMARY */}
        <section id="summary" className="sec"><div className="wrap">
          <SectionHead n="01" title="الملخص المهني" icon={Sparkles} />
          <Reveal><p className="lead">{C.summary}</p></Reveal>
        </div></section>

        {/* CURRENT ROLE */}
        <section id="role" className="sec alt"><div className="wrap">
          <SectionHead n="02" title="الدور الحالي" icon={Briefcase} />
          <Reveal><SpotlightCard spotlightColor="rgba(224,178,106,.16)" className="role-card">
            <div className="role-top">
              <div><h3 className="role-title">{clean(C.job_title)}</h3><p className="role-org">{C.job_org}</p></div>
              <span className="badge"><CalendarDays className="h-4 w-4" aria-hidden />{clean(C.job_when)}</span>
            </div>
            <ol className="duties">{C.job_bullets.map((t: string, k: number) => <li key={k}><span className="duty-n" aria-hidden>{k + 1}</span><p>{t}</p></li>)}</ol>
          </SpotlightCard></Reveal>
        </div></section>

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="sec"><div className="wrap">
          <SectionHead n="03" title="أبرز الإنجازات" icon={Trophy} />
          <ul className="ach">
            {C.achievements.map((t: string, k: number) => { const I = ACH_ICONS[k]; const num = ACH_NUM[k]; return (
              <Reveal as="li" key={k} delay={k * 60}><Tilt className="ach-card">
                <span className="ach-ico"><I className="h-6 w-6" aria-hidden /></span>
                {num && <p className="ach-num">{num.pre}<CountUp to={num.n} /> <small>{num.unit}</small></p>}
                <p className="ach-t">{t}</p>
              </Tilt></Reveal>); })}
          </ul>
        </div></section>

        {/* TIMELINE */}
        <section id="timeline" className="sec alt"><div className="wrap">
          <SectionHead n="04" title="المسار المهني والتعليمي" icon={GraduationCap} />
          <ol className="tl">
            <Reveal as="li" className="tl-item"><span className="tl-dot"><Briefcase className="h-5 w-5" aria-hidden /></span><Tilt className="tl-card">
              <span className="badge">{clean(C.job_when)}</span><h3>{clean(C.job_title)}</h3><p>{C.job_org}</p></Tilt></Reveal>
            {C.edu.map((e: string[], k: number) => (
              <Reveal as="li" key={k} className="tl-item"><span className="tl-dot">{k === 0 ? <GraduationCap className="h-5 w-5" aria-hidden /> : <School className="h-5 w-5" aria-hidden />}</span><Tilt className="tl-card tl-edu">
                <div><span className="badge">{clean(e[1])}</span><h3>{e[0]}</h3><p>{e[2]}</p><p className="tl-grade">{clean(e[3])}</p></div>
                {k === 1 && <div className="tl-gauge" aria-hidden><Gauge value={81} min={0} max={100} padding={18} initialValue={0} transition={{ type: 'spring', visualDuration: 1.2, bounce: 0 }}>
                  <GaugeTrack width={16} color="var(--line)" opacity={1} /><GaugeArc width={16} color="var(--gold)" /><GaugeValue y={14} fontSize={58} weight="bold" color="var(--fg)" format={(v) => Math.round(v) + "%"} /><GaugeText y={58} fontSize={26} color="var(--muted)">النسبة</GaugeText></Gauge></div>}
              </Tilt></Reveal>))}
          </ol>
        </div></section>

        {/* SKILLS */}
        <section id="skills" className="sec"><div className="wrap">
          <SectionHead n="05" title="الكفاءات والمهارات" icon={Wrench} />
          <div className="skills">
            {C.skills.map((s: string[], k: number) => (
              <Reveal key={k} delay={k * 60}><Tilt className="skill-card"><h3>{noColon(s[0])}</h3><ul className="chips">{s[1].split(' · ').map((t: string) => <li key={t}>{t}</li>)}</ul></Tilt></Reveal>))}
            <Reveal><Tilt className="skill-card wide"><h3>{'الذكاء الاصطناعي'}</h3><p>{C.ai_skill}</p>
              <h3 className="mt">الأدوات</h3><ul className="chips">{C.tech.split(' · ').map((t: string) => <li key={t}>{t}</li>)}</ul></Tilt></Reveal>
            <Reveal><Tilt className="skill-card"><h3>اللغات</h3><ul className="chips big">{C.languages.split(' · ').map((t: string) => <li key={t}>{t}</li>)}</ul>
              <h3 className="mt">الاهتمامات المهنية</h3><ul className="chips">{C.interests.split(' · ').map((t: string) => <li key={t}>{t}</li>)}</ul></Tilt></Reveal>
          </div>
        </div></section>

        {/* CERTIFICATES */}
        <section id="certs" className="sec alt"><div className="wrap">
          <SectionHead n="06" title="الرخص والشهادات" icon={Award} sub={`${CERTS.length} شهادة في ${GROUPS.length} مجالات`} />
          <Reveal className="filters">
            <div className="fchips" role="group" aria-label="تصفية حسب المجال">
              {['الكل', ...GROUPS].map((g) => { const n = g === 'الكل' ? CERTS.length : CERTS.filter((c) => c.g === g).length;
                return <button key={g} type="button" aria-pressed={group === g} className={group === g ? 'on' : ''} onClick={() => setGroup(g)}>{g} <span>{n}</span></button>; })}
            </div>
            <label className="search"><Search className="h-5 w-5" aria-hidden /><span className="sr-only">ابحث في الشهادات</span>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الشهادة أو الجهة…" /></label>
          </Reveal>
          <p className="fcount" aria-live="polite">يُعرض {shown.length} من {CERTS.length}</p>
          <ul className="certs">
            {shown.map((c) => <li key={c.t} className="cert"><Tilt className="cert-in"><span className="cert-g">{c.g}</span><h3 dir="auto">{c.t}</h3><p dir="auto">{c.i}</p></Tilt></li>)}
            {!shown.length && <li className="cert-none">لا توجد نتائج مطابقة.</li>}
          </ul>
        </div></section>

        {/* TRAINING + COMMUNITY */}
        <section id="training" className="sec"><div className="wrap">
          <SectionHead n="07" title="الدورات وورش العمل" icon={BookOpenCheck} />
          <Reveal><ul className="chips big">{C.training.map((t: string[]) => <li key={t[0]}>{t[0]}{t[1]}</li>)}</ul></Reveal>
          <div className="mt-lg"><SectionHead n="08" title="المشاركة المجتمعية" icon={HeartHandshake} /></div>
          <Reveal><Callout type="tip" title="مسابقة «شاعر بيرق الظفرة» (2026)" className="mdx-ar community">{C.community[0]}</Callout></Reveal>
        </div></section>

        {/* CONTACT */}
        <section id="contact" className="sec alt"><div className="wrap">
          <SectionHead n="09" title="التواصل" icon={Users} />
          <div className="contact">
            <Reveal><Tilt className="c-card"><Phone className="h-6 w-6" aria-hidden /><div><p className="c-l">الهاتف</p><a href={`tel:${PHONE.replace(/\s/g, '')}`} className="c-v"><bdi dir="ltr">{PHONE}</bdi></a></div><CopyBtn value={PHONE} label="رقم الهاتف" toast={show} /></Tilt></Reveal>
            <Reveal><Tilt className="c-card"><Mail className="h-6 w-6" aria-hidden /><div><p className="c-l">البريد الإلكتروني</p><a href={`mailto:${EMAIL}`} className="c-v"><bdi dir="ltr">{EMAIL}</bdi></a></div><CopyBtn value={EMAIL} label="البريد الإلكتروني" toast={show} /></Tilt></Reveal>
            <Reveal><Tilt className="c-card"><MapPin className="h-6 w-6" aria-hidden /><div><p className="c-l">الموقع</p><p className="c-v">{C.contacts_loc}</p></div></Tilt></Reveal>
            <Reveal><Tilt className="c-card"><LiIcon c="h-6 w-6" /><div><p className="c-l">لينكد إن</p><a href={LINKEDIN} target="_blank" rel="noopener" className="c-v"><bdi dir="ltr">{C.linkedin}</bdi></a></div></Tilt></Reveal>
          </div>
          <Reveal className="socials">
            <NeonEdgeLink href={X_ME} target="_blank" rel="noopener" icon={<XIcon c="h-4 w-4" />}><bdi dir="ltr">@liwadc</bdi><span className="sr-only"> على إكس</span></NeonEdgeLink>
            <NeonEdgeLink href={IG_ME} target="_blank" rel="noopener" icon={<IgIcon c="h-4 w-4" />}><bdi dir="ltr">@liwadc</bdi><span className="sr-only"> على إنستغرام</span></NeonEdgeLink>
            <Magnet><a className="btn btn-gold" href="/cv/Ahmed_Almarar_CV_Arabic.pdf" download><Download className="h-5 w-5" aria-hidden />تحميل السيرة الذاتية</a></Magnet>
          </Reveal>
          <div className="totop"><MagneticButton variant="outline" size="md" className="ghost-mag" onClick={() => (lenis.current ? lenis.current.scrollTo(0) : scrollTo(0, 0))}><ArrowUp className="h-4 w-4" aria-hidden />إلى الأعلى</MagneticButton></div>
        </div></section>
  </>);
}
