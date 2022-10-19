import Main from "../Main";
import * as THREE from "three";
import World, {getRandomArbitrary, setEnvironmentIntensity} from "./World";
import {Object3D} from "three";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {randFloat} from "three/src/math/MathUtils";

export default class Cacti {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    moveGroup: typeof World.prototype.moveGroup = this.main.world.moveGroup;

    cacti: THREE.Mesh[] = [];
    group = new THREE.Group();

    constructor() {
        this.setModel();
    }

    setModel() {
        const meshes = (this.resources.items.cacti as GLTF).scene;

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
            const randomNumber = Math.round(randFloat(0, this.cacti.length - 1));
            const c = this.cacti[randomNumber].clone();
            c.position.x = randFloat(-500, 500);
            c.position.z = randFloat(-23, -150);
            c.rotation.z = randFloat(0, 2);
            this.group.add(c);
        }

        this.moveGroup.add(this.group);
    }
}