import Main from "../Main";
import * as THREE from "three";
import {setEnvironmentIntensity} from "./World";

export default class Projectors {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;

        this.projector1 = null;
        this.projector2 = null;

        this.setModel();
    }

    setModel() {
        const mesh = this.resources.items.projector.scene;

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