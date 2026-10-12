precision highp float;
varying vec2 vUv;
uniform float uTime;

void main() {
  float wave = sin((vUv.x + uTime * 0.08) * 12.0) * 0.04;
  vec3 color = vec3(0.81, 0.64 + wave, 0.48);
  gl_FragColor = vec4(color, 0.45);
}
