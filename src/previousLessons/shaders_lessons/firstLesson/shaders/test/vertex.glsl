//Каждая матрица будет трансформировать позицию до тех пор, пока мы не достигнем clip space coordinates
//Данные для матриц берутся из данных модели и сцены

//transform the coordinates into the clip space coordinates
uniform mat4 projectionMatrix;
//apply transformmations relative to the camera (position, rotation, fov, nearm far)
uniform mat4 viewMatrix;
//apply transformmations relative to the Mesh (position, rotation, scale)
uniform mat4 modelMatrix;

uniform vec2 uFrequency;
uniform float uTime;

//пришедший из геометрии атрибут
attribute vec3 position;
attribute vec2 uv;
//attribute float aRandom;

varying vec2 vUv;
varying float vElevation;
//varying float vRandom; //уйдет в fragment shader

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;

    modelPosition.z = elevation;

//    modelPosition.z += aRandom * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = elevation;
//    vRandom = aRandom;
}
