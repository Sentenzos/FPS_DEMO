import Experience from "../Experience";
import * as THREE from 'three';


export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        //Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment');

        }

        this.setSunlight();
        this.setEnvironmentMap();
    }

    setSunlight() {
        this.sunlight = new THREE.DirectionalLight('#ffffff', 4);
        this.sunlight.castShadow = true
        this.sunlight.shadow.camera.far = 15
        this.sunlight.shadow.mapSize.set(1024, 1024)
        this.sunlight.shadow.normalBias = 0.05
        this.sunlight.position.set(3.5, 2, -1.25)
        this.scene.add(this.sunlight);

        //Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.sunlight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder.add(this.sunlight.position, 'x').name('sunLightX').min(-5).max(5).step(0.001);
            this.debugFolder.add(this.sunlight.position, 'y').name('sunLightY').min(-5).max(5).step(0.001);
            this.debugFolder.add(this.sunlight.position, 'z').name('sunLightZ').min(-5).max(5).step(0.001);
        }
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.encoding = THREE.sRGBEncoding;

        this.scene.environment = this.environmentMap.texture;

        //Иногда энвайрмент может не применяться на объекты сцены из-за того что энвайрмент загрузился позже моделей
        //По этому обновляем материалы после загрузки энвайрмент
        this.environmentMap.updateMaterials = () => {
            this.scene.traverse(child => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }
        this.environmentMap.updateMaterials();

        //Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}