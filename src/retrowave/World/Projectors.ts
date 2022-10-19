import Main from "../Main";
import * as THREE from "three";
import {setEnvironmentIntensity} from "./World";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class Projectors {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;

    projector1: THREE.Object3D;
    projector2: THREE.Object3D;

    constructor() {
        this.setModel();
    }

    setModel() {
        const mesh = (this.resources.items.projector as GLTF).scene;

        setEnvironmentIntensity(mesh, 2);

        this.projector1 = mesh;

        this.projector1.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.material.color = new THREE.Color('#ffffff');
            }
        })

        this.projector1.scale.set(10, 10, 10);

        this.projector1.position.x = 220;
        this.projector1.position.z = -320

        this.projector2 = this.projector1.clone();

        this.projector1.rotation.z = Math.PI * 0.25;
        this.projector2.rotation.z = -(Math.PI * 0.25);

        this.scene.add(this.projector1, this.projector2);
    }
}