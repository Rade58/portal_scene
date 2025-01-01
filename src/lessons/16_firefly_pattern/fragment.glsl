// already defined with ShaderMaterial
// precision mediump float;

// we did receive this from vertex shader, because we did send it (not done by ShaderMaterial)
varying vec2 vUv;


void main() {

  
  vec2 center = vec2(0.5);

  float distanceToCenter = distance(gl_PointCoord, center);

  

  gl_FragColor = vec4(1.0, 1.0, 1.0, distanceToCenter);

}