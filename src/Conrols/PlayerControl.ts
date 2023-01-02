import * as THREE from 'three';
import {getObjectByName} from "../Utils/js/getObjectByName";
import {moveObj3d} from "../Utils/js/moveObj3d";
import Camera from "../Utils/Camera";
import {func} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";


export class PlayerControl {
    playerObject: THREE.Object3D;
    animFrameIds = { w: 0, a: 0, s: 0, d: 0};
    mouseTransition = { startX: null as number | null, startY: null as number | null};

    constructor(public scene: THREE.Scene, public camera: Camera, public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scene = scene;
        this.playerObject = getObjectByName(this.scene, 'player');
        this.handleMoveControls();
    }

    handleMoveControls() {
        const moveWASD = (e: KeyboardEvent) => {
            if (e.repeat) return;
            if (e.key === 'w') moveObj3d({posObject: this.playerObject.position, axis: 'x', operator: '+', step: 0.1, idContainer: this.animFrameIds, idName: 'w'})
            else if (e.key === 's') moveObj3d({posObject: this.playerObject.position, axis: 'x', operator: '-', step: 0.1, idContainer: this.animFrameIds, idName: 's'})
            else if (e.key === 'a') moveObj3d({posObject: this.playerObject.position, axis: 'z', operator: '-', step: 0.1, idContainer: this.animFrameIds, idName: 'a'})
            else if (e.key === 'd') moveObj3d({posObject: this.playerObject.position, axis: 'z', operator: '+', step: 0.1, idContainer: this.animFrameIds, idName: 'd'})
        }

        const stopWASD = (e: KeyboardEvent) => {
            if (e.key === 'w') cancelAnimationFrame(this.animFrameIds.w);
            if (e.key === 'a') cancelAnimationFrame(this.animFrameIds.a);
            if (e.key === 's') cancelAnimationFrame(this.animFrameIds.s);
            if (e.key === 'd') cancelAnimationFrame(this.animFrameIds.d);
        }

        const rotate = (e: MouseEvent) => {
            const handleMove = (e: MouseEvent) => {
                const needToSetStartCoords = this.mouseTransition.startX === null || this.mouseTransition.startY === null;

                if (needToSetStartCoords) {
                    this.mouseTransition.startX = e.clientX;
                    this.mouseTransition.startY = e.clientY;
                } else {
                    const rightTransition = e.clientX > this.mouseTransition.startX;
                    const noTransition = e.clientX === this.mouseTransition.startX;

                    noTransition === false && (rightTransition ?
                        this.playerObject.rotation.y -= 0.1
                        : this.playerObject.rotation.y += 0.1
                    );

                    this.mouseTransition.startX = e.clientX;
                    this.mouseTransition.startY = e.clientY;
                }

                window.addEventListener('mouseup', handleUp);
            }

            const handleUp = () => {
                this.mouseTransition.startX = null;
                this.mouseTransition.startY = null;

                window.removeEventListener('mousemove', handleMove)
                window.removeEventListener('mouseup', handleUp);
            }

            window.addEventListener('mousemove', handleMove);
        }
        console.log()

        window.addEventListener('keydown', moveWASD);
        window.addEventListener('keyup', stopWASD);
        window.addEventListener('mousedown', rotate);
    }
}

