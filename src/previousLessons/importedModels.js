import '../style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";

/**
 * О форматах
 * --- GLTF default ---
 * gltf - файл содержит камеры, свет сцены, материалы, объекты трансформаций и не содержит геометрию и текстуры
 * bin - файл это binary который обычно содержит данные типа геометрии (vertices, uv coords, normals, colors, etc.)
 * png - текстура
 *
 * --- GLTF binary ---
 * glb - содержит абсолютно все данные в binary формате. Нельзя просмотреть. Обычно легче, проще загружать, сложнее изменять данные
 *
 * --- GLTF draco ---
 * тоже самое, что и gltf default, но значительно легче из-за того, что файлы сжаты. Во время загрузки больших файлов могут происходить фризы во время декомпрессии
 *
 * --- GLTF embedded ---
 * gltf - один файл, можно просмотреть. Наиболее тяжелый
 */


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
 * Models
 */
//TODO будет использоваться только для подгрузки draco моделей. Если загружается какая-то другая модель, то никакого негативного влияния он вносить не будет
const dracoLoader = new DRACOLoader();
//TODO draco декодер мы собственноручно вытащили из папки three в node_modules (three/examples/js/libs/draco)
// таким образом ускоряется загрузка модели (лучше погуглить что это дает на самом деле)
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer;
gltfLoader.load('/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        console.log(gltf);

        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[1]);
        action.play();

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene);

        //TODO один из вариантов добавления объектов на сцену. Когда мы берем объект из сцены модели и добавляем его на свою сцену, то он удаляется из сцены модели. Так что создаем новый массив и спредим туда сцену модели
        //const children = [...gltf.scene.children];
        //for (const child of children) {
        //     scene.add(child);
        //}
    },
    () => {
    },
    () => {
    }
)


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Update mixer
    mixer?.update(deltaTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()