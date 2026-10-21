/* Arc LogoMarquee (MIT, uiarc.dev) with the centre's six partners (logos from the official CE page). */
import { LogoMarquee } from '@/registry/blocks/logo-marquee/logo-marquee';
export default function Partners({ items, title, lead }: { items: { name: string; img: string }[]; title: string; lead: string }) {
  return (
    <div className="partners-marquee">
      <LogoMarquee tone="color" title={title} description={lead} brands={items.map((p) => ({ name: p.name, icon: p.img, colorIcon: p.img }))} />
    </div>
  );
}
