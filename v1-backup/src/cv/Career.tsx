/* pele (MIT) — interactive career-path diagram. Nodes are only verified facts. */
import { useEffect, useRef } from 'react';
const SRC = `flowchart RL
  A([أحمد علي المرر]) --> B[مؤسس مؤسسة الكود]
  A --> C[ضابط لغات · منذ مايو 2025]
  C --> D[قسم اللغات]
  D --> E[مركز التعليم المستمر]
  E --> F[جامعة محمد بن زايد للعلوم الإنسانية]
  B --> G[(متجر alcode.ae)]`;
export default function Career() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let m: any, dead = false;
    import('pele/lazy').then(({ mountAsync }) => {
      if (dead || !ref.current) return;
      return mountAsync(ref.current, SRC, { fontFamily: 'IBM Plex Sans Arabic, sans-serif', fontSize: 15, responsive: true, autoDirection: true, directionBreakpoint: 700, zoom: false }).then((x: any) => { m = x; });
    }).catch(() => {});
    return () => { dead = true; m?.destroy?.(); };
  }, []);
  return <div ref={ref} className="pele-host mx-auto w-full max-w-[980px]" role="img" aria-label="المسار المهني: أحمد علي المرر مؤسس مؤسسة الكود ومتجرها alcode.ae، ويعمل ضابط لغات منذ مايو 2025 في قسم اللغات بمركز التعليم المستمر في جامعة محمد بن زايد للعلوم الإنسانية." />;
}
