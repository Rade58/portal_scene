// already defined with ShaderMaterial
// precision mediump float;

// we did receive this from vertex shader, because we did send it (not done by ShaderMaterial)
varying vec2 vUv;


void main() {

  
  vec2 center = vec2(0.5);

  float distanceToCenter = distance(gl_PointCoord, center);

  float divider = 0.07;

  float strength = divider / distanceToCenter - divider * 2.0;


  // gl_FragColor = vec4(vec3(strength), strength);
  gl_FragColor = vec4(vec3(1.0), strength);

}