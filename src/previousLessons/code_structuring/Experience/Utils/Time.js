import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
    constructor() {
        super();

        //Setup
        this.start = Date.now(); //timestamp старта (константа)
        this.current = this.start; //timestamp нынешний (обновляется каждый кадр)
        this.elapsed = 0; //время прошедшее с начала
        this.delta = 16; // время прошедшее с прошлого кадра

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}