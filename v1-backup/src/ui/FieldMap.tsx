/* Arc Treemap (MIT, uiarc.dev) — the seven training fields sized by how many programmes each contains (real catalogue counts). */
import { Treemap } from '@/registry/components/treemap/treemap';
export default function FieldMap({ cats }: { cats: { id: string; label: string; count: number }[] }) {
  return (
    <div className="fieldmap">
      <Treemap label="البرامج حسب المجال" formatValue={(v) => `${v} برامج`}
        data={{ id: 'root', label: 'كل المجالات', children: cats.map((c) => ({ id: c.id, label: c.label, value: c.count })) }} height={360} />
    </div>
  );
}
