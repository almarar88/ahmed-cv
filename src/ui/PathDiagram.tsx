/* Pele (MIT, github.com/obsidianmd/pele) — Mermaid-syntax diagram rendered to themeable SVG (themed by --pele-* vars in styles.css).
   Every node is taken from the CE page text: the three published steps and the 12-trainee quorum clause. */
import { useEffect, useRef } from 'react';
const SRC = `flowchart RL
  A[اختر البرنامج] --> B[سجّل عبر بوابة المركز]
  B --> C{اكتمال النصاب: 12 متدرباً؟}
  C -->|نعم| D([تُعقد الدورة])`;
export default function PathDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let m: any, dead = false;
    import('pele/lazy').then(({ mountAsync }) => {
      if (dead || !ref.current) return;
      return mountAsync(ref.current, SRC, { fontFamily: 'IBM Plex Sans Arabic, sans-serif', fontSize: 15, responsive: true, autoDirection: true, directionBreakpoint: 640, zoom: false }).then((x) => { m = x; });
    }).catch(() => {});
    return () => { dead = true; m?.destroy?.(); };
  }, []);
  return <div ref={ref} className="pele-host mx-auto w-full max-w-[920px]" role="img" aria-label="مسار المتدرب: اختر البرنامج، ثم سجّل عبر بوابة المركز، ثم تُعقد الدورة عند اكتمال النصاب بعدد 12 متدرباً." />;
}
