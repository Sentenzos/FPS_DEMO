import '../style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

//TODO тут применяется важная штука THREE.sRGBEncoding. Он применяется к renderer, environmentMap и всем текстурам.
// К текстурам вручную применять его не надо, за нас это делает gltfLoader
// HDR => LDR

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();



/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse(child => {
        //TODO Environment map может быть применен только на MeshStandardMaterial
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            //TODO можно устанавливать envMap на каждый материал вручную, а можно просто один раз прописать scene.environment = environmentMap;
            //child.material.envMap = environmentMap;

            //TODO интенсивность влияния карты окружения на модель
            child.material.envMapIntensity = debugObject.envMapIntensity;

            //TODO в данном примере (этом уроке/файле) обновляет изменения материалов при переключени toneMapping. Без этого обновления toneMapping меняет только гамму задника
            child.material.needsUpdate = true;

            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}


/**
 * Environment Map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
]);
//TODO оптимизирует цвета текстур окружения
environmentMap.encoding = THREE.sRGBEncoding;
//3d задник
scene.background = environmentMap;
//отражения окружения на моделях
scene.environment = environmentMap;
debugObject.envMapIntensity = 5;
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)


/**
 * Models
 */

//TODO закомментировал ссылки на обе модели.

// '/models/hamburger.glb'
// '/models/FlightHelmet/glTF/FlightHelmet.gltf'
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    //TODO для гамбургера скейл ставить 0.5
    gltf.scene.scale.set(10,10,10);
    gltf.scene.position.set(0,-4,0);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation');
    updateAllMaterials()
})


/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(0.25, 3, -2,25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
//TODO Фиксит артефакт, когда треугольники модели отбрасывают тень на саму модель. Называется это Shadow acne. Значение 0.05 подобрано вручную. Увидеть баг можно на модели с гамбургером
// Эта штука как бы сжимает ту модель, которую видит камера света. В результате тени перестают вылезать изнутри модели и накладываться на нее саму.
// Большие значения выставлять нельзя, в противном случае будет некорректная тень
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity');
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX');
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX');
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ');

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //TODO SSAA - supersampling повышает разрешение всей картинки и сильно влияет на производительность
    // MSAA - multisampling повышает разрешение только на границах объектов и средне влияет на производительность
    //Активирует MSAA. Активация возможно только в момент создания renderer
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//TODO включение физического освещения. Так будет проще получить одинаковый результат в разных приложениях
renderer.physicallyCorrectLights = true;
//TODO Значительно улучшает освещение отображаемое на объектах сцены
renderer.outputEncoding =  THREE.sRGBEncoding;
//TODO toneMapping переводит HDR текстуры в LDR, но в данном случае у нас не HDR текстуры, а LDR, но таким образом в лучшую сторону изменяется гамма
renderer.toneMapping =  THREE.ACESFilmicToneMapping;
//TODO экспозиция
renderer.toneMappingExposure = 3;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(() => {
    //Фикс бага. Свойства класса отвечающие за toneMapping могут возвращать число как строку, но нужно именно числовое значение
    //У меня этого бага не было и все корректно работало и так. Добавил на всякий случай
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials();
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);



console.log(THREE.ACESFilmicToneMapping)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()