/**
 * User: lepersp
 * Date: 19/07/12
 * Time: 15:16
 */
/**
 * User: lepersp
 * Date: 16/07/12
 * Time: 11:27
 */


ChrMaterial = function ( ) {

    var ambient = 0x0;
//    var diffuse = 0xb3001b;
    var diffuse = 0x040404;
    var exposure = new GlobalParam( 2.27, "globalExposure" );
    var gamma = new GlobalParam( 0.96, "globalGamma" );


    var shader = JUKEJS.ShaderLib[ "chrome" ];
//    var shader = THREE.ShaderLib[ "basic" ];
    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.uniforms[ "lightMap" ].value = false;
    this.uniforms[ "envMap" ].value = 1;
    this.uniforms[ "tNormal" ].value = 2;

    this.envMap = this.uniforms[ "envMap" ].texture = Textures.getTex( "hdr_png" );
    this.uniforms[ "tNormal" ].texture = Textures.getTex( "cbs_normals" );

    this.uniforms[ "combine" ].value = 0;

    this.uniforms[ "diffuse" ].value.setHex( diffuse );
//    this.uniforms[ "ambient" ].value.setHex( ambient );


    this.uniforms[ "reflectivity" ].value= 1.0;
    this.uniforms[ "refractionRatio" ].value = 0.0;


    this.uniforms[ "exposure" ].value = exposure;
    this.uniforms[ "gamma" ].value = gamma;



//    uniforms[ "tCube" ].texture = reflectionCube;
//    uniforms[ "uReflectivity" ].value = 0.1;
    var prefix_fragment = [
        "#define HDR_DECODE",
        "#define NORMAL_MAP",
//        "#define FRESNEL_ENVMAP",
        "#define HDR_TONE_MAP",
//        "#define USE_LIGHTMAP",
        ""
    ].join("\n");

//    console.log( "Fragment  \n"+ shader.fragmentShader );
//    console.log( "Vertex  \n"+ shader.vertexShader );

    var parameters = { fragmentShader: prefix_fragment + shader.fragmentShader, vertexShader:  prefix_fragment + shader.vertexShader, uniforms: this.uniforms, lights: false, fog: false };

    THREE.ShaderMaterial.call( this, parameters );

     var scope = this;
    var onChange = function() {
        scope.uniforms[ this.id ].value = this.value;
        this.parentNode.getElementsByTagName("span")[0].innerHTML = ""+this.value;
    }
//    document.getElementById( "exposure").addEventListener( "change", onChange );
//    document.getElementById( "gamma").addEventListener( "change", onChange );
};

ChrMaterial.prototype = new THREE.ShaderMaterial();
ChrMaterial.prototype.constructor = ChrMaterial;



ChromeMaterial = function ( ) {

    var ambient = 0x0;
//    var diffuse = 0xb3001b;
    var diffuse = 0x000000;
    var exposure = 4.11 * JUKEJS.globalExposure;;
    var gamma = 1.5 * JUKEJS.globalGamma;


    var shader = JUKEJS.ShaderLib[ "chrome" ];
    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.uniforms[ "lightMap" ].value = false;
    this.uniforms[ "envMap" ].value = 1;

    this.envMap = this.uniforms[ "envMap" ].texture = Textures.getTex( "hdr_png" );

    this.uniforms[ "combine" ].value = 0;

    this.uniforms[ "diffuse" ].value.setHex( diffuse );

    this.uniforms[ "reflectivity" ].value= 0.8;
    this.uniforms[ "refractionRatio" ].value = 0.0;


    this.uniforms[ "exposure" ].value = exposure;
    this.uniforms[ "gamma" ].value = gamma;



    var prefix_fragment = [
        "#define HDR_DECODE",
//        "#define NORMAL_MAP",
//        "#define FRESNEL_ENVMAP",
        "#define HDR_TONE_MAP",
//        "#define USE_LIGHTMAP",
        ""
    ].join("\n");

//    console.log( "Fragment  \n"+ shader.fragmentShader );
//    console.log( "Vertex  \n"+ shader.vertexShader );

    var parameters = { fragmentShader: prefix_fragment + shader.fragmentShader, vertexShader:  prefix_fragment + shader.vertexShader, uniforms: this.uniforms, lights: false, fog: false };

    THREE.ShaderMaterial.call( this, parameters );


     var scope = this;
    var onChange = function() {
        scope.uniforms[ this.id ].value = this.value;
        this.parentNode.getElementsByTagName("span")[0].innerHTML = ""+this.value;
    }
//    document.getElementById( "exposure").addEventListener( "change", onChange );
//    document.getElementById( "gamma").addEventListener( "change", onChange );

};

ChromeMaterial.prototype = new THREE.ShaderMaterial();
ChromeMaterial.prototype.constructor = ChromeMaterial;

/*----------------------------------------------------------------------------------
                                                                            alloy test
 */

AlloyTestMaterial = function ( ) {

    var ambient = 0x0;
//    var diffuse = 0xb3001b;
    var diffuse = 0x000000;
    var exposure = 4.11 * JUKEJS.globalExposure;;
    var gamma = 1.5 * JUKEJS.globalGamma;


    var shader = JUKEJS.ShaderLib[ "chrome" ];
    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.uniforms[ "envMap" ].value = 1;
    this.uniforms[ "lightMap" ].value = 2;


    this.envMap = this.uniforms[ "envMap" ].texture = Textures.getTex( "hdr_png" );
    this.uniforms[ "lightMap" ].texture = Textures.getTex( "alloy1_ao" );

    this.uniforms[ "combine" ].value = 0;

    this.uniforms[ "diffuse" ].value.setHex( diffuse );

    this.uniforms[ "reflectivity" ].value= 0.8;
    this.uniforms[ "refractionRatio" ].value = 0.0;


    this.uniforms[ "exposure" ].value = exposure;
    this.uniforms[ "gamma" ].value = gamma;



    var prefix_fragment = [
        "#define HDR_DECODE",
//        "#define NORMAL_MAP",
//        "#define FRESNEL_ENVMAP",
        "#define HDR_TONE_MAP",
        "#define USE_LIGHTMAP",
        ""
    ].join("\n");

//    console.log( "Fragment  \n"+ shader.fragmentShader );
//    console.log( "Vertex  \n"+ shader.vertexShader );

    var parameters = { fragmentShader: prefix_fragment + shader.fragmentShader, vertexShader:  prefix_fragment + shader.vertexShader, uniforms: this.uniforms, lights: false, fog: false };

    THREE.ShaderMaterial.call( this, parameters );


     var scope = this;
    var onChange = function() {
        scope.uniforms[ this.id ].value = this.value;
        this.parentNode.getElementsByTagName("span")[0].innerHTML = ""+this.value;
    }
    document.getElementById( "exposure").addEventListener( "change", onChange );
    document.getElementById( "gamma").addEventListener( "change", onChange );

};

AlloyTestMaterial.prototype = new THREE.ShaderMaterial();
AlloyTestMaterial.prototype.constructor = AlloyTestMaterial;
