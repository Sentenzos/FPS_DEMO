import Main from "../Main";
import * as THREE from "three";
import {getRandomArbitrary} from "./World";

export default class Rocks {
    constructor() {
        this.main = new Main();
        this.scene = this.main.scene;
        this.resources = this.main.resources;
        this.moveGroup = this.main.world.moveGroup;

        this.rocks = [];
        this.group = new THREE.Group();

        this.setModel();
    }

    setModel() {
        const meshes = this.resources.items.rocks.scene;

        meshes.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.name = 'rock';
                this.rocks.push(child)
            }
        })

        //TODO камни хз куда добавляются. В объекте rocks их нет (также посмотреть кактусы на предмет похожей проблемы)
        for (let i = 0; i < 150; i++) {
            const a = THREE.Math.randInt()
            const randomNumber = THREE.Math.randInt(0, this.rocks.length - 1);
            const rock = this.rocks[randomNumber].clone();
            rock.position.set(THREE.Math.randInt(-500, 500), 0, THREE.Math.randInt(-150, -15));
            rock.rotation.y = Math.PI * Math.random();
            const scale = THREE.Math.randFloat(0.004, 0.008);
            rock.scale.set(scale, scale, scale);
            this.group.add(rock);
        }

        this.moveGroup.add(this.group);
    }
}