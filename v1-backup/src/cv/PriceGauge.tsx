/* gauge-ui (MIT) — price of the selected book on the store's own price range. */
import { Gauge, GaugeTrack, GaugeArc, GaugeTicks, GaugeNeedle, GaugeHub, GaugeValue, GaugeText } from '@/components/gauge';
export default function PriceGauge({ value, min, max }: { value: number; min: number; max: number }) {
  return (
    <div className="aspect-square w-full max-w-[260px]" style={{ ['--muted-foreground' as any]: 'var(--muted-foreground)', ['--foreground' as any]: 'var(--foreground)' }}>
      <Gauge value={value} min={min} max={max} padding={22} transition={{ type: 'spring', visualDuration: .8, bounce: .2 }} initialValue={min} aria-label={`سعر الكتاب المختار ${value} درهماً`}>
        <GaugeTrack width={12} color="var(--border)" opacity={1} />
        <GaugeArc width={12} color="var(--accent)" />
        <GaugeTicks count={31} length={6} width={1.3} offset={-20} color="var(--muted-foreground)" opacity={.6} cap="butt" />
        <GaugeNeedle style="pointer" length={.68} width={8} tail={16} color="var(--accent)" />
        <GaugeHub radius={9} color="var(--accent)" />
        <GaugeValue y={80} fontSize={40} font="mono" />
        <GaugeText y={112} fontSize={15} color="var(--muted-foreground)">درهم إماراتي</GaugeText>
      </Gauge>
    </div>
  );
}
