/**
 * User: lepersp
 * Date: 16/07/12
 * Time: 16:26
 */


GlassMaterial = function ( ) {

    var ambient = 0x000000;
    var diffuse = 0x000000;
    var ra_in = 0.7;
    var ra_out = 0.9;
    var ra_pow = 1.0;

    var exposure = new GlobalParam( 2.0, "globalExposure" );
    var gamma = new GlobalParam( 1.73, "globalGamma");

    var shader = JUKEJS.ShaderLib[ "carglass" ];
    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.uniforms[ "lightMap" ].value = false;
    this.uniforms[ "envMap" ].value = 1;

    this.transparent = true;
//    this.envMap = uniforms[ "envMap" ].texture = Textures.getTex( "env_studio_ref" );
    this.envMap = this.uniforms[ "envMap" ].texture = Textures.getTex( "hdr_png" );
    this.uniforms[ "combine" ].value = 0;

    this.uniforms[ "diffuse" ].value.setHex( diffuse );

    this.uniforms[ "ra_in" ].value = ra_in
    this.uniforms[ "ra_out" ].value = ra_out;
    this.uniforms[ "ra_pow" ].value = ra_pow;

    this.uniforms[ "reflectivity" ].value= 0.0;


    this.uniforms[ "exposure" ].value = exposure;
    this.uniforms[ "gamma" ].value = gamma;


//    console.log( "Fragment  \n"+ shader.fragmentShader );
//    console.log( "Vertex  \n"+ shader.vertexShader );

    var prefix_fragment = [
        "#define HDR_DECODE",
        "#define FRESNEL_ENVMAP",
        "#define HDR_TONE_MAP",
//        "#define USE_LIGHTMAP",
        ""
    ].join("\n");

    var parameters = {
        fragmentShader: prefix_fragment+shader.fragmentShader,
        vertexShader: prefix_fragment+shader.vertexShader,
        uniforms: this.uniforms,
        transparent : true,
        lights: false,
        fog: false
    };

    JUKEJS.NO_UV_ShaderMaterial.call( this, parameters );

    var scope = this;
    var onChange = function() {
        scope.uniforms[ this.id ].value = this.value;
        this.parentNode.getElementsByTagName("span")[0].innerHTML = ""+this.value;
    }

//    document.getElementById( "exposure").addEventListener( "change", onChange );
//    document.getElementById( "gamma").addEventListener( "change", onChange );
};

GlassMaterial.prototype = new JUKEJS.NO_UV_ShaderMaterial();
GlassMaterial.prototype.constructor = GlassMaterial;



/*----------------------------------------------------------------------------------
                                                                            CarGlassLtMaterial
 */

CarGlassLtMaterial = function ( ) {

	GlassMaterial.call( this );

    this.uniforms[ "diffuse" ].value.setHex( 0x000000 );

    this.uniforms[ "ra_in" ].value = 0.3;
    this.uniforms[ "ra_out" ].value = 0.9;
    this.uniforms[ "ra_pow" ].value = 1.0;

    this.blending = THREE.AdditiveBlending;

};

CarGlassLtMaterial.prototype = new GlassMaterial();
CarGlassLtMaterial.prototype.constructor = CarGlassLtMaterial;

CarGlassLtMaterial.prototype.method = function() {
	
};
