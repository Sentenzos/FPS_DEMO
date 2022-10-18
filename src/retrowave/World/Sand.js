import Main from "../Main";
import * as THREE from "three";
import {setDefaultForAllTextures} from "../js/textureHandlers";

export default class Sand {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;
        this.addLastMesh = this.main.world.addLastMesh;
        this.moveGroup = this.main.world.moveGroup;

        this.group = new THREE.Group();
        this.SAND_LENGTH = 100;
        this.textures = null;
        this.sandGeometry = null;
        this.sandMaterial = null;

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.sandGeometry = new THREE.PlaneBufferGeometry(this.SAND_LENGTH, 1000);
    }

    setMaterial() {
        this.textures = {
            map: this.resources.items.sandColor,
            normalMap: this.resources.items.sandNormal,
            roughnessMap: this.resources.items.sandMetallic,
            // displacementMap: this.resources.items.roadHeight,
        }

        setDefaultForAllTextures({
            textures: [
                this.textures.map, this.textures.normalMap, this.textures.roughnessMap,
            ], repeat: {x: 1.5, y: 15}, anisotropy: 8
        })

        this.sandMaterial = new THREE.MeshStandardMaterial({
            color: '#e3d288',
            normalScale: new THREE.Vector2(2, 2),
            transparent: true,
            ...this.textures
        });
    }

    setMesh() {
        this.addLastMesh({
            geometry: this.sandGeometry,
            material: this.sandMaterial,
            placeToAdd: this.group,
            meshNumber: 3,
            direction: 'pos',
            space: this.SAND_LENGTH,
            callback: (mesh) => {
                mesh.position.y = -0.01;
                mesh.rotation.x = -Math.PI * 0.5
            }
        });

        this.addLastMesh({
            geometry: this.sandGeometry,
            material: this.sandMaterial,
            placeToAdd: this.group,
            meshNumber: 3,
            direction: 'neg',
            space: this.SAND_LENGTH,
            callback: (mesh) => {
                mesh.position.y = -0.01;
                mesh.rotation.x = -Math.PI * 0.5
            }
        });


        this.moveGroup.add(this.group);
    }
}