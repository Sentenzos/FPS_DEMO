import * as THREE from 'three';

export class Bullets {

    constructor(public scene: THREE.Scene) {
        this.scene = scene;

        this.createBullet();
    }

    createBullet() {
        const geometry = new THREE.CylinderGeometry(1, 1, 10);
        const material = new THREE.MeshBasicMaterial({color: 'yellow'});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0.05,0.05,0.05);

        mesh.position.y += 1;
        mesh.rotation.z += Math.PI * 1.5;

        this.scene.add(mesh);
    }
}