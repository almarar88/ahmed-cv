import * as THREE from 'three';
/* Sample the Arabic name (rendered with the self-hosted Noto Kufi Arabic) into particle targets. */
export async function sampleName(lines: string[], n: number): Promise<{ pts: Float32Array; aspect: number }> {
  try { await document.fonts.load('800 120px "Noto Kufi Arabic"', 'أحمد علي المرر'); } catch {}
  const W = 1400, LH = 300, H = LH * lines.length + 80;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true })!;
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; (x as any).direction = 'rtl';
  let fs = 230; x.font = `800 ${fs}px "Noto Kufi Arabic"`;
  const widest = Math.max(...lines.map((l) => x.measureText(l).width));
  if (widest > W * .94) { fs = fs * W * .94 / widest; x.font = `800 ${fs}px "Noto Kufi Arabic"`; }
  lines.forEach((l, i) => x.fillText(l, W / 2, 40 + LH * i + LH / 2));
  const d = x.getImageData(0, 0, W, H).data; const cand: number[] = [];
  for (let y = 0; y < H; y += 2) for (let X = 0; X < W; X += 2) if (d[(y * W + X) * 4 + 3] > 128) cand.push(X, y);
  // tight bbox
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let i = 0; i < cand.length; i += 2) { minX = Math.min(minX, cand[i]); maxX = Math.max(maxX, cand[i]); minY = Math.min(minY, cand[i + 1]); maxY = Math.max(maxY, cand[i + 1]); }
  const bw = maxX - minX, bh = maxY - minY, pts = new Float32Array(n * 3), m = cand.length / 2;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * m) * 2;
    pts[i * 3] = ((cand[k] - minX) / bw - .5) + (Math.random() - .5) * .002;
    pts[i * 3 + 1] = -((cand[k + 1] - minY) / bw - bh / bw / 2);
    pts[i * 3 + 2] = (Math.random() - .5) * .02;
  }
  return { pts, aspect: bh / bw };
}
function wrap(x: CanvasRenderingContext2D, t: string, w: number) {
  const out: string[] = []; let cur = '';
  for (const word of t.split(' ')) { const tr = cur ? cur + ' ' + word : word; if (x.measureText(tr).width > w && cur) { out.push(cur); cur = word; } else cur = tr; }
  if (cur) out.push(cur); return out;
}
export type Line = { t: string; size: number; weight?: number; color: string; font?: 'kufi' | 'plex'; gap?: number; ltr?: boolean };
/* Crisp canvas texture for 3D panels — Arabic shaping by the browser, solid high-contrast colours. */
export function textTexture(lines: Line[], W: number, H: number, bg: string, border?: string) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d')!;
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  if (border) { x.strokeStyle = border; x.lineWidth = 6; x.strokeRect(18, 18, W - 36, H - 36); }
  let y = 70; const pad = 64;
  for (const l of lines) {
    x.font = `${l.weight ?? 700} ${l.size}px ${l.font === 'plex' ? '"IBM Plex Sans Arabic"' : '"Noto Kufi Arabic"'}`;
    x.fillStyle = l.color; x.textBaseline = 'top';
    (x as any).direction = l.ltr ? 'ltr' : 'rtl'; x.textAlign = l.ltr ? 'left' : 'right';
    for (const row of wrap(x, l.t, W - pad * 2)) { x.fillText(row, l.ltr ? pad : W - pad, y); y += l.size * 1.55; }
    y += l.gap ?? 14;
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
