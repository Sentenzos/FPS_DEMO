import {setEnvironmentIntensity} from "./World";
import Main from "../Main";
import {Object3D} from "three";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class Ufo {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    ufo: Object3D;

    constructor() {
        this.setModel();
    }

    setModel() {
        this.ufo = (this.resources.items.ufo as GLTF).scene;

        setEnvironmentIntensity(this.ufo, 10);

        this.ufo.scale.set(10, 10, 10);

        this.ufo.position.x = 205;
        this.ufo.position.y = 30;
        this.ufo.position.z = -305;

        // this.time.on('tick', () => {
        //     ufo.position.x = 205 + Math.sin(this.time.elapsed * 0.0005) * 40;
        //     ufo.position.z = -305 + Math.cos(this.time.elapsed * 0.0005) * 30;
        // })

        this.scene.add(this.ufo);
    }
}