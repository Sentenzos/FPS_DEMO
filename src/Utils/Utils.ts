import Sizes from "./Sizes";
import Time from "./Time";
import Camera from "./Camera";
import * as THREE from 'three';
import Renderer from "./Renderer";
import Resources from "./Resources";
import sources from "../sources";

export class Utils {
    sizes: Sizes;
    time: Time;
    camera: Camera;
    renderer: Renderer;
    resources: Resources;

    constructor(public scene: THREE.Scene, public canvas: HTMLCanvasElement) {
        this.sizes = new Sizes();
        this.time = new Time();
        this.camera = new Camera(this.sizes, scene, canvas);
        this.renderer = new Renderer(this.sizes, scene, canvas, this.camera);
        this.resources = new Resources(sources);
    }
}