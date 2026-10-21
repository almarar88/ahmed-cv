/* audiocn SmoothWaveform on audiocn's synthetic speech demo signal — decorative "languages" voice line, no microphone. */
import { SmoothWaveform } from '@/components/ui/smooth-waveform';
import { useDemoSignal } from '@/hooks/use-demo-signal';
export default function Voice() {
  const s = useDemoSignal({ kind: 'speech' });
  return <SmoothWaveform aria-hidden="true" source={s.visual} lineWidth={2.5} className="h-full w-full text-[#e0b26a] opacity-80" />;
}
