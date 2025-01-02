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

uniform float uSize;


attribute float aScale;

// new uniform
uniform float uTime;


void main(){

  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // ai and I added aScale as a value in the sin function
  // modelPosition.y += sin(uTime + position.x * aScale) * 0.1;
  // 
  // author of the workshop
  modelPosition.y += sin(uTime + modelPosition.x * 100.0) * 0.2 * aScale;


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;


  gl_Position = projectedPosition;

  gl_PointSize = uSize * uPixelRatio;

  gl_PointSize *= aScale;

  
  // size attenuation (from lesson 13)
  gl_PointSize *= 1.0 / - viewPosition.z;
  
  // not going to use this in fragment shader
  // we are using gl_PointCoord instead
  // vUv = uv;

}