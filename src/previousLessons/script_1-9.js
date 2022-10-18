import '../style.css'
import * as THREE from 'three'
import gsap from 'gsap';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

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


// const geometry = new THREE.BoxBufferGeometry(1, 1, 1,2,2,2);
// const geometry = new THREE.Geometry();
// for (let i = 0; i < 50; i++) {
//     for (let j = 0; j < 3; j++) {
//         // console.log('vertices')
//         geometry.vertices.push(new THREE.Vector3(
//             (Math.random() - 0.5) * 4,
//             (Math.random() - 0.5) * 4,
//             (Math.random() - 0.5) * 4,
//         ));
//         console.log(geometry.vertices[geometry.vertices.length - 1])
//     }
//     // console.log('faces')
//     const verticesIndex = i * 3;
//     geometry.faces.push(new THREE.Face3(
//         verticesIndex,
//         verticesIndex + 1,
//         verticesIndex + 2,
//     ))
// }


const geometry = new THREE.BufferGeometry();

const count = 50;
const positionArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < positionArray.length; i++) {
    positionArray[i] = (Math.random() - 0.5) * 4;
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute('position', positionAttribute);



// const positionArray = new Float32Array([
//     0,0,0,
//     0,1,0,
//     1,0,0
// ]);
// //Второй передаваемый параметр говорит о том, что один элемент имеет 3 параметра (в данном случае это координаты)
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
// geometry.setAttribute('position', positionAttribute);

const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
)
scene.add(mesh)


const sizes = {width: window.innerWidth, height: window.innerHeight};

window.addEventListener('resize', (e) => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// conrols.target.y = 1;
// controls.update();


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

const clock = new THREE.Clock();
// gsap.to(group.position, {x: 2, duration: 1, delay: 1})

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 3;
    // camera.lookAt(group.position)

    controls.update();
    renderer.render(scene, camera);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    requestAnimationFrame(tick);
}

tick()