// import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import galaxyVertexShader from './shaders/galaxy/vertex.glsl'
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

const debugObject = {};
debugObject.depthColor = '#186691';
debugObject.surfaceColor = '#9bd8ff';

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 200000
parameters.size = 0.005
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    if (points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.CylinderBufferGeometry(0.02, 0.02, 1, 100, 1000);


    // const positions = new Float32Array(parameters.count * 3)
    //
    //
    // for(let i = 0; i < parameters.count; i++) {
    //     const i3 = i * 3;
    //     const x = THREE.Math.randFloat(-1, 1);
    //     const y = THREE.Math.randFloat(-1, 1);
    //     const z = THREE.Math.randFloat(-1, 1);
    //     const normalizationFactor = 1 / Math.sqrt(x * x + y * y + z * z);
    //     const radius = 0.02;
    //
    //     positions[i3 + 0] = x * normalizationFactor * radius;
    //     positions[i3 + 1] = y * normalizationFactor * radius;
    //     positions[i3 + 2] = z * normalizationFactor * radius;
    // }
    //
    // geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    /**
     * Material
     */
    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms:
        {
            uTime: { value: 0 },
            uSize: { value: 30 * renderer.getPixelRatio() },
        },
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material);
    // points.rotation.z = Math.PI * 0.5;

    // points.position.x = 2;
    points.position.set(0.53, 1.67, 5.96);
    points.rotation.z = Math.PI * 0.5;
    points.rotation.y = - 0.87;

    console.log(points)
    scene.add(points)
}



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
camera.position.x = 3
camera.position.y = 3
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
 * Generate the first galaxy
 */
generateGalaxy()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update material
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()