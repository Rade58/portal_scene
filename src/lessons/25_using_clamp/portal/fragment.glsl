#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
// already defined with ShaderMaterial
// precision mediump float;



// we did receive this from vertex shader, because we did send it (not done by ShaderMaterial)
varying vec2 vUv;

uniform float uTime;


uniform vec3 uColorStart;
uniform vec3 uColorEnd;



void main() {

  

  vec2 center = vec2(0.505, 0.48);
  float outerGlow = distance(vUv, center) * 5.0 - 1.2; // 1.2 is better
  vec2 displacedUv = vUv + cnoise3(vec3(vUv * 8.0, uTime * 0.1));
  float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));
  strength += outerGlow;

  strength += step(- 0.2, strength) * 0.8;

  // using clamp function to clamp the strength value
  strength = clamp(strength, 0.0, 1.0);

  vec3 color = mix(uColorStart, uColorEnd, strength);

  gl_FragColor = vec4(color, 1.0);



}