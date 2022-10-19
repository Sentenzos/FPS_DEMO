import Main from "../Main";
import * as THREE from "three";
import {setEnvironmentIntensity} from "./World";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class Rocket {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;

    group = new THREE.Group();
    rocket: THREE.Object3D;

    constructor() {
        this.setModel();
    }

    setModel() {
        this.rocket = (this.resources.items.rocket as GLTF).scene;
        setEnvironmentIntensity(this.rocket, 1.5);

        this.group.position.x = 250;

        this.rocket.scale.set(0.3, 0.3, 0.3);
        this.rocket.position.z = -200;
        this.rocket.position.x = -200;

        this.group.add(this.rocket);

        this.scene.add(this.group);
    }
}