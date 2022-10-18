uniform float uSize;
attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//    modelPosition.y += sin(modelPosition.x * 100.0) * aScale * 0.05;
//    modelPosition.x += cos(modelPosition.y + modelPosition.z) * 0.05;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z); //Размер в зависимости от удаленности камеры
}