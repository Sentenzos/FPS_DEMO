import * as THREE from 'three';
import {getSize} from "../Utils/js/getSize";

export class Player {
    mesh: THREE.Mesh;
    geometry: THREE.PlaneGeometry;
    material: THREE.MeshBasicMaterial

    constructor(public scene: THREE.Scene, objectName: string) {
        this.setModel(scene);
        this.setObjectName(objectName);
    }

    setModel(scene:  THREE.Scene) {
        this.geometry = new THREE.BoxGeometry(1.8, 0.5, 0.2);
        this.material = new THREE.MeshBasicMaterial({color: 'blue'});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.z += Math.PI * 0.5;

        const size = getSize(this.mesh);

        this.mesh.position.y += size.y / 2 + 0.02;

        scene.add(this.mesh);
    }

    setObjectName(name: string) {
        this.mesh.name = name;
    }
}