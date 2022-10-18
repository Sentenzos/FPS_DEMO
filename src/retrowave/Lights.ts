import * as THREE from 'three';
import Main from "./Main";
import {Scene} from "three";

export default class Lights {
    main: Main = new Main();
    scene: Scene = this.main.scene;
    pointLight: THREE.PointLight;
    directionalLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;

    constructor() {
        // this.setPointLight()
        // this.setDirectionalLight();
        this.setAmbientLight();
    }

    setPointLight() {
        this.pointLight = new THREE.PointLight(0x8532ae, 5, 10);
        this.pointLight.position.set(0, 5, 3);

        this.scene.add(this.pointLight);

        const helper = new THREE.PointLightHelper(this.pointLight);
        this.scene.add( helper );
    }

    setDirectionalLight() {
        this.directionalLight = new THREE.DirectionalLight(0x00fffc, 0);
        this.directionalLight.position.set(1, 0.25, 0);
        this.directionalLight.castShadow = true;
        // this.directionalLight.lookAt(new THREE.Vector3())

        this.scene.add(this.directionalLight);

        // const helper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
        // helper.lookAt(new THREE.Vector3())
        // this.scene.add( helper );
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0x3251ae, 0);
        this.scene.add(this.ambientLight);
    }
}