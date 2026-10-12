precision highp float;
varying vec2 vUv;
uniform float uTime;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  float grain = random(vUv + uTime * 0.01) * 0.08;
  gl_FragColor = vec4(vec3(grain), grain);
}
