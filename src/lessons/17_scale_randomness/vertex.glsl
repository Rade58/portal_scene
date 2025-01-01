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

// new attribute
attribute float aScale;



void main(){

  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;


  gl_PointSize = uSize * uPixelRatio;

  // added this line
  gl_PointSize *= aScale;
  
  // size attenuation (from lesson 13)
  gl_PointSize *= 1.0 / - viewPosition.z;
  
  // not going to use this in fragment shader
  // we are using gl_PointCoord instead
  // vUv = uv;

}