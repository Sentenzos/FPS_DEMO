import * as THREE from "three";

export function setDefaultForAllTextures({textures, repeat = {}, anisotropy}) {
    textures.forEach((texture) => {
        const {x, y} = repeat;
        setTextureDefaults({texture, x, y, anisotropy});
    })
}

export function setTextureDefaults({texture, x, y, anisotropy = 16}) {
    if (x || y) {
        texture.repeat.set(x, y);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    }
    texture.anisotropy = anisotropy;
}