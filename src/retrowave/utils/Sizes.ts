import EventEmitter from "../../previousLessons/code_structuring/Experience/Utils/EventEmitter";


export default class Sizes extends EventEmitter {
    width: number;
    height: number;
    pixelRatio: number;

    constructor() {
        super();
        this.updateSizes();

        window.addEventListener('resize', () => {
            this.updateSizes();
            this.trigger('resize');
        })
    }

    updateSizes(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
}
