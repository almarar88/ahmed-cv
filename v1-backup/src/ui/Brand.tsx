import { useEffect, useState } from 'react';
import { Moon, Sun, ArrowRight, UserPlus } from 'lucide-react';
import { NeonEdgeLink } from '@/vendor/easyui/ui/NeonEdgeLink';
import { HUB, MAIN } from '../data';

export function DemoBar() {
  return (
    <div className="relative z-40 bg-[#e0b26a] px-4 py-1.5 text-center text-[13px] font-semibold text-[#14201c]">
      نسخة تجريبية <b>Demo v12</b> · تصميم مقترح لأغراض العرض فقط، ليس الموقع الرسمي للجامعة. المحتوى منسوخ من <bdi className="bdi-ltr">mbzuh.ac.ae</bdi> وبوابة المركز.
    </div>
  );
}
export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('mbz-theme', dark ? 'dark' : 'light'); } catch {} }, [dark]);
  return (
    <button type="button" onClick={() => setDark((d) => !d)} aria-pressed={dark} aria-label={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10">
      {dark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
export function TopNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <a href={MAIN} className="flex items-center gap-3 rounded-lg text-white no-underline" aria-label="العودة إلى الموقع الرئيسي للجامعة (نسخة تجريبية)">
          <img src="../assets/img/cec/cec-logo-white.webp" alt="" width={900} height={591} className="h-12 w-auto sm:h-14" />
          <span className="hidden items-center gap-1 text-sm font-semibold text-white/85 md:inline-flex"><ArrowRight className="h-4 w-4" aria-hidden />الموقع الرئيسي</span>
        </a>
        <div className="flex items-center gap-2">
          <a href="../continuous-education.html" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-white/85 underline-offset-4 hover:underline sm:inline">الصفحة الحالية للمركز</a>
          <ThemeToggle />
          <NeonEdgeLink href={HUB} target="_blank" rel="noopener" icon={<UserPlus className="h-4 w-4 text-[#e0b26a]" aria-hidden />} className="hidden sm:inline-flex">
            قم بالتسجيل<span className="sr-only"> (بوابة المركز، تفتح في نافذة جديدة)</span>
          </NeonEdgeLink>
        </div>
      </div>
    </header>
  );
}
