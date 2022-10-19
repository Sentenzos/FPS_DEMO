import * as THREE from "three";
import Main from "../Main";
import World from "./World";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class Lanterns {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    addLastMesh: typeof World.prototype.addLastMesh = this.main.world.addLastMesh;
    moveGroup: typeof World.prototype.moveGroup = this.main.world.moveGroup;

    lanternLight: THREE.PointLight;
    mesh: THREE.Object3D;
    group = new THREE.Group();
    SPACE = 50;
    object3D = new THREE.Group();

    constructor() {
        this.setLight();
        this.setModel();
    }

    setLight() {
        this.lanternLight = new THREE.PointLight(0x8532ae, 6, 40);
        this.lanternLight.position.y = 7;
        this.lanternLight.castShadow = true;
        this.lanternLight.shadow.mapSize.width = 256;
        this.lanternLight.shadow.mapSize.height = 256;
        this.lanternLight.shadow.radius = 5;
        this.lanternLight.shadow.camera.far = 6;


        this.object3D.add(this.lanternLight);
    }

    setModel() {
        this.mesh = (this.resources.items.streetLamp as GLTF).scene;

        this.mesh.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (child.name === 'Light_high') child.material = new THREE.MeshBasicMaterial({color: 0x8532ae});
                child.castShadow = true;
                child.material.envMapIntensity = 5
            }
        });

        this.mesh.rotation.y = -Math.PI * 0.5;
        this.mesh.position.z = -12.5;
        this.mesh.scale.set(2.7, 2.7, 2.7);
        this.object3D.add(this.mesh);


        this.addLastMesh({
            mesh: this.object3D,
            placeToAdd: this.group,
            meshNumber: 2,
            direction: 'neg',
            space: this.SPACE
        });

        this.moveGroup.add(this.group);
    }
}