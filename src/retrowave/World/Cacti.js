import Main from "../Main";
import * as THREE from "three";
import {getRandomArbitrary, setEnvironmentIntensity} from "./World";

export default class Cacti {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;
        this.moveGroup = this.main.world.moveGroup;

        this.cacti = [];
        this.group = new THREE.Group();

        this.setModel();
    }

    setModel() {
        const meshes = this.resources.items.cacti.scene;

        meshes.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.name = 'cactus';
                this.cacti.push(child)
            }
        });

        this.cacti.forEach(cactus => {
            cactus.position.y = -0.5;
            cactus.rotation.x = -Math.PI * 0.5;
        })

        setEnvironmentIntensity(meshes, 2.7);

        for (let i = 0; i < 100; i++) {
            const randomNumber = Math.round(THREE.Math.randFloat(0, this.cacti.length - 1));
            const c = this.cacti[randomNumber].clone();
            c.position.x = THREE.Math.randFloat(-500, 500);
            c.position.z = THREE.Math.randFloat(-23, -150);
            c.rotation.z = Math.PI * THREE.Math.randFloat(0, 2);
            this.group.add(c);
        }

        this.moveGroup.add(this.group);
    }
}