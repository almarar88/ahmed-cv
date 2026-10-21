/* The 3D world: one R3F canvas, six scenes laid out along -Z, camera flown by the scroll station S.s. */
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Stars, RoundedBox, Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { S, Z } from './store';
import { pVert, pFrag, cVert, cFrag } from './shaders';
import { textTexture } from './textures';

const GOLD = new THREE.Color('#e0b26a');
const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ---------- camera rig ---------- */
function Rig() {
  const { camera, size } = useThree();
  const narrow = size.width / size.height < .8;
  const k = narrow ? 1.45 : 1;
  const CAM = useMemo(() => [
    { p: [0, 0, 12 * k], l: [0, 0, 0] }, { p: [0, .4, 11 * k], l: [0, 0, 0] }, { p: [0, 0, 12 * k], l: [0, 0, 0] },
    { p: [0, 0, 2.5], l: [0, 0, -7] }, { p: [0, 0, 10 * k], l: [0, 0, 0] },
  ].map((c, i) => ({ p: new THREE.Vector3(c.p[0], c.p[1], c.p[2] + Z(i)), l: new THREE.Vector3(c.l[0], c.l[1], Z(i)) })), [k, narrow]);
  const look = useRef(new THREE.Vector3()), tp = new THREE.Vector3(), tl = new THREE.Vector3();
  useFrame((_, dt) => {
    const s = clamp(S.s, 0, CAM.length - 1), b = Math.min(Math.floor(s), CAM.length - 2), f = s - b;
    const kk = ease(clamp((f - .5) / .5)); // hold on a scene, then fly
    tp.lerpVectors(CAM[b].p, CAM[b + 1].p, kk); tl.lerpVectors(CAM[b].l, CAM[b + 1].l, kk);
    const arc = Math.sin(kk * Math.PI);
    tp.x += arc * (b % 2 ? 4 : -4); tp.y += arc * 2.2;
    const px = S.mouse.x * .6 + S.gyro.x, py = S.mouse.y * .35 + S.gyro.y;
    tp.x += px; tp.y += py;
    const a = 1 - Math.pow(.0015, dt);
    camera.position.lerp(tp, a); look.current.lerp(tl, a);
    camera.lookAt(look.current);
    camera.rotateZ(arc * (b % 2 ? .08 : -.08));
  });
  return null;
}

/* ---------- theme: day/night lighting ---------- */
function Atmosphere() {
  const { scene } = useThree();
  const amb = useRef<THREE.AmbientLight>(null!), key = useRef<THREE.DirectionalLight>(null!), warm = useRef<THREE.PointLight>(null!);
  const bg = useMemo(() => new THREE.Color(), []);
  useEffect(() => { scene.background = bg; scene.fog = new THREE.Fog(bg, 14, 42); }, [scene, bg]);
  const N = new THREE.Color('#06100d'), D = new THREE.Color('#efe6d6');
  useFrame((st, dt) => {
    const a = 1 - Math.pow(.02, dt); const n = S.night;
    bg.lerp(n ? N : D, a); (scene.fog as THREE.Fog).color.copy(bg);
    amb.current.intensity += ((n ? .35 : 1.1) - amb.current.intensity) * a;
    key.current.intensity += ((n ? .9 : 2.4) - key.current.intensity) * a;
    key.current.color.lerp(n ? new THREE.Color('#9fc3ff') : new THREE.Color('#fff4e0'), a);
    warm.current.intensity += ((n ? 60 : 15) - warm.current.intensity) * a;
    warm.current.position.copy(st.camera.position).add(new THREE.Vector3(2, 3, -3));
  });
  return <>
    <ambientLight ref={amb} intensity={.4} />
    <directionalLight ref={key} position={[6, 10, 8]} intensity={1} />
    <pointLight ref={warm} color="#e0b26a" intensity={40} distance={30} />
  </>;
}

