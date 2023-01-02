
import * as THREE from "three";
import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
    start: number = Date.now(); //timestamp старта (константа)
    current: number = this.start; //timestamp нынешний (обновляется каждый кадр)
    elapsed: number = 0; //время прошедшее с начала
    delta: number = 16; // время прошедшее с прошлого кадра
    clock: THREE.Clock = new THREE.Clock();
    uTime = { value: 0 };

    constructor() {
        super();

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }

    tick(): void {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        //TODO перенести в другое место
        this.uTime.value = this.clock.getElapsedTime();


        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }

}
