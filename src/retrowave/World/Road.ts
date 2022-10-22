import * as THREE from "three";
import Main from "../Main";
import {setDefaultForAllTextures} from "../js/textureHandlers";
import {Texture} from "three";
import World from "./World";

type textures = {

}

export default class Road {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    addLastMesh: typeof World.prototype.addLastMesh = this.main.world.addLastMesh;
    moveGroup = this.main.world.moveGroup;
    textures: {[key: string]: Texture};
    roadGeometry: THREE.PlaneGeometry;
    roadMaterial: THREE.MeshStandardMaterial;

    group = new THREE.Group();
    ROAD_LENGTH = 40;


    constructor() {
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.roadGeometry = new THREE.PlaneGeometry(this.ROAD_LENGTH, 40, 1000, 1000);
    }

    setMaterial() {
        this.textures = {
            map: this.resources.items.roadColor as Texture,
            aoMap: this.resources.items.roadAO as Texture,
            normalMap: this.resources.items.roadNormal as Texture,
            roughnessMap: this.resources.items.roadRoughness as Texture,
        }

        setDefaultForAllTextures({
            textures: [
                this.textures.map, this.textures.aoMap, this.textures.normalMap, this.textures.roughnessMap
            ], repeat: {x: 8, y: 8}, anisotropy: 8
        })

        this.roadMaterial = new THREE.MeshStandardMaterial({
            ...this.textures,
            aoMapIntensity: 3,
            transparent: true,
            normalScale: new THREE.Vector2(0.2, 0.2),
        });
    }

    setMesh() {
        this.addLastMesh({
            geometry: this.roadGeometry,
            material: this.roadMaterial,
            placeToAdd: this.group,
            meshNumber: 3,
            direction: 'pos',
            space: this.ROAD_LENGTH,
            callback: (mesh) => {
                mesh.position.set(0, 0.1, 0)
                mesh.rotation.x = Math.PI * -0.5;
                mesh.receiveShadow = true;
            }
        });

        this.addLastMesh({
            geometry: this.roadGeometry,
            material: this.roadMaterial,
            placeToAdd: this.group,
            meshNumber: 3,
            direction: 'neg',
            space: this.ROAD_LENGTH,
            callback: (mesh) => {
                mesh.position.set(0, 0.1, 0)
                mesh.rotation.x = Math.PI * -0.5;
                mesh.receiveShadow = true;
            }
        });

        this.moveGroup.add(this.group);
    }
}