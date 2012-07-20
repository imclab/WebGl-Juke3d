/**
 * User: lepersp
 * Date: 16/07/12
 * Time: 11:27
 */


LakMaterial = function ( oamap ) {

    var ambient = 0xffffff;
//    var diffuse = 0xb3001b;
    var diffuse = 0xc2210b;
    var rim = 0x2f0508;
    var rimpower = 0.68;
    var rimStrength = 1.32;
    var exposure = 2.09 * JUKEJS.globalExposure;
    var gamma = 1.73 * JUKEJS.globalGamma;


    var shader = JUKEJS.ShaderLib[ "carlak" ];
//    var shader = THREE.ShaderLib[ "basic" ];
    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.uniforms[ "lightMap" ].value = 2;
    this.uniforms[ "envMap" ].value = 1;
    this.uniforms[ "radMap" ].value = 3;
//    uniforms[ "enableDiffuse" ].value = false;
//    uniforms[ "enableSpecular" ].value = false;
//    uniforms[ "enableReflection" ].value = false;

    this.uniforms[ "radMap" ].texture = Textures.getTex( "hdr_rad_png" );
    this.uniforms[ "lightMap" ].texture = oamap;
//    this.envMap = uniforms[ "envMap" ].texture = Textures.getTex( "env_studio_ref" );
//    this.envMap = this.uniforms[ "envMap" ].texture = Textures.getTex( "hdr_ref" );
    this.envMap = this.uniforms[ "envMap" ].texture = Textures.getTex( "hdr_png" );
    this.uniforms[ "combine" ].value = 0;
//    uniforms[ "tNormal" ].texture = Textures.getTex( "wheel_normals" );
//    uniforms[ "tDisplacement" ].texture = THREE.ImageUtils.loadTexture( "textures/normal/ninja/displacement.jpg" );
//    uniforms[ "uDisplacementBias" ].value = - 0.428408 * scale;
//    uniforms[ "uDisplacementScale" ].value = 2.436143 * scale;

    this.uniforms[ "diffuse" ].value.setHex( diffuse );
//    uniforms[ "ambient" ].value.setHex( ambient );

    this.uniforms[ "rimColor" ].value.setHex( rim );
    this.uniforms[ "rimPower" ].value = rimpower;
    this.uniforms[ "rimStrength" ].value = rimStrength;

    this.uniforms[ "reflectivity" ].value= 0.0;
    this.uniforms[ "refractionRatio" ].value = 0.0;


    this.uniforms[ "exposure" ].value = exposure;
    this.uniforms[ "gamma" ].value = gamma;



//    uniforms[ "tCube" ].texture = reflectionCube;
//    uniforms[ "uReflectivity" ].value = 0.1;
    var prefix_fragment = [
        "#define HDR_DECODE",
        "#define FRESNEL_ENVMAP",
        "#define HDR_TONE_MAP",
        "#define USE_LIGHTMAP",
        ""
    ].join("\n");

//    console.log( "Fragment  \n"+ shader.fragmentShader );
//    console.log( "Vertex  \n"+ shader.vertexShader );

    var parameters = { fragmentShader: prefix_fragment + shader.fragmentShader, vertexShader:  prefix_fragment + shader.vertexShader, uniforms: this.uniforms, lights: false, fog: false };

    THREE.ShaderMaterial.call( this, parameters );

//    debug
    var scope = this;
    var onChange = function() {
        scope.uniforms[ this.id ].value = this.value;
        this.parentNode.getElementsByTagName("span")[0].innerHTML = ""+this.value;
    }


//    document.getElementById( "reflectivity").addEventListener( "change", onChange );
    document.getElementById( "rimPower").addEventListener( "change", onChange );
    document.getElementById( "rimStrength").addEventListener( "change", onChange );
//    document.getElementById( "exposure").addEventListener( "change", onChange );
//    document.getElementById( "gamma").addEventListener( "change", onChange );

};

LakMaterial.prototype = new THREE.ShaderMaterial();
LakMaterial.prototype.constructor = LakMaterial;

