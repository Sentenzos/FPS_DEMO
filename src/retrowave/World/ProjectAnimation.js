import Main from "../Main";

export default class ProjectAnimation {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;
        this.moveGroup = this.main.world.moveGroup;
        this.time = this.main.time;
        this.world = this.main.world;

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