import Main from "../Main";
import World from "./World";

export default class ProjectAnimation {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    time = this.main.time;
    world = this.main.world;

    constructor() {
        this.time.on('tick', () => {
            this.animateProjectors();
            this.animateUfo();
        })
    }

    animateProjectors() {
        const projectors = this.world.projectors;
        projectors.projector1.rotation.z = Math.sin(this.time.elapsed * 0.001);
        projectors.projector2.rotation.z = -Math.sin(this.time.elapsed * 0.001);
    }

    animateUfo() {
        const ufo = this.world.ufo.ufo;
        ufo.position.x = 205 + Math.sin(this.time.elapsed * 0.0005) * 40;
        ufo.position.z = -305 + Math.cos(this.time.elapsed * 0.0005) * 30;
    }
}