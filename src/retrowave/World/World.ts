import Main from "../Main";
import * as THREE from "three";
import {CubeTexture, Object3D, Vector3} from "three";
import sandVertexShader from "../../previousLessons/sandShader/shaders/galaxy/vertex.glsl";
import sandFragmentShader from "../../previousLessons/sandShader/shaders/galaxy/fragment.glsl";
import Car from "./Car";
import Driver from "./Driver";
import Fence from "./Fence";
import City from "./City";
import Rocks from "./Rocks";
import Moon from "./Moon";
import Stars from "./Stars";
import Fog from "./Fog";
import Ufo from "./Ufo";
import Road from "./Road";
import Rocket from "./Rocket";
import Lanterns from "./Lanterns";
import Sand from "./Sand";
import Cacti from "./Cacti";
import Projectors from "./Projectors";
import ProjectAnimation from "./ProjectAnimation";
import Time from "../utils/Time";
import Renderer from "../Renderer";
import Sizes from "../utils/Sizes";
import Resources from "../utils/Resources";
import {randFloat} from "three/src/math/MathUtils";



export default class World {
    main = new Main();
    scene = this.main.scene;
    time = this.main.time;
    renderer = this.main.renderer;
    sizes = this.main.sizes;
    // gui = this.main.gui;
    resources: Resources = this.main.resources;
    car = new Car();
    driver = new Driver();
    fence = new Fence();
    city = new City();
    rocks = new Rocks();
    moon = new Moon();
    stars = new Stars();
    fog = new Fog();
    ufo = new Ufo();
    road = new Road();
    rocket = new Rocket();
    lanterns = new Lanterns();
    sand = new Sand();
    cacti = new Cacti();
    projectors = new Projectors();
    animation: ProjectAnimation;
    moveGroup: THREE.Group;

    constructor() {
        this.createMoveGroup();

        this.resources.on('ready', () => {
            this.animation = new ProjectAnimation();
            this.createEnvironment();
            this.animateGround();
        })
    }

    createMoveGroup() {
        const moveGroup = new THREE.Group();
        moveGroup.position.x = 0;
        this.moveGroup = moveGroup;
        this.scene.add(moveGroup);
    }

    createEnvironment() {
        const environmentMap = this.resources.items.environmentMapTexture as CubeTexture;
        environmentMap.encoding = THREE.sRGBEncoding;
        // this.scene.background = environmentMap;
        this.scene.environment = environmentMap;
    }

    addLastMesh({meshNumber, placeToAdd, mesh, geometry, material, direction, space, callback}:
                    {meshNumber: number,
                        placeToAdd: Object3D,
                        mesh?: THREE.Object3D,
                        geometry?: THREE.BufferGeometry,
                        material?: THREE.Material,
                        direction: 'neg' | 'pos',
                        space: number,
                        callback?: (mesh: THREE.Object3D) => void}) {
        for (let i = 0; i < meshNumber; i++) {
            //TODO заменить на цикл for
            const lastMesh = placeToAdd.children.length ? placeToAdd.children.reduce((prev, current) => {
                if (prev) {
                    if (direction === 'neg') {
                        if (prev.position.x <= current.position.x) return prev;
                        if (current.position.x <= prev.position.x) return current;
                    }
                    if (direction === 'pos') {
                        if (prev.position.x >= current.position.x) return prev;
                        if (current.position.x >= prev.position.x) return current;
                    }
                }
            }) : {position: {x: direction === 'neg' ? space : -space}};

            const r = mesh ? mesh.clone() : new THREE.Mesh(geometry, material);
            if (callback) callback(r);
            if (direction === 'neg') r.position.x = lastMesh.position.x - space;
            if (direction === 'pos') r.position.x = lastMesh.position.x + space;
            placeToAdd.add(r);
        }
    }

    removeLastMesh(group: THREE.Group) {
        const lastObject3D = group.children.reduce((prev, current) => {
            if (prev) {
                if (prev.position.x >= current.position.x) return prev;
                if (current.position.x >= prev.position.x) return current;
            } else {
                return current;
            }
        });

        const meshUuid = lastObject3D.uuid;

        removeMesh(meshUuid, this.scene);
    }

    createSandShader() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(400000)

