import Main from "./Main";
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
import Sizes from "./utils/Sizes";
import Camera from "./Camera";
import {Vector2} from "three/src/Three";

export default class Renderer {
    main: Main = new Main();
    canvas: HTMLCanvasElement = this.main.canvas;
    sizes: Sizes = this.main.sizes;
    scene: Scene = this.main.scene;
    camera: typeof Camera.prototype.camera = this.main.camera.camera;
    renderer: THREE.WebGLRenderer;
    renderTarget: THREE.WebGLRenderTarget;
    effectComposer: EffectComposer;


    constructor() {
        this.main = new Main();
        this.canvas = this.main.canvas;
        this.sizes = this.main.sizes;
        this.scene = this.main.scene;
        this.camera = this.main.camera.camera;

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

        // const glitchPass = new GlitchPass();
        // glitchPass.goWild = false;
        // glitchPass.enabled = true;
        // this.effectComposer.addPass(glitchPass);

        // const rgbShiftPass = new ShaderPass(RGBShiftShader); //Это не просто эффект, это шейдер, так что объявляется немного по другому
        // rgbShiftPass.enabled = false;
        // this.effectComposer.addPass(rgbShiftPass);


        // //Фиксит гамму, которую ломают другие passes
        // const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
        // this.effectComposer.addPass(gammaCorrectionPass);

        const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(), 5, 0.64, 0.1);
        this.effectComposer.addPass(unrealBloomPass);
    }

    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        // this.renderer.render(this.scene, this.camera);
        this.effectComposer.render()
        // this.resize();
    }
}