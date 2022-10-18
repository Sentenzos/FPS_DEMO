import * as THREE from "three";
import Main from "../Main";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {PointLight} from "three";

export default class Moon {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;

    group = new THREE.Group();
    moon: THREE.Object3D;

    pointLight: PointLight;

    constructor() {
        this.setModel();
    }

    setModel() {
        this.group.position.z = -300;
        this.group.position.y = 50;

        this.moon = (this.resources.items.moon as GLTF).scene;

        this.moon.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.scale.set(15, 15, 15);
            }
        })

        this.pointLight = new THREE.PointLight(0xffffff, 20, 30);

        this.group.add(this.moon);
        this.group.add(this.pointLight);

        this.pointLight.lookAt(this.moon.position);
        this.pointLight.position.set(10, -5, 25);

        this.scene.add(this.group);
    }
}