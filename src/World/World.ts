import {Utils} from "../Utils/Utils";
import * as THREE from 'three';
import {Plane} from "./Plane";
import {Player} from "./Player";
import {PlayerControl} from "../Conrols/PlayerControl";
import {PointerLockControls} from "../Conrols/PointerLockControls";
import {WASDControls} from "../Conrols/WASDControls";
import {Bullets} from "./Bullets";

export class World extends Utils {
    plane: Plane;
    player: Player;
    bullets: Bullets;

    constructor(scene: THREE.Scene, canvas: HTMLCanvasElement) {
        super(scene, canvas);

        // canvas.addEventListener('click', () => {
        //     canvas.requestPointerLock();
        // })

        this.resources.on('ready', () => {
            this.plane = new Plane(this.scene);
            this.player = new Player(this.resources.items, this.scene, 'player');
            this.bullets = new Bullets(this.scene);


            new PlayerControl(this.scene, this.camera, canvas);


        })

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