function Stage({ i, children }: { i: number; children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null!);
  useFrame(() => { g.current.visible = Math.abs(S.s - i - .5) < 1.35; });
  return <group ref={g}>{children}</group>;
}
/* ---------- 1. particle name ---------- */
function NameField({ pts, aspect, count }: { pts: Float32Array; aspect: number; count: number }) {
  const { size, viewport } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const vw = viewport.getCurrentViewport(undefined, new THREE.Vector3(0, 0, 0)).width;
  const narrow = size.width / size.height < .8;
  const W = Math.min(narrow ? vw * .78 : vw * .7, 15);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry(), st = new Float32Array(count * 3), tg = new Float32Array(count * 3), r = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1), R = 6 + Math.random() * 14;
      st[i * 3] = R * Math.sin(v) * Math.cos(u); st[i * 3 + 1] = R * Math.sin(v) * Math.sin(u); st[i * 3 + 2] = R * Math.cos(v) - 6;
      tg[i * 3] = pts[i * 3] * W; tg[i * 3 + 1] = pts[i * 3 + 1] * W + (narrow ? 2.6 : 1.1); tg[i * 3 + 2] = pts[i * 3 + 2] * W;
      r[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(tg, 3)); g.setAttribute('aTarget', new THREE.BufferAttribute(tg, 3));
    g.setAttribute('aStart', new THREE.BufferAttribute(st, 3)); g.setAttribute('aRand', new THREE.BufferAttribute(r, 1));
    return g;
  }, [pts, W, count, narrow, aspect]);
  const uni = useMemo(() => ({ uMorph: { value: 0 }, uTime: { value: 0 }, uSize: { value: narrow ? 5 : 5.5 }, uPR: { value: Math.min(devicePixelRatio, 2) }, uMouse: { value: new THREE.Vector2(99, 99) }, uColor: { value: GOLD.clone() } }), [narrow]);
  useFrame((st, dt) => {
    const u = mat.current.uniforms; u.uTime.value += dt; u.uMorph.value = S.morph.v;
    const h = 2 * st.camera.position.z * Math.tan((45 * Math.PI) / 360); // approx plane at z=0
    u.uMouse.value.set(S.pm.x * h * size.width / size.height / 2, S.pm.y * h / 2);
    u.uColor.value.lerp(S.night ? GOLD : new THREE.Color('#0f4c3f'), .06);
    mat.current.blending = S.night ? THREE.AdditiveBlending : THREE.NormalBlending;
  });
  return <points geometry={geo} frustumCulled={false}><shaderMaterial ref={mat} vertexShader={pVert} fragmentShader={pFrag} uniforms={uni} transparent depthWrite={false} /></points>;
}

/* hover-distortion material factory */
function useCoverMat(tex: THREE.Texture, aspect: number, target: number) {
  return useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const cx = aspect > target ? target / aspect : 1, cy = aspect > target ? 1 : aspect / target;
    return new THREE.ShaderMaterial({ vertexShader: cVert, fragmentShader: cFrag, uniforms: { uTex: { value: tex }, uHover: { value: 0 }, uTime: { value: 0 }, uLight: { value: 1 }, uMouse: { value: new THREE.Vector2(.5, .5) }, uCrop: { value: new THREE.Vector2(cx, cy) } } });
  }, [tex, aspect, target]);
}
const setCursor = (on: boolean) => { S.hover = on; };

