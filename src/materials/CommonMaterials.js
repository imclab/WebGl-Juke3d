/**
 * @author pierre lepers
 */

//
BasicLakMaterial = function ( aoMap ) {
	var p = {
		color: 0xffffff,
		lightMap : aoMap,
		envMap : Textures.getTex( "env_studio_ref" ),
		//combine : THREE.MultiplyOperation,
		combine : THREE.MixOperation,
		reflectivity: 0.2,
		refractionRatio : 0.0
	};
	THREE.MeshBasicMaterial.call( this, p );
};

BasicLakMaterial.prototype = new THREE.MeshBasicMaterial();
BasicLakMaterial.prototype.constructor = BasicLakMaterial;


var lakBaseclass = LakMaterial;


/**
* ===========================================================================
 *                                                                    BodyMat
*/
BodyMaterial = function (  ) {
	lakBaseclass.call( this, Textures.getTex( "body_ao" ) );
};

BodyMaterial.prototype = new lakBaseclass();
BodyMaterial.prototype.constructor = BodyMaterial;

/**
 * ===========================================================================
 *                                                                    BootMat
*/
BootMaterial = function (  ) {
	lakBaseclass.call( this, Textures.getTex( "boot_ao" ) );
};

BootMaterial.prototype = new lakBaseclass();
BootMaterial.prototype.constructor = BootMaterial;

/**
 * ===========================================================================
 *                                                                    ArrMat
*/
ArrMaterial = function (  ) {
	lakBaseclass.call( this, Textures.getTex( "arrlak_ao" ) );
};

ArrMaterial.prototype = new lakBaseclass();
ArrMaterial.prototype.constructor = ArrMaterial;



/**
 * ===========================================================================
 *                                                                    RdoorMat
*/
RdoorMaterial = function (  ) {
    lakBaseclass.call( this, Textures.getTex( "rdoor_ao" ) );
};

RdoorMaterial.prototype = new lakBaseclass();
RdoorMaterial.prototype.constructor = RdoorMaterial;

/**
 * ===========================================================================
 *                                                                    FdoorMat
*/
FdoorMaterial = function (  ) {
    lakBaseclass.call( this, Textures.getTex( "fdoor_ao" ) );
};

FdoorMaterial.prototype = new lakBaseclass();
FdoorMaterial.prototype.constructor = FdoorMaterial;

/**
 * ===========================================================================
 *                                                                    GrillMat
*/

GrillMaterial = function (  ) {
    var p = {
        color: 0x181818,
        ambient : 0x040404,
        lightMap : Textures.getTex( "grill_ao" ),
        specular : 0x606060,
        shininess : 15

    };
    THREE.MeshPhongMaterial.call( this, p );
};

GrillMaterial.prototype = new THREE.MeshPhongMaterial();
GrillMaterial.prototype.constructor = GrillMaterial;


/**
 * ===========================================================================
 *                                                                    LowGumMat
 */
LowGumMaterial = function (  ) {
    var p = {
        color: 0x181818,
        ambient : 0x040404,
        lightMap : Textures.getTex( "lowgum_ao" ),
        specular : 0x606060,
        shininess : 15

    };
    THREE.MeshPhongMaterial.call( this, p );
};

LowGumMaterial.prototype = new THREE.MeshPhongMaterial();
LowGumMaterial.prototype.constructor = LowGumMaterial;
/**
 * ===========================================================================
 *                                                                    LowGumMat
 */
GumMaterial = function (  ) {
    var p = {
        color: 0x050505,
        ambient : 0x010101,
        specular : 0x505050,
        shininess : 180
    };
    THREE.MeshPhongMaterial.call( this, p );
};

GumMaterial.prototype = new THREE.MeshPhongMaterial();
GumMaterial.prototype.constructor = GumMaterial;

/**
 * ===========================================================================
 *                                                                    DefaultBlackMaterial
 */
DefaultBlackMaterial = function (  ) {
    var p = {
        color: 0x020202
    };
    THREE.MeshBasicMaterial.call( this, p );
};

