import * as THREE from "three";
import Main from "../Main";

export default class Moon {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;

        this.group = new THREE.Group();
        this.moon = null;

        this.setModel();
    }

    setModel() {
        this.group.position.z = -300;
        this.group.position.y = 50;

        this.moon = this.resources.items.moon.scene;

        this.moon.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.scale.set(15, 15, 15);
            }
        })

        this.pointLight = new THREE.PointLight(0xffffff, 20, 30);

        this.group.add(this.moon);
        this.group.add(this.pointLight);

        this.pointLight.lookAt(this.moon.position);
        this.pointLight.position.set(10, -5, 25);

        this.scene.add(this.group);
    }
}