// already declared with ShaderMaterial
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

 
// already declared with ShaderMaterial
// attribute vec2 uv;

// we still need to pass this by ourself
// but we will not use it in this lesson
// o comment it out
// varying vec2 vUv;
//

// already declared with ShaderMaterial
// attribute vec3 position;


uniform float uPixelRatio;

// instead of hardcoded 40.0 we will use this uniform
uniform float uSize;


void main(){

  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // instead of this
  // gl_PointSize = 40.0 * uPixelRatio;
  // this
  gl_PointSize = uSize * uPixelRatio;

  
  // size attenuation (from lesson 13)
  gl_PointSize *= 1.0 / - viewPosition.z;
  
  // not going to use this in fragment shader
  // we are using gl_PointCoord instead
  // vUv = uv;
}