DefaultBlackMaterial.prototype = new THREE.MeshBasicMaterial();
DefaultBlackMaterial.prototype.constructor = DefaultBlackMaterial;

/**
 * ===========================================================================
 *                                                                    Alloy1Material etc
 */
Alloy1Material = function (  ) {

    console.log( "Alloy1Material Alloy1Material diff "+ Textures.getTex( "env_studio_diff" ) );
    console.log( "Alloy1Material Alloy1Material ref "+ Textures.getTex( "env_studio_ref" ) );

    var p = {
        color: 0xffffff,
        lightMap : Textures.getTex( "alloy1_ao" ),
        envMap : Textures.getTex( "env_studio_diff" ),
        combine : THREE.MultiplyOperation,
        reflectivity: 1
    };
    THREE.MeshBasicMaterial.call( this, p );
};
Alloy1Material.prototype = new THREE.MeshBasicMaterial();
Alloy1Material.prototype.constructor = Alloy1Material;

Alloy2Material = function (  ) {
    var p = {
        color: 0x151515,
        lightMap : Textures.getTex( "alloy2_ao" ),
        envMap : Textures.getTex( "env_studio_diff" )
    };
    THREE.MeshBasicMaterial.call( this, p );
};

Alloy2Material.prototype = new THREE.MeshBasicMaterial();
Alloy2Material.prototype.constructor = Alloy2Material;
// alloy3
Alloy3Material = function (  ) {
    var p = {
        color: 0x151515,
        lightMap : Textures.getTex( "alloy3_ao" ),
        envMap : Textures.getTex( "env_studio_diff" )
    };
    THREE.MeshBasicMaterial.call( this, p );
};

Alloy3Material.prototype = new THREE.MeshBasicMaterial();
Alloy3Material.prototype.constructor = Alloy3Material;
// alloy4
Alloy4Material = function (  ) {
    var p = {
        color: 0xffffff,
        lightMap : Textures.getTex( "alloy4_ao" ),
        envMap : Textures.getTex( "env_studio_diff" ),
        combine : THREE.MixOperation
    };
    THREE.MeshBasicMaterial.call( this, p );
};

Alloy4Material.prototype = new THREE.MeshBasicMaterial();
Alloy4Material.prototype.constructor = Alloy4Material;


/*----------------------------------------------------------------------------------
                                                                            EnvBoxMaterial
 */

EnvBoxMaterial = function ( ) {

    var p = {
		map: Textures.getTex( "envbox_diff" ),
        lights : false
	};

	THREE.MeshBasicMaterial.call( this , p);

};

EnvBoxMaterial.prototype = new THREE.MeshBasicMaterial();
EnvBoxMaterial.prototype.constructor = EnvBoxMaterial;

EnvBoxMaterial.prototype.method = function() {
	
};

/*----------------------------------------------------------------------------------
                                                                            JukeTex
 */

JukeTex = function ( ) {

    var p = {
		map: Textures.getTex( "juke_tex" ),
        lights : false
	};

	THREE.MeshBasicMaterial.call( this , p );

};

JukeTex.prototype = new THREE.MeshBasicMaterial();
JukeTex.prototype.constructor = JukeTex;

JukeTex.prototype.method = function() {

};


/*----------------------------------------------------------------------------------
                                                                            GroundMat
 */

GroundMat = function ( ) {

    var shader = JUKEJS.ShaderLib[ "ground" ];
    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.uniforms[ "map" ].value = 1;
    this.map = this.uniforms[ "map" ].texture = Textures.getTex( "ground_leaves" ) ;


    var parameters = { fragmentShader: shader.fragmentShader, vertexShader:  shader.vertexShader, uniforms: this.uniforms, lights: false, fog: false, transparent : true };

	THREE.ShaderMaterial.call( this, parameters );

};

GroundMat.prototype = new THREE.ShaderMaterial();
GroundMat.prototype.constructor = GroundMat;

GroundMat.prototype.method = function() {

};