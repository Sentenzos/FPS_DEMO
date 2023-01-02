
import {PerspectiveCamera, Scene} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Sizes from "./Sizes";


export default class Camera {
    camera: PerspectiveCamera;
    controls: OrbitControls;

    constructor(public sizes: Sizes, public scene: Scene, public canvas: HTMLCanvasElement) {
        this.sizes = sizes;
        this.scene = scene;
        this.canvas = canvas;

        this.setCamera();
        this.setOrbitControls();
    }

    setCamera() {
        this.camera = new PerspectiveCamera(
            45,
            this.sizes.width / this.sizes.height,
            0.1,
            1000
        )



        this.camera.position.set(-14, 3, 12);


        this.scene.add(this.camera);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
    }

    resize() {
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }

    update() {
        this.controls.update()
    }
}