        for (let i = 0; i < 200000; i++) {
            const i3 = i * 3;

            positions[i3 + 0] = randFloat(-100, 100);
            positions[i3 + 1] = Math.pow(randFloat(0.15, 1), 2);
            positions[i3 + 2] = randFloat(-50, -20);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));


        const material = new THREE.ShaderMaterial({
            // depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            uniforms:
                {
                    uTime: {value: 0},
                },
            vertexShader: sandVertexShader,
            fragmentShader: sandFragmentShader
        })

        //@ts-ignore
        material.encoding = THREE.sRGBEncoding;

        const points = new THREE.Points(geometry, material);

        this.scene.add(points)
    }

    animateGround() {
        this.time.on('tick', () => {
            // if (this.lastMovedTime === undefined) {
            //     this.lastMovedTime = this.time.elapsed;
            //     return;
            // } else {
            //     if (this.time.elapsed - this.lastMovedTime >= 20) {
            //         console.log('passed')
            //         this.lastMovedTime = this.time.elapsed;
            //     } else {
            //         console.log(this.time.elapsed - this.lastMovedTime)
            //         return;
            //     }
            // }

            this.moveGroup.position.x += 0.5;

            const groupPosition = this.moveGroup.position.x;

            //ROAD
            if (groupPosition % this.road.ROAD_LENGTH === 0) {
                this.addLastMesh({
                    geometry: this.road.roadGeometry,
                    material: this.road.roadMaterial,
                    placeToAdd: this.road.group,
                    meshNumber: 1,
                    direction: 'neg',
                    space: this.road.ROAD_LENGTH,
                    callback: (mesh) => {
                        mesh.position.set(0, 0.1, 0)
                        mesh.rotation.x = Math.PI * -0.5;
                        mesh.receiveShadow = true;
                    }
                });
                this.removeLastMesh(this.road.group);
            }

            //FENCE
            if (groupPosition % 5.5 === 0) {
                this.addLastMesh({
                    mesh: this.fence.mesh,
                    placeToAdd: this.fence.group,
                    meshNumber: 1,
                    direction: 'neg',
                    space: this.fence.FENCE_LENGTH
                });
                this.removeLastMesh(this.fence.group);
            }

            if (groupPosition % 100 === 0) {
                //SAND
                this.addLastMesh({
                    geometry: this.sand.sandGeometry,
                    material: this.sand.sandMaterial,
                    placeToAdd: this.sand.group,
                    meshNumber: 1,
                    direction: 'neg',
                    space: this.sand.SAND_LENGTH,
                    callback: (mesh) => {
                        mesh.position.y = -0.01;
                        mesh.rotation.x = -Math.PI * 0.5
                    }
                });
                this.removeLastMesh(this.sand.group);

                //ENVIRONMENT OBJECTS
                if (groupPosition >= 400) {
                    //CACTI
                    for (let i = 0; i < 10; i++) {
                        const randomNumber = Math.round(getRandomArbitrary(0, this.cacti.cacti.length - 1));
                        const c = this.cacti.cacti[randomNumber].clone();
                        c.position.x = getRandomArbitrary(-this.moveGroup.position.x - 200, -this.moveGroup.position.x - 100);
                        c.position.z = getRandomArbitrary(-23, -150);
                        c.rotation.z = Math.PI * getRandomArbitrary(0, 2);
                        this.cacti.group.add(c);
                    }

                    //ROCKS
                    for (let i = 0; i < 10; i++) {
                        const randomNumber = Math.round(getRandomArbitrary(0, this.rocks.rocks.length - 1));
                        const rock = this.rocks.rocks[randomNumber].clone();
                        rock.position.x = getRandomArbitrary(-this.moveGroup.position.x - 200, -this.moveGroup.position.x - 100);
                        rock.position.y = 0;
                        rock.position.z = getRandomArbitrary(-150, -15)
                        rock.rotation.y = Math.PI * Math.random();
                        const scale = getRandomArbitrary(0.004, 0.008);
                        rock.scale.set(scale, scale, scale);
                        this.rocks.group.add(rock);
                    }

                    removeMeshesByCallback(this.scene, (mesh) => {
                        if ((mesh.name === 'cactus' || mesh.name === 'rock') && (mesh.position.x + this.moveGroup.position.x > 100)) return true;
                    })
                }
            }

            //LANTERNS
            if (groupPosition % 50 === 0) {
                this.addLastMesh({
                    mesh: this.lanterns.object3D,
                    placeToAdd: this.lanterns.group,
                    meshNumber: 1,
                    direction: 'neg',
                    space: this.lanterns.SPACE
                });
                this.removeLastMesh(this.lanterns.group);
            }

            //CAR WHEELS
            this.car.carWheels.forEach(wheel => {
                wheel.rotation.z += 2;
            })

            //CAR WIGGLING
            this.car.group.position.z = 5 + Math.sin(this.time.elapsed * 0.0015) * 0.05;

            //ROCKET
            if (this.rocket) {
                this.rocket.group.rotation.z -= 0.0025;
            }
        })
    }
}



export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function getSize(mesh: THREE.Object3D) {
    let cubeBoundingBox = new THREE.Box3().setFromObject(mesh);
    let boxSize = new THREE.Vector3();
    cubeBoundingBox.getSize(boxSize);
    return boxSize
}

export function setEnvironmentIntensity(model: Object3D, intensity: number) {
    model.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = intensity;
        }
    })
}

function removeMesh(meshUuid: string, scene: Object3D) {
    scene.traverse(child => {
        let objToDelete = child.children.find(c => c.uuid === meshUuid);
        if (objToDelete) {
            child.remove(objToDelete);
            if (child instanceof THREE.Mesh) {
                (objToDelete as THREE.Mesh).geometry.dispose();
                //@ts-ignore
                (objToDelete as THREE.Mesh).material.dispose();
            }
            objToDelete = undefined;
        }
    })
}

function removeMeshesByCallback(group: THREE.Object3D, callback: (argument: THREE.Object3D) => void) {
    group.traverse(child => {
        let objsToDelete = child.children.filter(c => callback(c));
        objsToDelete.forEach(obj => {
            child.remove(obj);
            if (child instanceof THREE.Mesh) {
                (obj as THREE.Mesh).geometry.dispose();
                //@ts-ignore
                (obj as THREE.Mesh).material.dispose();
            }
            obj = undefined;
        })
    })
}