import EventEmitter from "../../previousLessons/code_structuring/Experience/Utils/EventEmitter";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';
import {SourcesArrType, SourcesObjType} from "../sources";
import {CubeTexture, Texture} from "three";


export default class Resources extends EventEmitter {
    items: { [key: string]: GLTF | Texture | CubeTexture };
    toLoad: number = this.sources.length;
    loaded: number = 0;
    loaders: {
        gltfLoader: GLTFLoader,
        textureLoader: THREE.TextureLoader,
        cubeTextureLoader: THREE.CubeTextureLoader
    }


    constructor(public sources: SourcesArrType) {
        super();
        this.setLoader();
        this.startLoading();
    }

    setLoader(): void {
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }

    startLoading(): void {
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path as string,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path as string,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path as string[],
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
        }
    }

    sourceLoaded(source: SourcesObjType, file: GLTF | Texture | CubeTexture): void {
        this.items[source.name] = file as GLTF | Texture | CubeTexture;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }
}