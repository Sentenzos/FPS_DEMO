import Main from "../Main";
import * as THREE from "three";
import {Object3D, Vector3} from "three";
import {setDefaultForAllTextures} from "../js/textureHandlers";
import grassVertexShader from '../shaders/grass/vertex.glsl';
import grassFragmentShader from '../shaders/grass/fragment.glsl';
import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {mergeVertices} from "three/examples/jsm/utils/BufferGeometryUtils";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import scene from "three/examples/jsm/offscreen/scene";
import * as starsFragmentShader from '../shaders/stars/fragment.glsl';
import starsVertexShader from '../shaders/stars/vertex.glsl';
import speedLineVertexShader from "../../previousLessons/wavyBall/shaders/galaxy/vertex.glsl";
import speedLineFragmentShader from "../../previousLessons/wavyBall/shaders/galaxy/fragment.glsl";
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

    constructor() {
        this.createMoveGroup();

        this.resources.on('ready', () => {
            this.rocket = new Rocket();
            this.lanterns = new Lanterns();
            this.sand = new Sand();
            this.cacti = new Cacti();
            this.projectors = new Projectors();

            this.animation = new ProjectAnimation();

            this.createEnvironment();
            this.animateGround();
        })


        // this.resources.on('ready', () => {
        //     // this.animateGround();
        //     // this.createWireframes();
        //     // this.createGrass();
        //     // this.createDunes();
        //     // this.createSandShader();
        // })
    }

    createMoveGroup() {
        const moveGroup = new THREE.Group();
        moveGroup.position.x = 0;
        this.moveGroup = moveGroup;
        this.scene.add(moveGroup);
    }

    createEnvironment() {
        const environmentMap = this.resources.items.environmentMapTexture;
        environmentMap.encoding = THREE.sRGBEncoding;
        // this.scene.background = environmentMap;
        this.scene.environment = environmentMap;
    }

    createGrass() {
        const planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 100, 100);
        const planeMaterial = new THREE.ShaderMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: {
                globalTime: {value: 0.0},
                magnitude: {value: 0.6},
                uvScale: {value: new THREE.Vector2(16.0, 1.0)},
                lightPos: {value: new THREE.Vector3(0, 0, 0)}
            }
        })

        this.time.on('tick', () => {
            planeMaterial.uniforms.globalTime.value += this.time.delta * 0.0012;
        })

        const mesh = new THREE.Mesh(planeGeometry, planeMaterial);

        mesh.rotation.x = Math.PI * -0.5;
        // mesh.position.y = 1;

        this.moveGroup.add(mesh);

        // uniforms = setUniforms(grassTexture);
        // grassMaterial = getGrassShaderMaterial(uniforms);
        const planesGeometry = createPlanesGeometry(350);
        planesGeometry.applyMatrix4(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 0, -200)));
        const planes = new THREE.Mesh(planesGeometry, planeMaterial);
        planes.position.set(0, 200, 0);
        planes.matrixAutoUpdate = false;

        this.moveGroup.add(planes);
    }

    createDunes() {
        // gltfLoader.load('/resources/mountains/scene.gltf', (gltf) => {
        //     const dunes = gltf.scene;
        //     dunes.scale.set(5, 5, 5);
        //     dunes.position.z = -300;
        //     // dunes.position.x = 0;
        //
        //
        //     this.scene.add(dunes);
        // })
    }

    addLastMesh({meshNumber, placeToAdd, mesh, geometry, material, direction, space, callback}: {meshNumber: number, placeToAdd: Object3D, mesh: THREE.Mesh, geometry: THREE.BufferGeometry, material: THREE.Material, direction, space, callback}) {
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

    removeLastMesh(group) {
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

            positions[i3 + 0] = THREE.Math.randFloat(-100, 100);
            positions[i3 + 1] = Math.pow(THREE.Math.randFloat(0.15, 1), 2);
            positions[i3 + 2] = THREE.Math.randFloat(-50, -20);
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


function createPlanesGeometry(n_planes) {
    let containerGeometry = new THREE.BufferGeometry();
    const planeGeometry = new THREE.PlaneGeometry(400, 30, 14, 1);
    console.log(planeGeometry)

    const position = planeGeometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
        //i*3 - это X, i*3 + 2 - это Z
        position.array[i * 3 + 2] = Math.sin(position.array[i * 3]) * 20
        // planeGeometry.vertices[i].z = Math.sin(planeGeometry.vertices[i].x)*20;
    }
    // planeGeometry.applyMatrix4( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 15, 0 ) ) );
    let x = 0;
    let z = 0;
    let rot = (Math.PI * 2) / 3;

    // const mesh = new THREE.Mesh(planeGeometry);
    // console.log(mesh)
    let arr = []

    for (let i = 0; i < 1; i++) {
        const geometry = planeGeometry.clone();

        geometry.rotateY((i % 3 * rot) + Math.random() - 0.5);
        geometry.translate((x * 50 - 250) + (Math.random() * 20 - 10), 0, (z * 80 - 180) + (Math.random() * 20 - 10));
        geometry.scale(1.0, 1.1 - Math.random() * 0.4, 1.0);

        if (i % 3 === 2) {
            ++x;
        }
        if (x === 11) {
            x = 0;
            ++z;
        }

        // mesh.updateMatrix();

        console.log(geometry)
        arr.push(geometry);

        containerGeometry = mergeBufferGeometries(arr);
        // containerGeometry = mergeVertices(mesh.geometry);
    }
    console.log(containerGeometry)
    // I've used a BufferGeometry only here, and not previously, because buffered geometries
    // do not work with the merge method
    return containerGeometry;
    // const bufferedGeometry = new THREE.BufferGeometry().fromGeometry(containerGeometry);
    // return bufferedGeometry;
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getSize(mesh) {
    let cubeBoundingBox = new THREE.Box3().setFromObject(mesh);
    let boxSize = new THREE.Vector3();
    cubeBoundingBox.getSize(boxSize);
    return boxSize
}

export function setEnvironmentIntensity(model, intensity) {
    model.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = intensity;
        }
    })
}

function removeMesh(meshUuid, scene) {
    scene.traverse(child => {
        let objToDelete = child.children.find(c => c.uuid === meshUuid);
        if (objToDelete) {
            child.remove(objToDelete);
            if (child instanceof THREE.Mesh) {
                objToDelete.geometry.dispose();
                objToDelete.material.dispose();
            }
            objToDelete = undefined;
        }
    })
}

function removeMeshesByCallback(group, callback) {
    group.traverse(child => {
        let objsToDelete = child.children.filter(c => callback(c));
        objsToDelete.forEach(obj => {
            child.remove(obj);
            if (child instanceof THREE.Mesh) {
                obj.geometry.dispose();
                obj.material.dispose();
            }
            obj = undefined;
        })
    })
}