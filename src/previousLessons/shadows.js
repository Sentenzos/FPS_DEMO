import '../style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

//TODO теория следующая: каждый свет на сцене по своей сути является камерой, которая перед каждый рендером делает...
//TODO ... захват изображения со своей позиции. На основе того, что увидит свет и что не увидит будет сделан shadow map

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
//TODO свет должен отбрасывать тень (работает только с directional, point, spot)
directionalLight.castShadow = true;
//TODO информация о тени хранится в источнике света
console.log(directionalLight.shadow)
//TODO повышаем разрешение теней
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
//TODO высота и ширина "теневой" камеры света (чем меньше ее размер, тем более четкие выходят тени)
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
//TODO установка дальности "теневой" камеры света
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
//TODO краев теней блюр
directionalLight.shadow.radius = 5;

scene.add(directionalLight)

//TODO отобразить "теневую" камеру света
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);


//TODO Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.radius = 5;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.position.set(0, 2, 2);

scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper);

//TODO Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

pointLight.position.set(-1, 1, 1);
scene.add(pointLight);

//TODO point light использует perspective камеру как "теневую" камеру,
// но если быть более точным, то не одну, а сразу 6 камер (то есть он делает целых 6 тендеров сцены, смотря во все стороны)
// именно по этому несмотря на то что cameraHelper смотрит вниз (видимо это посленее направление с которого брался shadow map),
// тени, тем не менее, падают во все стороны
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
//TODO для каждого объекта который должен отбросить тень
sphere.castShadow = true;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
    //TODO запеченная тень
    // new THREE.MeshBasicMaterial({map: bakedShadow})
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
//TODO для каждого объекта, который должен отображать тень
plane.receiveShadow = true;
scene.add(sphere, plane)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({color: 0x000000, alphaMap: simpleShadow, transparent: true}),
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

//TODO активация shadow map у рендера
renderer.shadowMap.enabled = false;
//TODO изменяет алгоритм работы shadow map (края теней с этим алгоритмом более четкие, но в таком случае не работает radius для теней)
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    //TODO Sphere update
    //TODO увеличиваем радиус на 2
    sphere.position.x = Math.cos(elapsedTime) * 2;
    sphere.position.z = Math.sin(elapsedTime) * 2;
    //TODO abs для того чтобы sin возвращал только позитивные значения (если забудешь о чем речь, то чекни в гугле график sin(x))
    // умножение на 3 для ускорения анимации
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
    //TODO Update the shadow
    //TODO фейковая тень (текстура) следует за шаром
    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    //TODO когда шар отдаляется фейковая тень становится прозрачной
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()