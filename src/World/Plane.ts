import * as THREE from 'three';

export class Plane {
    mesh: THREE.Mesh;
    geometry: THREE.PlaneGeometry;
    material: THREE.MeshBasicMaterial

    constructor(public scene: THREE.Scene) {
        this.setModel(scene);
    }

    setModel(scene:  THREE.Scene) {
        this.geometry = new THREE.PlaneGeometry(50, 50, 1, 1);
        this.material = new THREE.MeshBasicMaterial({color: 'grey', side: THREE.DoubleSide});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x += Math.PI * 0.5;
        scene.add(this.mesh)
    }
}