precision mediump float; //точность чисел с плавающей точкой
//varying float vRandom; //пришло из vertex shader
uniform vec3 uColor;
uniform sampler2D uTexture; //sampler2D тип для текстур

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.9;
//    gl_FragColor = vec4(textureColor);
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}