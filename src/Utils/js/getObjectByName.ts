import * as THREE from 'three';

export function getObjectByName(scene: THREE.Scene, name: string): THREE.Object3D {
    let result: THREE.Object3D;

    scene.traverse(child => {
        if (child.name === name && child) {
            result = child;
        }
    });

    return result;
}