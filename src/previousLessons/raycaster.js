import '../style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {Vector3} from "three";

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
)
object1.position.x = -2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
)
object3.position.x = 2

scene.add(object1, object2, object3)

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
 * Mouse
 */
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    //Для того чтобы получать значения от -1 до 1
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height * 2 - 1);
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        console.log('click on a sphere')
    }
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
const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    object1.position.y = Math.cos(elapsedTime + object1.position.x)
    object2.position.y = Math.cos(elapsedTime + object2.position.x)
    object3.position.y = Math.cos(elapsedTime + object3.position.x)

    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster();
    //Луч идущий от камеры в направлении мыши
    raycaster.setFromCamera(mouse, camera);

    //Начало и конец луча
    // const rayOrigin = new Vector3(-3, 0, 0);
    // const rayDirection = new Vector3(10, 0, 0);
    // //Длина должна равняться 1, так что сбрасываем длину до 1 с помощью normalize
    // rayDirection.normalize();
    // raycaster.set(rayOrigin, rayDirection)

    // //Массив объектов
    // //distance - distance between the origin pf the ray and the collision point
    // //face - what face of the geometry was hit by the ray
    // //object - what object is concerned by the collision
    // //point - a Vector3 of the exact position of the collision
    // //uv - the UV coordinates in that geometry
    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);

    for (const object of objectsToTest) {
        object.material.color.set('#ff0000');
    }

    for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff');
    }

    if (intersects.length) {
        if (currentIntersect === null) {
            currentIntersect = intersects[0];
            console.log('mouse enter')
        }
    } else {
        if (currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()