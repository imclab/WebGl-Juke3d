/**
 * @author pierre lepers
 */

DefaultMaterial = function ( ctorparams  ) {

	var p = { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }

	THREE.MeshPhongMaterial.call( this, p );

};

DefaultMaterial.prototype = new THREE.MeshPhongMaterial();
DefaultMaterial.prototype.constructor = DefaultMaterial;

DefaultMaterial.prototype.method_name = function() {
	
};
