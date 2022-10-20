import Main from "../Main";
import * as THREE from "three";
import {getRandomArbitrary} from "./World";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {randFloat, randInt} from "three/src/math/MathUtils";

export default class Rocks {
    main = new Main();
    scene = this.main.scene;
    resources = this.main.resources;
    moveGroup = this.main.world.moveGroup;

    rocks: THREE.Mesh[] = [];
    group = new THREE.Group();

    constructor() {
        this.setModel();
    }

    setModel() {
        const meshes = (this.resources.items.rocks as GLTF).scene;

        meshes.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.name = 'rock';
                this.rocks.push(child)
            }
        })

        //TODO камни хз куда добавляются. В объекте rocks их нет (также посмотреть кактусы на предмет похожей проблемы)
        for (let i = 0; i < 150; i++) {
            const randomNumber = randInt(0, this.rocks.length - 1);
            const rock = this.rocks[randomNumber].clone();
            rock.position.set(randInt(-500, 500), 0, randInt(-150, -15));
            rock.rotation.y = Math.PI * Math.random();
            const scale = randFloat(0.004, 0.008);
            rock.scale.set(scale, scale, scale);
            this.group.add(rock);
        }

        this.moveGroup.add(this.group);
    }
}