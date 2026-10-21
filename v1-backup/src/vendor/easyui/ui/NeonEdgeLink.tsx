/* Anchor variant of easyui NeonEdgeButton (MIT © 2026 Suraj Maurya, github.com/Surajmaurya1/easyui).
   Same rotating conic "edge beam" markup; renders <a>, takes an icon, gold beam for MBZUH. */
import React from 'react';
import { cn } from '../lib/utils';

export interface NeonEdgeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  speed?: number;
  glow?: boolean;
  size?: 'md' | 'lg';
}

export const NeonEdgeLink: React.FC<NeonEdgeLinkProps> = ({ children, icon, speed = 1, glow = true, size = 'md', className, ...props }) => {
  const duration = `${3 / speed}s`;
  return (
    <a
      className={cn(
        'focus-ring group relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-[14px] p-[1.5px] font-bold text-[#FAFAFA] no-underline transition-all active:scale-[0.98]',
        size === 'lg' ? 'text-lg' : 'text-[15px]',
        glow && 'shadow-[0_0_34px_-8px_rgba(224,178,106,0.75)]',
        className
      )}
      {...props}
    >
      <style>{`
        @keyframes easyui-neon-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .easyui-neon-beam { animation: none !important; opacity: 0.55 !important; } }
      `}</style>
      <span aria-hidden="true" className="pointer-events-none absolute -inset-[200%] overflow-hidden">
        <span
          className="easyui-neon-beam absolute inset-0 block"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 250deg, rgba(243,217,166,0.95) 320deg, #e0b26a 345deg, transparent 360deg)',
            animation: `easyui-neon-rotate ${duration} linear infinite`,
          }}
        />
      </span>
      <span className={cn('relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-[12.5px] bg-[#0b1411] transition-colors group-hover:bg-[#13201b]',
        size === 'lg' ? 'min-h-[54px] px-7' : 'min-h-[44px] px-5')}>
        {icon}
        <span className="select-none">{children}</span>
      </span>
    </a>
  );
};
export default NeonEdgeLink;
