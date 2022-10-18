import * as THREE from "three";
import Main from "../Main";
import speedLineVertexShader from "../../previousLessons/wavyBall/shaders/galaxy/vertex.glsl";
import speedLineFragmentShader from "../../previousLessons/wavyBall/shaders/galaxy/fragment.glsl";
import Resources from "../utils/Resources";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class Driver {
    main: Main = new Main();
    resources: Resources = this.main.resources;
    time = this.main.time;
    driver: THREE.Object3D;
    car = this.main.world.car;

    constructor() {
        this.time = this.main.time;
        this.driver = null;
        this.car = this.main.world.car;

        this.setModel();

        this.addEye(0.35, 1.52, 0.69);
        this.addEye(0.35, 1.52, 0.58);

        // this.addWavyLine(0.36, 1.54, 0.85);
    }

    setModel() {
        this.driver = (this.resources.items.carDriver as GLTF).scene;

        this.driver.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.material.color = new THREE.Color('#181818');
            }
        })

        this.driver.rotation.y = Math.PI * -0.5;
        this.driver.scale.set(0.8, 0.8, 0.8);
        this.driver.position.y = 0.25;
        this.driver.position.z = 0.15;

        this.car.group.add(this.driver);
    }

    addEye(startX: number, startY: number, startZ: number) {
        //@ts-ignore
        const sphereGeometry = new THREE.SphereBufferGeometry(0.015, 20, 20);
        const sphereMaterial = new THREE.ShaderMaterial({
            //@ts-ignore
            size: 0.01,
            sizeAttenuation: true,
            vertexColors: true,
        });

        const eye = new THREE.Mesh(sphereGeometry, sphereMaterial);
        eye.position.set(startX, startY, startZ);

        this.car.group.add(eye);
    }

    addWavyLine(startX: number, startY: number, startZ: number) {
        //@ts-ignore
        const waveLineGeometry = new THREE.CylinderBufferGeometry(0.003, 0.003, 0.25, 100, 1000);
        const waveLineMaterial = new THREE.ShaderMaterial({
            //@ts-ignore
            size: 0.01,
            sizeAttenuation: true,
            vertexColors: true,
            uniforms:
                {
                    uTime: this.time.uTime
                },
            vertexShader: speedLineVertexShader,
            fragmentShader: speedLineFragmentShader
        });
        const waveLineMesh = new THREE.Mesh(waveLineGeometry, waveLineMaterial);

        waveLineMesh.rotation.z = 1.7;
        waveLineMesh.rotation.y = -0.74;
        waveLineMesh.position.set(startX, startY, startZ);

        this.car.group.add(waveLineMesh);
    }
}