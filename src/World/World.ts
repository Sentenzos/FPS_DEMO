import {Utils} from "../Utils/Utils";
import * as THREE from 'three';
import {Plane} from "./Plane";
import {Player} from "./Player";
import {PlayerControl} from "../Conrols/PlayerControl";
import {PointerLockControls} from "../Conrols/PointerLockControls";
import {WASDControls} from "../Conrols/WASDControls";

export class World extends Utils {
    plane: Plane;
    player: Player;

    constructor(scene: THREE.Scene, canvas: HTMLCanvasElement) {
        super(scene, canvas);

        // canvas.addEventListener('click', () => {
        //     canvas.requestPointerLock();
        // })

        this.plane = new Plane(this.scene);
        this.player = new Player(this.scene, 'player');

        new PlayerControl(this.scene, this.camera, canvas);

        // const controls = new PointerLockControls(this.camera.camera, canvas);
        // new WASDControls(controls, this.scene, this.camera.camera, this.renderer.renderer);

        this.sizes.on('resize', () => {
            this.resize();
        })

        this.time.on('tick', () => {
            this.update();
        })
    }



    resize(): void {
        // this.camera.resize();
        this.renderer.resize();
    }

    update(): void {
        this.camera.update();
        this.renderer.update();
    }
}