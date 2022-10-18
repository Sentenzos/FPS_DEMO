import Sizes from "./utils/Sizes";
import * as THREE from 'three';
import Camera from "./Camera";
import Time from "./utils/Time";
import Renderer from "./Renderer";
// import * as dat from 'lil-gui'
import Lights from "./Lights";
import World from "./World/World";
import sources from "./sources";
import {Scene} from "three";
import Resources from "./utils/Resources";

let instance: Main = null;

export default class Main {
    canvas: HTMLCanvasElement;
    sizes: Sizes;
    time: Time;
    scene: THREE.Scene;
    camera: Camera;
    resources: Resources;
    lights: Lights;
    renderer: Renderer;
    world: any;


    constructor (canvas?: HTMLCanvasElement) {
        if (instance) return instance;

        instance = this;

        // window.main = this;

        this.canvas = canvas;

        // this.gui = new dat.GUI({width: 400});
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.lights = new Lights();
        this.renderer = new Renderer();
        this.world = new World();

        this.sizes.on('resize', () => {
            this.resize();
        })

        this.time.on('tick', () => {
            this.update();
        })
    }

    resize(): void {
        this.camera.resize();
        this.renderer.resize();
    }

    update(): void {
        this.camera.update();
        this.renderer.update();
    }
}


//Вынести в отдельные параметры
//Расстояние камеры