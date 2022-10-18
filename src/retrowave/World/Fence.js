import * as THREE from "three";
import Main from "../Main";

export default class Fence {
    constructor() {
        this.main = new Main();
        this.resources = this.main.resources;
        this.addLastMesh = this.main.world.addLastMesh;
        this.moveGroup = this.main.world.moveGroup;

        this.mesh = null;
        this.group = new THREE.Group();
        this.FENCE_LENGTH = 5.5;

        this.setModel();
    }

    setModel() {
        this.mesh = this.resources.items.fence.scene;
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