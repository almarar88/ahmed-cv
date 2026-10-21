/* Mount children only when they approach the viewport (keeps WebGL, canvas visualisers and the diagram engine off the critical path). */
import { useEffect, useRef, useState, type ReactNode } from 'react';
export function WhenVisible({ children, minHeight = 200, margin = '300px', className }: { children: ReactNode; minHeight?: number; margin?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window)) { setOn(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setOn(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el); return () => io.disconnect();
  }, [margin]);
  return <div ref={ref} className={className} style={on ? undefined : { minHeight }}>{on ? children : null}</div>;
}
