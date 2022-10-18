import * as THREE from "three";
import Main from "../Main";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class Fence {
    main = new Main();
    resources = this.main.resources;
    addLastMesh = this.main.world.addLastMesh;
    moveGroup = this.main.world.moveGroup;

    mesh: THREE.Object3D;
    group = new THREE.Group();
    FENCE_LENGTH = 5.5;

    constructor() {
        this.setModel();
    }

    setModel() {
        this.mesh = (this.resources.items.fence as GLTF).scene;
        this.mesh.rotation.y = Math.PI * 2;
        this.mesh.scale.set(3.5, 3.5, 3.5);
        this.mesh.traverse(child => {
            if (child instanceof THREE.Mesh) child.castShadow = true;
        })

        this.mesh.position.y = 0.5
        this.mesh.position.z = -14;

        this.addLastMesh({
            mesh: this.mesh,
            placeToAdd: this.group,
            meshNumber: 25,
            direction: 'pos',
            space: this.FENCE_LENGTH
        });

        this.addLastMesh({
            mesh: this.mesh,
            placeToAdd: this.group,
            meshNumber: 25,
            direction: 'neg',
            space: this.FENCE_LENGTH
        });

        this.moveGroup.add(this.group);
    }
}