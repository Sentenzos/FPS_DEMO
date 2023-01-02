import * as THREE from "three";

export function getSize(object: THREE.Object3D, vec3?: THREE.Vector3): THREE.Vector3 {
    const boundingBox = new THREE.Box3().setFromObject(object);
    return boundingBox.getSize(new THREE.Vector3());
}