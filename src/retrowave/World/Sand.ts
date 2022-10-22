import Main from "../Main";
import * as THREE from "three";
import {setDefaultForAllTextures} from "../js/textureHandlers";
import World from "./World";
import {Texture} from "three";

export default class Sand {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    addLastMesh: typeof World.prototype.addLastMesh = this.main.world.addLastMesh;
    moveGroup: typeof World.prototype.moveGroup = this.main.world.moveGroup;

    group = new THREE.Group();
    SAND_LENGTH = 100;
    textures: {[key: string]: Texture};
    sandGeometry: THREE.PlaneGeometry;
    sandMaterial: THREE.MeshStandardMaterial;

    constructor() {
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.sandGeometry = new THREE.PlaneGeometry(this.SAND_LENGTH, 1000);
    }

    setMaterial() {
        this.textures = {
            map: this.resources.items.sandColor as Texture,
            normalMap: this.resources.items.sandNormal as Texture,
            roughnessMap: this.resources.items.sandMetallic as Texture,
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