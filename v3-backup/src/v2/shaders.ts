export const pVert = /* glsl */`
attribute vec3 aStart; attribute vec3 aTarget; attribute float aRand;
uniform float uMorph, uTime, uSize, uPR; uniform vec2 uMouse;
varying float vA;
void main(){
  float m = smoothstep(0., 1., clamp(uMorph * 1.5 - aRand * .5, 0., 1.));
  vec3 p = mix(aStart, aTarget, m);
  float loose = 1. + (1. - m) * 25.;
  p += vec3(sin(uTime*.7 + aRand*40.), cos(uTime*.9 + aRand*30.), sin(uTime + aRand*10.)) * .012 * loose;
  vec2 d = p.xy - uMouse; float l = length(d); float f = (1. - smoothstep(0., 1.4, l)) * m;
  p.xy += normalize(d + 1e-4) * f * .8; p.z += f * 1.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPR * (10. / -mv.z) * (.7 + aRand * .6);
  vA = .35 + .65 * m;
}`;
export const pFrag = /* glsl */`
uniform vec3 uColor; varying float vA;
void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; gl_FragColor = vec4(uColor, (1. - smoothstep(.1, .5, d)) * vA); }`;
/* WebGL hover distortion for covers & gallery: vertex bulge + ripple + RGB split around the pointer. */
export const cVert = /* glsl */`
varying vec2 vUv; uniform float uHover; uniform vec2 uMouse;
void main(){ vUv = uv; vec3 p = position; float d = distance(uv, uMouse); p.z += uHover * exp(-d*d*14.) * .14;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`;
export const cFrag = /* glsl */`
uniform sampler2D uTex; uniform float uHover, uTime, uLight; uniform vec2 uMouse, uCrop; varying vec2 vUv;
void main(){
  vec2 uv = (vUv - .5) * uCrop + .5;
  vec2 dir = vUv - uMouse; float d = length(dir);
  uv += normalize(dir + 1e-5) * uHover * exp(-d * 6.) * sin(d * 38. - uTime * 6.) * .012;
  float s = uHover * .007;
  vec3 c = vec3(texture2D(uTex, uv + vec2(s, 0.)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(s, 0.)).b);
  c = c * uLight + uHover * exp(-d*d*28.) * .07;
  gl_FragColor = vec4(c, 1.);
  #include <colorspace_fragment>
}`;
