import * as THREE from 'three';
import {LinearFilter, RGBAFormat, Scene} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {GlitchPass} from "three/examples/jsm/postprocessing/GlitchPass";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";
import {RGBShiftShader} from "three/examples/jsm/shaders/RGBShiftShader";
import {DotScreenPass} from "three/examples/jsm/postprocessing/DotScreenPass";
import Camera from "./Camera";
import {Vector2} from "three/src/Three";
import Sizes from "./Sizes";

export default class Renderer {
    camera: typeof Camera.prototype.camera;
    renderer: THREE.WebGLRenderer;
    renderTarget: THREE.WebGLRenderTarget;
    effectComposer: EffectComposer;

    constructor(public sizes: Sizes,
                public scene: THREE.Scene,
                public canvas: HTMLCanvasElement,
                camera: Camera) {
        this.canvas = canvas;
        this.sizes = sizes;
        this.scene = scene;
        this.camera = camera.camera;

        this.setRenderer();
        this.setComposer();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
        this.renderer.shadowMap.enabled = true;

        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 1.75;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor('#000000');

        this.resize();
    }

    setComposer() {
        let RenderTargetClass = null;

        //Если браузер поддерживает WebGLMultisampleRenderTarget, то используем его - это включит MSAA
        if (this.renderer.getPixelRatio() === 1 && this.renderer.capabilities.isWebGL2) {
            RenderTargetClass = THREE.WebGLMultisampleRenderTarget;
        } else {
            RenderTargetClass = THREE.WebGLRenderTarget;
        }

        this.renderTarget = new RenderTargetClass(
            //ширину и высоту можно ставить любую, так как мы все равно переназначаем ее ниже в effectComposer
            800, 600,
            {
                minFilter: LinearFilter,
                magFilter: LinearFilter,
                format: RGBAFormat
            }
        );

        this.effectComposer = new EffectComposer(this.renderer, this.renderTarget);
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio);
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.effectComposer.addPass(renderPass);

        // const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(), 5, 0.64, 0.1);
        // this.effectComposer.addPass(unrealBloomPass);
    }

    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.effectComposer.render()
    }
}