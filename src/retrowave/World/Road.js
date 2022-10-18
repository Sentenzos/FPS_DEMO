import * as THREE from "three";
import Main from "../Main";
import {setDefaultForAllTextures} from "../js/textureHandlers";

export default class Road {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;
        this.addLastMesh = this.main.world.addLastMesh;
        this.moveGroup = this.main.world.moveGroup;

        this.group = new THREE.Group();
        this.ROAD_LENGTH = 40;
        this.roadGeometry = null;
        this.roadMaterial = null;

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.roadGeometry = new THREE.PlaneBufferGeometry(this.ROAD_LENGTH, 40, 1000, 1000);
        this.roadGeometry.setAttribute('uv2', new THREE.Float32BufferAttribute(this.roadGeometry.attributes.uv, 2));
    }

    setMaterial() {
        this.textures = {
            map: this.resources.items.roadColor,
            aoMap: this.resources.items.roadAO,
            normalMap: this.resources.items.roadNormal,
            metallicness: this.resources.items.roadMetallic,
            roughnessMap: this.resources.items.roadRoughness,
            // displacementMap: this.resources.items.roadHeight,
        }

        setDefaultForAllTextures({
            textures: [
                this.textures.map, this.textures.aoMap, this.textures.normalMap,
                this.textures.metallicness, this.textures.roughnessMap
            ], repeat: {x: 8, y: 8}, anisotropy: 8
        })

        this.roadMaterial = new THREE.MeshStandardMaterial({
            // color: 0x023788,
            ...this.textures,
            aoMapIntensity: 3,
            transparent: true,
            normalScale: new THREE.Vector2(0.2, 0.2),
            // displacementMap: roadHeightTexture,
            // displacementScale: 0.1,
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