import * as THREE from "three";
import Main from "../Main";
import {Scene} from "three";
import Resources from "../utils/Resources";
import {SourcesArrType} from "../sources";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class Car {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    carWheels: THREE.Mesh[];
    group: THREE.Group;
    car: THREE.Object3D

    constructor() {
        this.setModel();
    }

    setModel() {
        this.car = (this.resources.items.carModel as GLTF).scene.children[0].children[0];

        this.car.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (child.name === 'Headlight_Glass_GENERIC_LIGHT_GLASS_0') child.material = new THREE.MeshBasicMaterial({color: 0xf9c80e});
                if (child.name.startsWith('Wheel')) this.carWheels.push(child);
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })

        this.car.position.y = 0.1;
        this.car.rotation.x = Math.PI * -0.5;
        this.car.scale.set(0.04, 0.04, 0.04);

        this.group.position.z = 5;
        this.group.add(this.car);


        const light1 = new THREE.SpotLight(0xf9c80e, 4, 30, Math.PI * 0.15, 2,);
        light1.position.set(-2.5, 0.9, 0.8);
        light1.target.position.set(-15, 0.9, 0.8);

        const light2 = new THREE.SpotLight(0xf9c80e, 4, 30, Math.PI * 0.15, 2,);
        light2.position.set(-2.5, 0.9, -0.8);
        light2.target.position.set(-15, 0.9, -0.8);

        this.group.add(light1, light1.target, light2, light2.target);
        this.group.scale.set(1.1, 1.1, 1.1,)


        this.scene.add(this.group);
    }
}