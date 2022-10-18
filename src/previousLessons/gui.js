import '../style.css'
import * as THREE from 'three'
import gsap from 'gsap';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';

const gui = new dat.GUI({closed: true});
const parameters = {
    color: 0xff0000,
    spin: () => {
        gsap.to(mesh.rotation, {y: mesh.rotation.y + Math.PI * 2, duration: 1})
    }
}
gui
    .addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    });

gui
    .add(parameters, 'spin')

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
const geometry = new THREE.BufferGeometry();

const count = 50;
const positionArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < positionArray.length; i++) {
    positionArray[i] = (Math.random() - 0.5) * 4;
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute('position', positionAttribute);
const material = new THREE.MeshBasicMaterial({color: parameters.color, wireframe: true})


const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.y = 0.1;
scene.add(mesh);

gui.add(mesh.position, 'y', -3, 3, 0.01);
gui.add(mesh.position, 'x', -3, 3, 0.01);
gui.add(mesh.position, 'z', -3, 3, 0.01);

gui.add(mesh, 'visible');
gui.add(material, 'wireframe');




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