/* ---------- 2. career path ---------- */
function Career({ mobile }: { mobile: boolean }) {
  const { size } = useThree(); const narrow = size.width / size.height < .8;
  const curve = useMemo(() => new THREE.CatmullRomCurve3([[-9, -3, 4], [-4, 1, 1], [0, -1.5, -1], [4, 1.5, -3], [9, -1, -6], [12, 2, -10]].map((p) => new THREE.Vector3(...p))), []);
  const tex = useMemo(() => [
    textTexture([{ t: 'منذ مايو 2025', size: 40, color: '#e0b26a', font: 'plex', weight: 600 }, { t: 'ضابط لغات', size: 92, color: '#f6f1e7' }, { t: 'قسم اللغات · مركز التعليم المستمر', size: 44, color: '#d7ded9', font: 'plex', weight: 600, gap: 4 }, { t: 'جامعة محمد بن زايد للعلوم الإنسانية', size: 44, color: '#d7ded9', font: 'plex', weight: 600 }, { t: 'Languages Officer', size: 40, color: '#e0b26a', font: 'plex', weight: 600, ltr: true }], 1024, 640, '#0e1a16', '#e0b26a'),
    textTexture([{ t: 'أبرز الإنجازات', size: 40, color: '#e0b26a', font: 'plex', weight: 600 }, { t: '36 دورة لغوية', size: 84, color: '#f6f1e7' }, { t: 'حضورية في 4 لغات و3 مستويات · الربع الرابع 2026', size: 42, color: '#d7ded9', font: 'plex', weight: 600, gap: 4 }, { t: 'حملة تواصل شملت نحو 150 جهة حكومية وخاصة', size: 42, color: '#d7ded9', font: 'plex', weight: 600 }], 1024, 640, '#0e1a16', '#e0b26a'),
    textTexture([{ t: 'أغسطس 2021 – أغسطس 2024', size: 40, color: '#e0b26a', font: 'plex', weight: 600 }, { t: 'بكالوريوس الآداب', size: 80, color: '#f6f1e7' }, { t: 'الأعمال / السياسة العالمية', size: 46, color: '#d7ded9', font: 'plex', weight: 600, gap: 4 }, { t: 'جامعة ولاية أريزونا، الولايات المتحدة الأمريكية', size: 42, color: '#d7ded9', font: 'plex', weight: 600 }], 1024, 640, '#0e1a16', '#e0b26a'),
  ], []);
  const pos: [number, number, number][] = narrow ? [[0, 3.6, 0], [0, .3, -.3], [0, -3, -.6]] : [[-3.4, 1, 0], [2.6, -1.1, -1], [7.4, 1.6, -4]];
  const tube = useRef<THREE.Mesh>(null!);
  useFrame(() => { (tube.current.geometry as THREE.BufferGeometry).setDrawRange(0, Math.floor(clamp((S.s - .45) / .8) * 200 * 8 * 6)); });
  return (
    <group position={[0, 0, Z(1)]}>
      <mesh ref={tube}><tubeGeometry args={[curve, 200, .045, 8]} /><meshBasicMaterial color={[2.4, 1.7, .8]} toneMapped={false} /></mesh>
      {[.18, .45, .72].map((t, i) => <mesh key={i} position={curve.getPoint(t)}><sphereGeometry args={[.16, 24, 24]} /><meshBasicMaterial color={[3, 2.2, 1.1]} toneMapped={false} /></mesh>)}
      {tex.map((t, i) => (
        <Float key={i} speed={mobile ? 1 : 1.6} rotationIntensity={.25} floatIntensity={.6}>
          <Panel position={pos[i]} tex={t} scale={narrow ? .85 : 1} />
        </Float>
      ))}
      <Sparkles count={mobile ? 40 : 120} scale={[24, 10, 12]} size={3} color="#e0b26a" speed={.3} />
    </group>
  );
}
function Panel({ position, tex, scale, dim }: { position: [number, number, number]; tex: THREE.Texture; scale: number; dim?: boolean }) {
  const g = useRef<THREE.Group>(null!); const [h, setH] = useState(false);
  useFrame(() => { g.current.rotation.y += ((h ? S.mouse.x * .35 : -position[0] * .05) - g.current.rotation.y) * .08; g.current.rotation.x += ((h ? -S.mouse.y * .25 : 0) - g.current.rotation.x) * .08; const s = scale * (h ? 1.06 : 1); g.current.scale.lerp(new THREE.Vector3(s, s, s), .1); });
  return (
    <group ref={g} position={position} onPointerOver={() => { setH(true); setCursor(true); }} onPointerOut={() => { setH(false); setCursor(false); }}>
      <RoundedBox args={[4.2, 2.7, .14]} radius={.08} smoothness={3}><meshPhysicalMaterial color={dim ? '#1b2723' : '#14231e'} roughness={.35} metalness={.2} clearcoat={1} /></RoundedBox>
      <mesh position={[0, 0, .075]}><planeGeometry args={[4.0, 2.5]} /><meshBasicMaterial map={tex} color="#e4e4e4" toneMapped={false} /></mesh>
    </group>
  );
}

