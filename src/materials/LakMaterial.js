/**
 * User: lepersp
 * Date: 16/07/12
 * Time: 11:27
 */


LakMaterial = function ( oamap ) {

    var ambient = 0xffffff;
    var diffuse = 0xb3001b;
    var rim = 0x2f0508;
    var rimpower = 0.68;
    var rimStrength = 1.32;


    var shader = JUKEJS.ShaderLib[ "carlak" ];
//    var shader = THREE.ShaderLib[ "basic" ];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    uniforms[ "lightMap" ].value = 2;
    uniforms[ "envMap" ].value = 1;
//    uniforms[ "enableDiffuse" ].value = false;
//    uniforms[ "enableSpecular" ].value = false;
//    uniforms[ "enableReflection" ].value = false;

    uniforms[ "lightMap" ].texture = oamap;
    uniforms[ "envMap" ].texture = Textures.getTex( "env_studio_ref" );
//    uniforms[ "tNormal" ].texture = Textures.getTex( "wheel_normals" );
//    uniforms[ "tDisplacement" ].texture = THREE.ImageUtils.loadTexture( "textures/normal/ninja/displacement.jpg" );
//    uniforms[ "uDisplacementBias" ].value = - 0.428408 * scale;
//    uniforms[ "uDisplacementScale" ].value = 2.436143 * scale;

    uniforms[ "diffuse" ].value.setHex( diffuse );
//    uniforms[ "ambient" ].value.setHex( ambient );

    uniforms[ "rimColor" ].value.setHex( rim );
    uniforms[ "rimPower" ].value = rimpower;
    uniforms[ "rimStrength" ].value = rimStrength;

    uniforms[ "reflectivity" ].value= 0.2;
    uniforms[ "refractionRatio" ].value = 0.0;



//    uniforms[ "tCube" ].texture = reflectionCube;
//    uniforms[ "uReflectivity" ].value = 0.1;
    var prefix_fragment = [
        "#define USE_ENVMAP",
        "#define USE_LIGHTMAP", ""
    ].join("\n");

//    console.log( "Fragment  \n"+ shader.fragmentShader );
//    console.log( "Vertex  \n"+ shader.vertexShader );

    var parameters = { fragmentShader: prefix_fragment + shader.fragmentShader, vertexShader:  prefix_fragment + shader.vertexShader, uniforms: uniforms, lights: false, fog: false };

    THREE.ShaderMaterial.call( this, parameters );

};

LakMaterial.prototype = new THREE.ShaderMaterial();
LakMaterial.prototype.constructor = LakMaterial;

