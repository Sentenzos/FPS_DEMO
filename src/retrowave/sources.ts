export type SourcesObjType = {
    name: string,
    type: 'gltfModel' | 'texture' | 'cubeTexture',
    path: string | string[]
};

export type SourcesArrType = SourcesObjType[];

const sources: SourcesArrType = [
    //1
    {
        name: 'carModel',
        type: 'gltfModel',
        path: '/resources/car.glb'
    },

    //2
    {
        name: 'carDriver',
        type: 'gltfModel',
        path: '/resources/carDriver/scene.gltf'
    },

    //3
    {
        name: 'fence',
        type: 'gltfModel',
        path: '/resources/fence.glb'
    },

    //4
    {
        name: 'city',
        type: 'gltfModel',
        path: '/resources/nagoya_downtown/scene.gltf'
    },

    //5
    {
        name: "roadColor",
        type: "texture",
        path: "/resources/asphalt/albedo.png"
    },
    {
        name: "roadAO",
        type: "texture",
        path: "/resources/asphalt/ao.png"
    },
    {
        name: "roadNormal",
        type: "texture",
        path: "/resources/asphalt/normal.png"
    },
    {
        name: "roadRoughness",
        type: "texture",
        path: "/resources/asphalt/roughness.png"
    },
    {
        name: "roadMetallic",
        type: "texture",
        path: "/resources/asphalt/metallic.png"
    },
    {
        name: "roadHeight",
        type: "texture",
        path: "/resources/asphalt/height.png"
    },

    //6
    {
        name: 'streetLamp',
        type: 'gltfModel',
        path: '/resources/streetLamp.glb'
    },

    //7
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: [
            '/resources/environmentMaps/nightCountry/px.png',
            '/resources/environmentMaps/nightCountry/nx.png',
            '/resources/environmentMaps/nightCountry/py.png',
            '/resources/environmentMaps/nightCountry/ny.png',
            '/resources/environmentMaps/nightCountry/pz.png',
            '/resources/environmentMaps/nightCountry/nz.png',
        ]
    },

    //8
    {
        name: "sandColor",
        type: "texture",
        path: "/resources/sand/color.png"
    },
    {
        name: "sandMetallic",
        type: "texture",
        path: "/resources/sand/metallicRoughness.png"
    },
    {
        name: "sandNormal",
        type: "texture",
        path: "/resources/sand/normal.png"
    },

    //9
    {
        name: 'rocks',
        type: 'gltfModel',
        path: '/resources/stylized_rocks/scene.gltf'
    },

    //10
    {
        name: 'cacti',
        type: 'gltfModel',
        path: '/resources/cactus/scene.gltf'
    },

    //11
    {
        name: 'moon',
        type: 'gltfModel',
        path: '/resources/the_moon/scene.gltf'
    },

    //12
    {
        name: 'projector',
        type: 'gltfModel',
        path: '/resources/spotlight.glb'
    },

    //13
    {
        name: 'ufo',
        type: 'gltfModel',
        path: '/resources/ufo/scene.gltf'
    },

    //14
    {
        name: 'rocket',
        type: 'gltfModel',
        path: '/resources/rocket.glb'
    },
]

export default sources