/* ---------- 3. certificates: a 3D ring of cards, scroll + drag + keyboard, hover distortion ---------- */
type Cert = { t: string; i: string; g: string };
function CertRing({ certs, onPick }: { certs: Cert[]; onPick: (i: number) => void }) {
  const g = useRef<THREE.Group>(null!); const drag = useRef<{ x: number; moved: number; k: number } | null>(null);
  const n = certs.length, STEP = (Math.PI * 2) / n, GR = 16;
  const texs = useMemo(() => certs.map((c) => textTexture([{ t: c.g, size: 30, color: '#e0b26a', font: 'plex', weight: 600, gap: 22 }, { t: c.t, size: /[a-z]/i.test(c.t) && !/[\u0600-\u06FF]/.test(c.t) ? 50 : 50, color: '#f6f1e7', gap: 22, ltr: !/[\u0600-\u06FF]/.test(c.t) }, { t: c.i, size: 34, color: '#d7ded9', font: 'plex', weight: 600, ltr: !/[\u0600-\u06FF]/.test(c.i) }], 800, 500, '#0e1a16', '#e0b26a')), [certs]);
  useEffect(() => {
    const mv = (e: PointerEvent) => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x; d.x = e.clientX; d.moved += Math.abs(dx); S.galVel = dx * .003; S.galRot += dx * .003; };
    const up = () => { const d = drag.current; if (d && d.moved < 6) onPick(d.k); drag.current = null; };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); return () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
  }, [onPick]);
  useFrame(() => {
    if (!drag.current) { S.galRot += S.galVel; S.galVel *= .94; S.galRot += (0 - S.galRot) * .01; }
    const target = -S.focus * STEP + S.galRot + (S.local[3] - .5) * .9;
    let cur = g.current.rotation.y; const d = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
    g.current.rotation.y = cur + d * .08;
  });
  return (
    <group position={[0, 0, Z(3) + 9]}>
      <group ref={g}>{texs.map((t, k) => <CertCard key={k} tex={t} a={k * STEP} R={GR} k={k} onDown={(x) => { drag.current = { x, moved: 0, k }; }} />)}</group>
      <Stars radius={30} depth={20} count={1500} factor={3} fade speed={.5} />
    </group>
  );
}
function CertCard({ tex, a, R: GR, k, onDown }: { tex: THREE.Texture; a: number; R: number; k: number; onDown: (x: number) => void }) {
  /* text cards: no shader distortion (legibility rule) — focus/hover lift the card toward the viewer instead */
  const m = useRef<THREE.Group>(null!); const h = useRef(false);
  const home = useMemo(() => new THREE.Vector3(Math.sin(a) * GR, 0, -Math.cos(a) * GR), [a, GR]);
  useFrame(() => { const on = S.focus === k ? 1 : h.current ? .5 : 0; const s = 1 + on * .12; m.current.scale.lerp(new THREE.Vector3(s, s, s), .1); m.current.position.lerp(home.clone().multiplyScalar(1 - on * .08), .1); });
  return <group ref={m} position={home} rotation-y={-a}
    onPointerOver={() => { h.current = true; setCursor(true); }} onPointerOut={() => { h.current = false; setCursor(false); }}
    onPointerDown={(e) => { e.stopPropagation(); onDown(e.nativeEvent.clientX); }}>
    <RoundedBox args={[3.05, 1.95, .08]} radius={.06} smoothness={3}><meshPhysicalMaterial color="#14231e" roughness={.35} metalness={.3} clearcoat={1} /></RoundedBox>
    <mesh position={[0, 0, .045]}><planeGeometry args={[2.95, 1.85]} /><meshBasicMaterial map={tex} color="#e4e4e4" toneMapped={false} /></mesh>
  </group>;
}

/* ---------- skills ambience & contact ---------- */
function Pending() {
  return (
    <group position={[0, 0, Z(2)]}>
      {[[-4, 1.5, -2], [4.5, -1, -3], [0, 2.8, -5], [-2, -2.6, -1]].map((p, i) => (
        <Float key={i} speed={1.5} rotationIntensity={1.5} floatIntensity={1}>
          <mesh position={p as any}><icosahedronGeometry args={[.9 + i * .2, 0]} /><meshStandardMaterial color="#e0b26a" wireframe /></mesh>
        </Float>
      ))}
    </group>
  );
}
function ContactOrb() {
  const m = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { m.current.rotation.x += dt * .2 + S.mouse.y * .01; m.current.rotation.y += dt * .3 + S.mouse.x * .01; });
  return (
    <group position={[0, .6, Z(4) - 2]}>
      <mesh ref={m}><torusKnotGeometry args={[2, .55, 220, 32]} /><meshPhysicalMaterial color="#e0b26a" metalness={1} roughness={.22} clearcoat={1} /></mesh>
      <Sparkles count={80} scale={[10, 8, 6]} size={4} color="#ffd48a" />
    </group>
  );
}

export default function World({ name, certs, onPick, mobile }: { name: { pts: Float32Array; aspect: number } | null; certs: Cert[]; onPick: (i: number) => void; mobile: boolean }) {
  return (
    <Canvas className="world" dpr={mobile ? [1, 1.5] : [1, 2]} gl={{ antialias: !mobile, powerPreference: 'high-performance' }}
      camera={{ fov: 45, position: [0, 0, 12], near: .1, far: 140 }} style={{ touchAction: 'pan-y' }} aria-hidden="true">
      <Atmosphere />
      <Rig />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={3} color="#ffe2b0" position={[0, 5, -6]} scale={[12, 3, 1]} />
        <Lightformer intensity={2} color="#7fc8ad" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 8, 1]} />
        <Lightformer intensity={1.5} color="#e7a3c9" position={[6, -2, 2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
      </Environment>
      <Stage i={0}>{name && <NameField pts={name.pts} aspect={name.aspect} count={mobile ? 5000 : 14000} />}</Stage>
      <Stage i={1}><Career mobile={mobile} /></Stage>
      <Stage i={2}><Pending /></Stage>
      <Stage i={3}><CertRing certs={certs} onPick={onPick} /></Stage>
      <Stage i={4}><ContactOrb /></Stage>
      {!mobile && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={.7} luminanceThreshold={.95} />
          <Vignette darkness={.55} offset={.3} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
