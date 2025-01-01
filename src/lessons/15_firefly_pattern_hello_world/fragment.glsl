// already defined with ShaderMaterial
// precision mediump float;

// we did receive this from vertex shader, because we did send it (not done by ShaderMaterial)
varying vec2 vUv;


void main() {

  
  // float strength = 0.5;


  // gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);


  gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);

}