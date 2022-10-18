import * as dat from 'dat.gui';


export default class Debug {
    constructor(props) {
        this.active = window.location.hash === '#debug';

        if (this.active) {
            this.ui = new dat.GUI();
        }
    }

}