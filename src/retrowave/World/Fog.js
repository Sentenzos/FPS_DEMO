import * as THREE from "three";
import Main from "../Main";

export default class Fog {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.fog = null;

        this.setFog();
    }

    setFog() {
        this.fog = new THREE.Fog('#000000', 1, 500);
        this.scene.fog = this.fog;
    }
}