/**
 * User: lepersp
 * Date: 13/07/12
 * Time: 19:54
 */


WheelGum = function () {

    var ambient = 0x020202, diffuse = 0x030303, specular = 0x606060, shininess = 10;


    var shader = THREE.ShaderUtils.lib[ "normal" ];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    uniforms[ "enableAO" ].value = false;
    uniforms[ "enableDiffuse" ].value = false;
    uniforms[ "enableSpecular" ].value = false;
    uniforms[ "enableReflection" ].value = false;

    uniforms[ "tNormal" ].texture = Textures.getTex( "wheel_normals" );

//    uniforms[ "tDisplacement" ].texture = THREE.ImageUtils.loadTexture( "textures/normal/ninja/displacement.jpg" );
//    uniforms[ "uDisplacementBias" ].value = - 0.428408 * scale;
//    uniforms[ "uDisplacementScale" ].value = 2.436143 * scale;

    uniforms[ "uDiffuseColor" ].value.setHex( diffuse );
    uniforms[ "uSpecularColor" ].value.setHex( specular );
    uniforms[ "uAmbientColor" ].value.setHex( ambient );

    uniforms[ "uShininess" ].value = shininess;

//    uniforms[ "tCube" ].texture = reflectionCube;
//    uniforms[ "uReflectivity" ].value = 0.1;

    uniforms[ "uDiffuseColor" ].value.convertGammaToLinear();
    uniforms[ "uSpecularColor" ].value.convertGammaToLinear();
    uniforms[ "uAmbientColor" ].value.convertGammaToLinear();

    console.log( "Fragment  \n"+ shader.fragmentShader );
    console.log( "Vertex  \n"+ shader.vertexShader );
    var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: false };

    THREE.ShaderMaterial.call( this, parameters );

};

WheelGum.prototype = new THREE.ShaderMaterial();
WheelGum.prototype.constructor = WheelGum;

