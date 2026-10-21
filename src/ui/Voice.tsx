/* audiocn SmoothWaveform fed by audiocn's synthetic "speech" demo signal (no microphone, purely decorative). */
import { SmoothWaveform } from '@/components/ui/smooth-waveform';
import { BarVisualizer } from '@/components/ui/bar-visualizer';
import { useDemoSignal } from '@/hooks/use-demo-signal';
export default function Voice({ bars = false, className = '' }: { bars?: boolean; className?: string }) {
  const signal = useDemoSignal({ kind: 'speech' });
  if (bars) return <BarVisualizer aria-hidden="true" source={signal.visual as any} barCount={48} className={'h-full w-full text-[var(--accent)] ' + className} />;
  return <SmoothWaveform aria-hidden="true" source={signal.visual} lineWidth={2.5} className={'h-full w-full text-[#e0b26a] opacity-80 ' + className} />;
}
