#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
// already defined with ShaderMaterial
// precision mediump float;



// we did receive this from vertex shader, because we did send it (not done by ShaderMaterial)
varying vec2 vUv;

uniform float uTime;




void main() {

  
  float strength = cnoise3(vec3(vUv * 5.0, uTime * 0.1));



  gl_FragColor = vec4(vec3(strength), 1.0);

}