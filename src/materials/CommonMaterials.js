/**
 * @author pierre lepers
 */


LakMaterial = function ( aoMap ) {
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

LakMaterial.prototype = new THREE.MeshBasicMaterial();
LakMaterial.prototype.constructor = LakMaterial;



/**
* ===========================================================================
 *                                                                    BodyMat
*/
BodyMaterial = function (  ) {
	LakMaterial.call( this, Textures.getTex( "body_ao" ) );
};

BodyMaterial.prototype = new LakMaterial();
BodyMaterial.prototype.constructor = BodyMaterial;

/**
 * ===========================================================================
 *                                                                    BootMat
*/
BootMaterial = function (  ) {
	LakMaterial.call( this, Textures.getTex( "boot_ao" ) );
};

BootMaterial.prototype = new LakMaterial();
BootMaterial.prototype.constructor = BootMaterial;

/**
 * ===========================================================================
 *                                                                    ArrMat
*/
ArrMaterial = function (  ) {
	LakMaterial.call( this, Textures.getTex( "arrlak_ao" ) );
};

ArrMaterial.prototype = new LakMaterial();
ArrMaterial.prototype.constructor = ArrMaterial;



/**
 * ===========================================================================
 *                                                                    RdoorMat
*/
RdoorMaterial = function (  ) {
    LakMaterial.call( this, Textures.getTex( "rdoor_ao" ) );
};

RdoorMaterial.prototype = new LakMaterial();
RdoorMaterial.prototype.constructor = RdoorMaterial;

/**
 * ===========================================================================
 *                                                                    FdoorMat
*/
FdoorMaterial = function (  ) {
    LakMaterial.call( this, Textures.getTex( "fdoor_ao" ) );
};

FdoorMaterial.prototype = new LakMaterial();
FdoorMaterial.prototype.constructor = FdoorMaterial;

/**
 * ===========================================================================
 *                                                                    GrillMat
*/

GrillMaterial = function (  ) {
    var p = {
        color: 0x151515,
        lightMap : Textures.getTex( "grill_ao" ),
        specular : 0xffffff,
        shininess : 200

    };
    THREE.MeshPhongMaterial.call( this, p );
};

GrillMaterial.prototype = new LakMaterial();
GrillMaterial.prototype.constructor = GrillMaterial;


/**
 * ===========================================================================
 *                                                                    CaisseMat
 */
CaisseMaterial = function (  ) {
    var p = {
        color: 0x151515,
        lightMap : Textures.getTex( "grill_ao" ),
        specular : 0xffffff,
        shininess : 200

    };
    THREE.MeshPhongMaterial.call( this, p );
};

CaisseMaterial.prototype = new LakMaterial();
CaisseMaterial.prototype.constructor = CaisseMaterial;


