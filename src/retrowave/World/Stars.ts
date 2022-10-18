import * as THREE from "three";
import {getRandomArbitrary} from "./World";
import starsVertexShader from "../shaders/stars/vertex.glsl";
import starsFragmentShader from "../shaders/stars/fragment.glsl";
import Main from "../Main";
import {randFloat} from "three/src/math/MathUtils";
import {BufferGeometry, Points, ShaderMaterial} from "three";

export default class Stars {
    main = new Main();
    scene = this.main.scene;
    sizes = this.main.sizes;

    geometry: BufferGeometry;
    material: ShaderMaterial;
    points: Points;

    constructor() {
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.BufferGeometry();

        const count = 2500;
        const scales = new Float32Array(count * 1);
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const randomX = randFloat(-500, 500);
            const randomY = randFloat(5, 500);
            const randomZ = randFloat(-500, 500);

            positions[i3] = randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = randomZ;

            scales[i] = Math.random();
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            uniforms:
                {
                    uSize: {value: 1000 * this.sizes.pixelRatio}
                },
            vertexShader: starsVertexShader,
            fragmentShader: starsFragmentShader
        })
    }

    setMesh() {
        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }
}