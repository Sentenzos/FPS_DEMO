import {setEnvironmentIntensity} from "./World";
import Main from "../Main";

export default class Ufo {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;

        this.setModel();
    }

    setModel() {
        this.ufo = this.resources.items.ufo.scene;

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