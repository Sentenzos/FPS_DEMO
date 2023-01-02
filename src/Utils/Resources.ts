import EventEmitter from "./EventEmitter";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';
import {SourcesArrType, SourcesObjType} from "../sources";
import {CubeTexture, Group, Texture} from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";


export default class Resources extends EventEmitter {
    items: { [key: string]: GLTF | Group | Texture | CubeTexture } = {};
    toLoad: number = this.sources.length;
    loaded: number = 0;
    loaders = {
        gltfLoader: new GLTFLoader(),
        fbxLoader: new FBXLoader(),
        textureLoader: new THREE.TextureLoader(),
        cubeTextureLoader: new THREE.CubeTextureLoader()
    }

    constructor(public sources: SourcesArrType) {
        super();
        this.startLoading();
    }

    startLoading(): void {
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path as string,
                    (file) => {
                        console.log(file)
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if (source.type === 'fbxModel') {
                this.loaders.fbxLoader.load(
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

    sourceLoaded(source: SourcesObjType, file: GLTF | Group | Texture | CubeTexture): void {
        this.items[source.name] = file as GLTF | Texture | CubeTexture;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }
}