import '../style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import gsap from 'gsap';

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        meshMaterial.color.set(parameters.materialColor);
        particleMaterial.color.set(parameters.materialColor)
    });

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
//TODO позволяет правильно работать с шейдинг текстурой gradientMap
gradientTexture.magFilter = THREE.NearestFilter;

const meshMaterial = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

const objectDistance = 4;
const mesh1 = new THREE.Mesh(
    new THREE.TorusBufferGeometry(1, 0.4, 32, 120),
    meshMaterial
);
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    meshMaterial
);
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    meshMaterial
);

mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = objectDistance * 0.4 - Math.random() * objectDistance * sectionMeshes.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight)


// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 3);
// scene.add(directionalLightHelper);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //TODO Прозрачный фон canvas
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    //TODO каждая секция занимает 100vh (смотри html и css)
    // У нас 3 секции. Эта формула будет возвращать значения от 0 до 2. Нужно чтобы анимация запускалась раньше чем элемент достигает середины экрана
    const newSection = Math.round(scrollY / sizes.height);
    if (newSection !== currentSection) {
        currentSection = newSection;
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.height - 0.5;
    cursor.y = event.clientY / sizes.width - 0.5;
})


/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    camera.position.y = -scrollY / sizes.height * objectDistance;

    const parallaxX = cursor.x;
    const parallaxY = -cursor.y;
    //TODO анимация скольжения после остановки. Умножение на дельту нужно для того, чтобы на мониторах
    // с большой частотой не происходило ускорение анимации из-за того, что функция tick вызывается чаще
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 3 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 3 * deltaTime;

    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()