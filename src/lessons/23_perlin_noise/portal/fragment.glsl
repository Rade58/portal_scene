#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
// already defined with ShaderMaterial
// precision mediump float;



// we did receive this from vertex shader, because we did send it (not done by ShaderMaterial)
varying vec2 vUv;

uniform float uTime;




void main() {

  
  // float strength = cnoise3(vec3(vUv.x * 5.0, vUv.y * 5.0, uTime * 0.1));
  // float strength = cnoise3(vec3(vUv * 5.0, uTime * 0.1));

  // we can try doing couple of examples
  // I will divide them fotr you to see them better
  // try them out one by one

  // --------------------------------------------------------
  // float strength = cnoise3(vec3(vUv * 5.0, uTime));

  // --------------------------------------------------------
  // this one is so cool
  // displacing uv with noise
  // vec2 displacedUv = vUv + cnoise3(vec3(vUv * 5.0, uTime));

  // this will be with color
  // gl_FragColor = vec4(displacedUv, 1.0, 1.0);

  // --------------------------------------------------------
  // this one is so cool, it's without color
  // vec2 displacedUv = vUv + cnoise3(vec3(vUv * 5.0, uTime));

  // float strength = cnoise3(vec3(displacedUv * 5.0, uTime));

  // gl_FragColor = vec4(vec3(strength), 1.0);

  // --------------------------------------------------------
  // slowing down the animation
  // vec2 displacedUv = vUv + cnoise3(vec3(vUv * 5.0, uTime * 0.1));

  // float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));

  // gl_FragColor = vec4(vec3(strength), 1.0);

  // --------------------------------------------------------
  // increase frequency to 8.0
  // vec2 displacedUv = vUv + cnoise3(vec3(vUv * 8.0, uTime * 0.1));

  // float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));

  // gl_FragColor = vec4(vec3(strength), 1.0);

  // --------------------------------------------------------
  // with outer glow since we have texture that is "emmiting" light
  // on the edges, and we want that light on the edges of the shader 


  // vec2 center = vec2(0.5);

  // float outerGlow = distance(vUv, center);

  // gl_FragColor = vec4(vec3(outerGlow), 1.0);

  // --------------------------------------------------------
  // outer glow just around the edges (so bigger dark circle in the middle)
  
  // because my portal cicle isn't centered inside stones
  // perfectly I need to change the center
  // vec2 center = vec2(0.505, 0.48);
  // float outerGlow = distance(vUv, center) * 5.0 - 1.6; // and here we are multiplying it by 5.0 and substracting 1.6
  
  // gl_FragColor = vec4(vec3(outerGlow), 1.0);

  // --------------------------------------------------------
  // combining outer glow and noise (strength)

  // vec2 center = vec2(0.505, 0.48);
  // float outerGlow = distance(vUv, center) * 5.0 - 1.6;

  // vec2 displacedUv = vUv + cnoise3(vec3(vUv * 8.0, uTime * 0.1));
  // float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));

  // by adding outherGlow to the strength

  // strength += outerGlow;

  // gl_FragColor = vec4(vec3(strength), 1.0);

  // --------------------------------------------------------
  // problem with noise value since the noise is from -1 to 1
  // I think we can fix it by adding 1.0 to the strength

  // vec2 center = vec2(0.505, 0.48);
  // float outerGlow = distance(vUv, center) * 5.0 - 1.6;

  // vec2 displacedUv = vUv + cnoise3(vec3(vUv * 8.0, uTime * 0.1));
  // float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));


  // strength += outerGlow;
  // strength += 1.0;

  // gl_FragColor = vec4(vec3(strength), 1.0);
  // --------------------------------------------------------
  // here we will use step function to make the outer glow more visible
  // it's not sharp enough

  // it will be too shar so we multiply it by 0.8

  vec2 center = vec2(0.505, 0.48);
  float outerGlow = distance(vUv, center) * 5.0 - 1.2; // 1.2 is better
  vec2 displacedUv = vUv + cnoise3(vec3(vUv * 8.0, uTime * 0.1));
  float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));
  strength += outerGlow;

  // instead of = it will be +=
  strength += step(- 0.2, strength) * 0.8;

  gl_FragColor = vec4(vec3(strength), 1.0);


  // gl_FragColor = vec4(vec3(strength), 1.0);





}