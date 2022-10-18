import * as THREE from "three";
import Main from "../Main";

export default class Fog {
    main = new Main();
    scene = this.main.scene;
    fog: THREE.Fog;

    constructor() {
        this.setFog();
    }

    setFog() {
        this.fog = new THREE.Fog('#000000', 1, 500);
        this.scene.fog = this.fog;
    }
}