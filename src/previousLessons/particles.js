import '../style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/2.png');

//Particles
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 5;
    colors[i] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

//TODO Смотреть сюда
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    //Перспектива. Если партикл далеко от камеры, то он будет маленьким, а если близко, то большим
    sizeAttenuation: true,
    // color: '#ff88cc',
    transparent: true,
    alphaMap: particleTexture,
    //Если для частиц используется текстура, то делает прозрачной черную часть этой текстуры (простой фикс отсутствия прозрачности, но не самый действенный)
    //alphaTest: 0.001
    //Еще один способ сделать частицы прозрачными. Но в таком случае их будет видно через другие объекты
    //depthTest: false
    //Лучший способ сделать частицу прозрачной
    depthWrite: false,
    //Смешивает цвета частиц при наложении друг на друга. Просаживает производительность
    blending: THREE.AdditiveBlending,
    //Брать цвет у геометрии
    vertexColors: true
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    //TODO анимируя частицы, мы можем взаимодействовать с всем мешем целиком
    //particles.rotation.y = elapsedTime;
    //TODO или взаимодействовать с каждой геометрией отдельно
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        //i3+1 - y координата
        //Из-за суммирования elapsedTime и x получается анимация волны
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    }
    particlesGeometry.attributes.position.needsUpdate = true;


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()