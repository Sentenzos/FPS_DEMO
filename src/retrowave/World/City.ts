import Main from "../Main";
import {setEnvironmentIntensity} from "./World";
import {Object3D} from "three";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class City {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    city: Object3D;

    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;
        this.city = null;

        this.setModel();
    }

    setModel() {
        this.city = (this.resources.items.city as GLTF).scene;
        setEnvironmentIntensity(this.city, 10);
        this.city.position.x = 200;
        this.city.position.y = -26.5;
        this.city.position.z = -300;
        this.city.scale.set(2, 2, 2,)
        this.city.rotation.y = Math.PI * 0.45;
        this.scene.add(this.city);
    }
}