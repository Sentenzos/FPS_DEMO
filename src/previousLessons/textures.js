import '../style.css'
import * as THREE from 'three'
import gsap from 'gsap';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import {Texture} from "three";


// const image = new Image();
// const texture = new THREE.Texture(image);
// image.src = './textures/door/color.jpg';
// image.onload = () => {
//     texture.needsUpdate = true;
// }


const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {}
loadingManager.onProgress = () => {
    console.log('progress')
}
loadingManager.onError = () => {}


const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('./textures/door/color.jpg');
const alphaTexture = textureLoader.load('./textures/door/alpha.jpg');
const heightTexture = textureLoader.load('./textures/door/height.jpg');
const normalTexture = textureLoader.load('./textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('./textures/door/roughness.jpg');

const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = -(e.clientY / sizes.height - 0.5);
});

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const geometry = new THREE.BoxBufferGeometry(1,1,1);
console.log(geometry.attributes)
const material = new THREE.MeshBasicMaterial({map: texture})


const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {width: window.innerWidth, height: window.innerHeight};

window.addEventListener('resize', (e) => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) canvas.requestFullscreen();
        if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
});

const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    requestAnimationFrame(tick);
}

tick()