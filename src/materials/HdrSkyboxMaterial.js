/**
 * User: lepersp
 * Date: 20/07/12
 * Time: 16:48
 */

/*----------------------------------------------------------------------------------
                                                                            HdrSkyboxMaterial
 */

HdrSkyboxMaterial = function ( ) {

    this.shader = JUKEJS.ShaderLib[ "hdrcube" ];
    this.shader.uniforms[ "tCube" ].texture = Textures.getTex( "hdr_png" );
    this.shader.uniforms[ "exposure" ].value = new GlobalParam( 6.105, "globalExposure" );
    this.shader.uniforms[ "gamma" ].value = new GlobalParam( 1.75, "globalGamma" );

    THREE.ShaderMaterial.call( this, {

        fragmentShader: this.shader.fragmentShader,
        vertexShader: this.shader.vertexShader,
        uniforms: this.shader.uniforms,
        depthWrite: false

    } );

    var scope = this;
    var onChange = function() {
        scope.shader.uniforms[ this.id ].value = this.value;
        this.parentNode.getElementsByTagName("span")[0].innerHTML = ""+this.value;
    }


//    document.getElementById( "exposure").addEventListener( "change", onChange );
//    document.getElementById( "gamma").addEventListener( "change", onChange );


};

HdrSkyboxMaterial.prototype = new THREE.ShaderMaterial();
HdrSkyboxMaterial.prototype.constructor = HdrSkyboxMaterial;

HdrSkyboxMaterial.prototype.method = function() {
	
};