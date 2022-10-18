import * as THREE from "three";
import Main from "../Main";
import speedLineVertexShader from "../../previousLessons/wavyBall/shaders/galaxy/vertex.glsl";
import speedLineFragmentShader from "../../previousLessons/wavyBall/shaders/galaxy/fragment.glsl";

export default class Driver {
    constructor() {
        this.main = new Main();
        this.resources = this.main.resources;
        this.time = this.main.time;
        this.driver = null;
        this.car = this.main.world.car;

        this.setModel();

        this.addEye(0.35, 1.52, 0.69);
        this.addEye(0.35, 1.52, 0.58);

        // this.addWavyLine(0.36, 1.54, 0.85);
    }

    setModel() {
        this.driver = this.resources.items.carDriver.scene;

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

    addEye(startX, startY, startZ) {
        const sphereGeometry = new THREE.SphereBufferGeometry(0.015, 20, 20);
        const sphereMaterial = new THREE.ShaderMaterial({
            size: 0.01,
            sizeAttenuation: true,
            vertexColors: true,
        });

        const eye = new THREE.Mesh(sphereGeometry, sphereMaterial);
        eye.position.set(startX, startY, startZ);

        // this.gui.add(eye.position, 'x').min(-1).max(1).step(0.01);
        // this.gui.add(eye.position, 'y').min(-1).max(2).step(0.01);
        // this.gui.add(eye.position, 'z').min(-1).max(2).step(0.01);

        this.car.group.add(eye);
        // this.scene.add(eye);
    }

    addWavyLine(startX, startY, startZ) {
        const waveLineGeometry = new THREE.CylinderBufferGeometry(0.003, 0.003, 0.25, 100, 1000);
        const waveLineMaterial = new THREE.ShaderMaterial({
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

        // this.gui.add(waveLineMesh.position, 'x').min(-1).max(1).step(0.01);
        // this.gui.add(waveLineMesh.position, 'z').min(-2).max(7).step(0.01);
        // this.gui.add(waveLineMesh.position, 'y').min(-2).max(7).step(0.01);

        // this.gui.add(waveLineMesh.rotation, 'y').min(-1).max(1).step(0.01);
        // this.gui.add(waveLineMesh.rotation, 'z').min(-1).max(2).step(0.01);

        this.car.group.add(waveLineMesh);
        // this.scene.add(waveLineMesh);
    }
}