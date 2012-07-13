/**
 * @author pierre lepers
 */


LakMaterial = function ( aoMap ) {
	var p = { 
		color: 0xffffff, 
		map : aoMap, 
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
* BodyMat
*/
BodyMaterial = function (  ) {
	LakMaterial.call( this, Textures.getTex( "body_ao" ) );
};

BodyMaterial.prototype = new LakMaterial();
BodyMaterial.prototype.constructor = BodyMaterial;

/**
* BootMat
*/
BootMaterial = function (  ) {
	LakMaterial.call( this, Textures.getTex( "boot_ao" ) );
};

BootMaterial.prototype = new LakMaterial();
BootMaterial.prototype.constructor = BootMaterial;

/**
* BootMat
*/
ArrMaterial = function (  ) {
	LakMaterial.call( this, Textures.getTex( "arrlak_ao" ) );
};

ArrMaterial.prototype = new LakMaterial();
ArrMaterial.prototype.constructor = ArrMaterial;


