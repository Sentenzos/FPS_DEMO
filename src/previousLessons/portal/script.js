import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl';
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

/**
 * Spector JS
 */
// const SPECTOR = require('spectorjs');
// const spector = new SPECTOR.Spector();
// spector.displayUI();

/**
 * Debug
 */
const debugObject = {};
const gui = new dat.GUI({width: 400});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTextures = textureLoader.load('baked.jpg');
bakedTextures.flipY = false;
bakedTextures.encoding = THREE.sRGBEncoding; //TODO возвращаем корректные цвета

/**
 * Materials
 */
const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTextures}) //TODO MeshBasicMaterial, так как текстуры уже содержат освещение, тени и т.д

//Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({color: 0xffffe5});
//Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: {value: 0}
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader,
    side: THREE.DoubleSide
});

/**
 * Model
 */
gltfLoader.load('portal.glb', (gltf) => {
    gltf.scene.traverse(child => {
        child.material = bakedMaterial;
        if (child.name === 'Cube011' || child.name === 'Cube019') child.material = poleLightMaterial; //TODO это имена ламп в блендере
        if (child.name === 'Circle') child.material = portalLightMaterial; //TODO имя портала в блендере
    })

    scene.add(gltf.scene);
})

/**
 * Fireflies
 */
//Geometry
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
    positionArray[i * 3 + 1] = Math.random() * 1.5;
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

    scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));


//Material
const firefliesMaterial = new THREE.ShaderMaterial({
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    uniforms: {
        uTime: {value: 0},
        uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
        uSize: {value: 250}
    },
    blending: THREE.AdditiveBlending,
    depthWrite: false //Частицы не перекрывают друг друга
});

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(1000).step(1).name('firefliesSize');

//Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);


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

    //Update fireflies
    firefliesMaterial.uniforms.uPixelRation.value = Math.min(window.devicePixelRatio, 2);
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = -5.3
// camera.position.y = 2.5
// camera.position.z = -4

camera.position.x = -2.7
camera.position.y = 3.8
camera.position.z = -5.3

scene.add(camera)

// gui.add(camera.position, 'x').min(-100).max(100).step(0.1);
// gui.add(camera.position, 'y').min(-100).max(100).step(0.1);
// gui.add(camera.position, 'z').min(-100).max(100).step(0.1);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding; //TODO возвращаем корректные цвета (используется вместе с textureName.encoding = THREE.sRGBEncoding)

debugObject.clearColor = '#201919';
renderer.setClearColor(debugObject.clearColor)
gui.addColor(debugObject, 'clearColor').onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
});

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    firefliesMaterial.uniforms.uTime.value = elapsedTime;
    portalLightMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()