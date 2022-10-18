import Main from "../Main";
import * as THREE from "three";
import {setEnvironmentIntensity} from "./World";

export default class Rocket {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;

        this.group = new THREE.Group();
        this.rocket = null;

        this.setModel();
    }

    setModel() {
        this.rocket = this.resources.items.rocket.scene;
        setEnvironmentIntensity(this.rocket, 1.5);

        this.group.position.x = 250;

        this.rocket.scale.set(0.3, 0.3, 0.3);
        this.rocket.position.z = -200;
        this.rocket.position.x = -200;

        this.group.add(this.rocket);

        this.scene.add(this.group);
    }
}