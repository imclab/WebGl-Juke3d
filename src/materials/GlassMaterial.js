/**
 * User: lepersp
 * Date: 16/07/12
 * Time: 16:26
 */


GlassMaterial = function ( ) {

    var ambient = 0xffffff;
    var diffuse = 0x040A04;
    var ra_in = 0.2;
    var ra_out = 0.8;
    var ra_pow = 1.0;


    var shader = JUKEJS.ShaderLib[ "carglass" ];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    uniforms[ "lightMap" ].value = false;
    uniforms[ "envMap" ].value = 1;

    this.transparent = true;
//    this.envMap = uniforms[ "envMap" ].texture = Textures.getTex( "env_studio_ref" );
    this.envMap = uniforms[ "envMap" ].texture = Textures.getTex( "hdr_ref" );
    uniforms[ "combine" ].value = 0;

    uniforms[ "diffuse" ].value.setHex( diffuse );

    uniforms[ "ra_in" ].value = ra_in
    uniforms[ "ra_out" ].value = ra_out;
    uniforms[ "ra_pow" ].value = ra_pow;

    uniforms[ "reflectivity" ].value= 0.6;
    uniforms[ "refractionRatio" ].value = 0.0;


    console.log( "Fragment  \n"+ shader.fragmentShader );
    console.log( "Vertex  \n"+ shader.vertexShader );

    var parameters = {
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms,
        transparent : true,
        lights: false,
        fog: false
    };

    JUKEJS.NO_UV_ShaderMaterial.call( this, parameters );

};

GlassMaterial.prototype = new JUKEJS.NO_UV_ShaderMaterial();
GlassMaterial.prototype.constructor = GlassMaterial;
