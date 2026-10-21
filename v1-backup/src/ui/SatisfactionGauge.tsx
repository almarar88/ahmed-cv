/* gauge-ui (MIT, github.com/thordursk/gauge-ui) — composable SVG gauge. Only the 93% satisfaction figure is a true
   percentage, so it is the only value drawn on a scale. */
import { Gauge, GaugeTrack, GaugeArc, GaugeTicks, GaugeTickLabels, GaugeNeedle, GaugeHub, GaugeValue, GaugeText } from '@/components/gauge';
export default function SatisfactionGauge() {
  return (
    <figure className="m-0 rounded-[32px] border border-white/10 bg-[radial-gradient(120%_90%_at_50%_0%,#17241f,#0b1411)] p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)]">
      <div className="aspect-square w-full text-[#f1ede5]" style={{ ['--muted-foreground' as any]: '#aab4af', ['--foreground' as any]: '#f1ede5' }}>
        <Gauge value={93} min={0} max={100} padding={26} transition={{ type: 'spring', visualDuration: 1.4, bounce: 0 }} initialValue={0} aria-label="نسبة الرضا العام 93 بالمئة">
          <GaugeTrack width={14} color="#24332d" opacity={1} />
          <GaugeArc width={14} color="#e0b26a" />
          <GaugeTicks count={51} length={7} width={1.4} offset={-22} color="#aab4af" opacity={0.6} cap="butt" />
          <GaugeTicks count={11} length={15} width={2.6} offset={-22} color="#f1ede5" cap="butt" />
          <GaugeTickLabels count={5} offset={-56} fontSize={15} weight="semibold" />
          <GaugeNeedle style="pointer" length={0.7} width={9} tail={18} color="#f3d9a6" />
          <GaugeHub radius={10} color="#e0b26a" />
          <GaugeValue y={84} fontSize={46} font="mono" suffix="%" />
          <GaugeText y={118} fontSize={15} color="#cfd6d2">نسبة الرضا العام</GaugeText>
        </Gauge>
      </div>
      <figcaption className="mt-2 text-center text-sm text-[#cfd6d2]">مقياس من 0 إلى 100%</figcaption>
    </figure>
  );
}
