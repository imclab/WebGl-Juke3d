/**
 * User: lepersp
 * Date: 16/07/12
 * Time: 16:26
 */


GlassMaterial = function ( oamap ) {

    var ambient = 0xffffff;
    var diffuse = 0xffffff;
    var ra_in = 0.2;
    var ra_out = 0.8;
    var ra_pow = 1.32;


    var shader = JUKEJS.ShaderLib[ "carglass" ];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    uniforms[ "lightMap" ].value = false;
    uniforms[ "envMap" ].value = 1;
//    uniforms[ "enableDiffuse" ].value = false;
//    uniforms[ "enableSpecular" ].value = false;
//    uniforms[ "enableReflection" ].value = false;

    uniforms[ "envMap" ].texture = Textures.getTex( "env_studio_ref" );
//    uniforms[ "tNormal" ].texture = Textures.getTex( "wheel_normals" );
//    uniforms[ "tDisplacement" ].texture = THREE.ImageUtils.loadTexture( "textures/normal/ninja/displacement.jpg" );
//    uniforms[ "uDisplacementBias" ].value = - 0.428408 * scale;
//    uniforms[ "uDisplacementScale" ].value = 2.436143 * scale;

    uniforms[ "diffuse" ].value.setHex( diffuse );
//    uniforms[ "ambient" ].value.setHex( ambient );

    uniforms[ "ra_in" ].value = ra_in
    uniforms[ "ra_out" ].value = ra_out;
    uniforms[ "ra_pow" ].value = ra_pow;

    uniforms[ "reflectivity" ].value= 0.2;
    uniforms[ "refractionRatio" ].value = 0.0;



//    uniforms[ "tCube" ].texture = reflectionCube;
//    uniforms[ "uReflectivity" ].value = 0.1;
    var prefix_fragment = [
        "#define USE_ENVMAP", ""
    ].join("\n");

//    console.log( "Fragment  \n"+ shader.fragmentShader );
//    console.log( "Vertex  \n"+ shader.vertexShader );

    var parameters = { fragmentShader: prefix_fragment + shader.fragmentShader, vertexShader:  prefix_fragment + shader.vertexShader, uniforms: uniforms, lights: false, fog: false };

    JUKEJS.NO_UV_ShaderMaterial.call( this, parameters );

};

GlassMaterial.prototype = new JUKEJS.NO_UV_ShaderMaterial();
GlassMaterial.prototype.constructor = GlassMaterial;
