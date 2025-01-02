// already defined with ShaderMaterial
// precision mediump float;

// we did receive this from vertex shader, because we did send it (not done by ShaderMaterial)
varying vec2 vUv;


void main() {

  
  
  // float strength = round(vUv.x * 10.0) / 10.0;
  float strength = vUv.x;



  // gl_FragColor = vec4(vec3(strength, strength, strength), 1.0);
  gl_FragColor = vec4(vUv, 1.0, 1.0);

}