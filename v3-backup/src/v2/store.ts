/* Shared mutable scene state (read in useFrame, written by DOM/ScrollTrigger) — avoids React re-renders per frame. */
import * as THREE from 'three';
export const S = (window as any).__S = {
  s: 0,               // scroll station: section index + local progress
  local: [0, 0, 0, 0, 0] as number[],
  mouse: { x: 0, y: 0 },
  pm: { x: 99, y: 99 },   // pointer for particle repel (far away until a mouse moves)
  gyro: { x: 0, y: 0 },
  hover: false,
  focus: -1,          // keyboard-focused book
  shelfRot: 0, shelfVel: 0,
  galRot: 0, galVel: 0,
  bookPos: [] as THREE.Vector3[],
  morph: { v: 0 },
  night: true,
  mobile: false,
};
export const STATIONS = 5;
export const Z = (i: number) => -i * 40;
