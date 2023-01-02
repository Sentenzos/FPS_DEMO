import * as THREE from 'three';
import {getSize} from "../Utils/js/getSize";
import {Group, Object3D} from "three";
import Resources from "../Utils/Resources";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export class Player {
    object: Object3D;
    geometry: THREE.PlaneGeometry;
    material: THREE.MeshBasicMaterial;
    player: Object3D;
    items: typeof Resources.prototype.items;

    constructor(items: typeof Resources.prototype.items, public scene: THREE.Scene, objectName: string) {
        this.items = items;

        this.setModel(scene);
        this.setObjectName(objectName);
    }

    setModel(scene:  THREE.Scene) {
        this.object = (this.items.playerModel as GLTF).scene;
        this.object.scale.set(5,5,5)

        scene.add(this.object);
    }

    setObjectName(name: string) {
        this.object.name = name;
    }
}