//2
JUKEJS.Scene = function( container ) {

	this.container = container;

	this.scene = new THREE.Scene();

	this.loader;

	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
	this.camera.position.z = 1500;
	this.scene.add( this.camera );
	
	// renderer

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColorHex( 0x000000, 1 );
	this.renderer.setSize( window.innerWidth, window.innerHeight );

	this.container.appendChild( this.renderer.domElement );

	this.play.scope = this;

	this.clock = new THREE.Clock();



	// CONTROL CAM

	var radius = 50,
	tilt = 0.41,
	rotationSpeed = 0.1;
	this.controls = new THREE.TrackballControls( this.camera, this.container );
	this.controls.rotateSpeed = 1.0;
	this.controls.zoomSpeed = 1.2;
	this.controls.panSpeed = 0.2;
	this.controls.noZoom = false;
	this.controls.noPan = false;
	this.controls.staticMoving = false;
	this.controls.dynamicDampingFactor = 0.3;
	this.controls.minDistance = radius * 1.1;
	this.controls.maxDistance = radius * 100;
	this.controls.keys = [ 65, 83, 68 ]; // [ rotateKey, zoomKey, panKey ]



	this._build();
}

JUKEJS.Scene.prototype = {

	constructor : JUKEJS.Scene,

	play : function() {
		var scope = arguments.callee.scope;
		requestAnimationFrame( scope.play );
		scope.render();
	},

	render : function() {
		
		//this.loader.trunk.rotation.y += 0.02;
		this.controls.update( );
		this.renderer.render( this.scene, this.camera );
	},

	_build : function() {

		/*var geometry = new THREE.SphereGeometry( 120, 16, 8 );
		var material = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  );
		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add( this.mesh );*/
		var scope = this;


		this.loader = new JUKEJS.AWDLoader();

		this.loader.materialFactory = function( id ) {
			return JUKEJS.materials.get( id );
			//return JUKEJS.materials.get( "DEFAULT_GREY" );
		}

		this.loader.load( JUKEJS.Config.assetsPath + "3d/car/juke.AWD", 
				function() {
					console.log( "Scene.js onJukeLoaded" );
					scope.scene.add( scope.loader.trunk );
				} 
				);

		this._buildLights();

	},

	_buildLights : function() {

		this.scene.add( new THREE.AmbientLight( 0xffffff ) );

		light1 = new THREE.PointLight( 0xffffff, 2, 1000 );
		light1.position.x = 200;
		light1.position.y = 200;
		light1.position.z = 200;
		this.scene.add( light1 );

		/*light2 = new THREE.PointLight( 0x0040ff, 2, 1000 );
		light2.position.x = -200;
		light2.position.y = 200;
		light2.position.z = 200;
		this.scene.add( light2 );

		light3 = new THREE.PointLight( 0x80ff80, 2, 1000 );
		light3.position.x = -200;
		light3.position.y = -200;
		light3.position.z = 200;
		this.scene.add( light3 );

		light4 = new THREE.PointLight( 0xffaa00, 2, 1000 );
		light4.position.x = 200;
		light4.position.y = 200;
		light4.position.z = -200;
		this.scene.add( light4 );*/

	}
 

}