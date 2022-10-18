import Main from "../../../retrowave/Main";
import * as dat from 'lil-gui'

export default class Gui {
    constructor() {
        this.gui = new dat.GUI();

        this.lightsFolder = this.gui.addFolder('lights');
        this.lightsFolder.open(false);

        this.main = new Main();
        this.camera = main.camera.camera;
        this.lights = main.lights;

        this.setCameraGui();
        this.setPointLightGui();
        this.setDirectionalLightGui();
        this.setAmbientLightGui();
    }

    setCameraGui() {
        const cameraPosition = this.gui.addFolder('cameraPosition');
        cameraPosition.open(false);

        cameraPosition.add(this.camera.position, 'x').min(-1000).max(100).step(0.0001);
        cameraPosition.add(this.camera.position, 'y').min(-1000).max(100).step(0.0001);
        cameraPosition.add(this.camera.position, 'z').min(-1000).max(100).step(0.0001);
    }

    setPointLightGui() {
        if(!this.lights.pointLight) return;
        const pointLight = this.lightsFolder.addFolder('pointLight');
        pointLight.add(this.lights.pointLight.position, 'x').min(-100).max(100).step(0.0001);
        pointLight.add(this.lights.pointLight.position, 'y').min(-100).max(100).step(0.0001);
        pointLight.add(this.lights.pointLight.position, 'z').min(-100).max(100).step(0.0001);
        pointLight.add(this.lights.pointLight, 'intensity').min(0).max(10).step(0.0001);
        pointLight.addColor(this.lights.pointLight, 'color').onChange((color) => {
            this.lights.pointLight.color.set(color);
        })
    }

    setDirectionalLightGui() {
        if (!this.lights.directionalLight) return;
        const directionalLight = this.lightsFolder.addFolder('directionalLight');
        directionalLight.add(this.lights.directionalLight.position, 'x').min(-100).max(100).step(0.0001);
        directionalLight.add(this.lights.directionalLight.position, 'y').min(-100).max(100).step(0.0001);
        directionalLight.add(this.lights.directionalLight.position, 'z').min(-100).max(100).step(0.0001);
        directionalLight.add(this.lights.directionalLight, 'intensity').min(0).max(10).step(0.0001);
    }

    setAmbientLightGui() {
        if(!this.lights.ambientLight) return;
        const ambientLight = this.lightsFolder.addFolder('ambientLight');
        ambientLight.add(this.lights.ambientLight, 'intensity').min(0).max(10).step(0.0001);
        ambientLight.addColor(this.lights.ambientLight, 'color').onChange((color) => {
            this.lights.ambientLight.color.set(color);
        })
    }
}