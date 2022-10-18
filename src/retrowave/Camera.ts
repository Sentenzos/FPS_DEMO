import Main from "./Main";
import {PerspectiveCamera, Scene} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Sizes from "./utils/Sizes";

export default class Camera {
    main: Main = new Main();
    sizes: Sizes = this.main.sizes;
    scene: Scene = this.main.scene;
    canvas: HTMLCanvasElement = this.main.canvas;
    camera: PerspectiveCamera;
    controls: OrbitControls;

    constructor() {
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