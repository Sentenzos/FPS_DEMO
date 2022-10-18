import * as THREE from "three";
import Main from "../Main";

export default class Lanterns {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;
        this.addLastMesh = this.main.world.addLastMesh;
        this.moveGroup = this.main.world.moveGroup;

        this.lanternLight = null;
        this.mesh = null;
        this.group = new THREE.Group();
        this.SPACE = 50;
        this.object3D = new THREE.Group();

        this.setLight();
        this.setModel();
    }

    setLight() {
        this.lanternLight = new THREE.PointLight(0x8532ae, 6, 40);
        this.lanternLight.position.y = 7;
        this.lanternLight.castShadow = true;
        this.lanternLight.shadow.mapSize.width = 256;
        this.lanternLight.shadow.mapSize.height = 256;
        this.lanternLight.shadow.radius = 5;
        this.lanternLight.shadow.camera.far = 6;


        this.object3D.add(this.lanternLight);
    }

    setModel() {
        this.mesh = this.resources.items.streetLamp.scene;

        this.mesh.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (child.name === 'Light_high') child.material = new THREE.MeshBasicMaterial({color: 0x8532ae});
                child.castShadow = true;
                child.material.envMapIntensity = 5
            }
        });

        this.mesh.rotation.y = -Math.PI * 0.5;
        this.mesh.position.z = -12.5;
        this.mesh.scale.set(2.7, 2.7, 2.7);
        this.object3D.add(this.mesh);


        this.addLastMesh({
            mesh: this.object3D,
            placeToAdd: this.group,
            meshNumber: 2,
            direction: 'neg',
            space: this.SPACE
        });

        this.moveGroup.add(this.group);
    }
}