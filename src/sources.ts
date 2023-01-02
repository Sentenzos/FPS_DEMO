export type SourcesObjType = {
    name: string,
    type: 'gltfModel' | 'fbxModel' |'texture' | 'cubeTexture',
    path: string | string[]
};

export type SourcesArrType = SourcesObjType[];

const sources: SourcesArrType = [
    {
        name: 'playerModel',
        type: 'gltfModel',
        path: '/resources/soldierGLTF/scene.gltf'
    },

]

export default sources