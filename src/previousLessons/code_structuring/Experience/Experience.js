import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import * as THREE from 'three';
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Environment from "./World/Environment";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";

let instance = null;

export default class Experience {
    constructor(canvas) {
        //Singleton (таким образом, другие классы могут иметь доступ к параметрам объекта)
        if (instance) return instance;
        instance = this;

        //Global access
        window.experience = this;

        //Options
        this.canvas = canvas;

        //Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

        //Sizes resize event
        this.sizes.on('resize', () => {
            this.resize();
        });

        this.time.on('tick', () => {
            this.update();
        })
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        //Сначала камера, а потом рендер. В противном случае может всплыть какой-то баг
        this.camera.update();
        this.world.update();
        this.renderer.update();
    }

    //TODO это пример. В зависимости от проекта и используемых вещей может потребоваться удалять и какие-то другие вещи
    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');

        //Traverse the whole scene
        this.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();

                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose === 'function') value.dispose();
                }
            }
        })

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if (this.debug.active) this.debug.ui.destroy();
    }
}