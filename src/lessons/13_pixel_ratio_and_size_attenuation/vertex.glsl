// already declared with ShaderMaterial
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

 
// already declared with ShaderMaterial
// attribute vec2 uv;

// we still need to pass this by ourself
varying vec2 vUv;
//

// already declared with ShaderMaterial
// attribute vec3 position;


// see what we did with this uniform
uniform float uPixelRatio;



void main(){

  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // instead of this
  // gl_PointSize = 40.0;
  // we do this
  gl_PointSize = 40.0 * uPixelRatio;
  
  // size attenuation activated like this
  gl_PointSize *= 1.0 / - viewPosition.z;
  //
  vUv = uv;
}