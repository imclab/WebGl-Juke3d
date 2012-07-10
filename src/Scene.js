
JUKEJS.Scene = function( container ) {

	this.container = container;

	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
	this.camera.position.z = 1500;
	this.scene.add( this.camera );
	
	// renderer

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColorHex( 0x000000, 1 );
	this.renderer.setSize( window.innerWidth, window.innerHeight );

	this.container.appendChild( this.renderer.domElement );

	this.play.scope = this;

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
		
		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.y += 0.02;

		this.renderer.render( this.scene, this.camera );
	},

	_build : function() {

		var geometry = new THREE.CubeGeometry( 200, 200, 200 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add( this.mesh );


		var loader = new JUKEJS.AWDLoader();
		loader.load( JUKEJS.Config.assetsPath + "3d/car/juke.AWD", this.onJukeLoaded );

	},

	onJukeLoaded : function() {
		console.log( "Scene.js onJukeLoaded" );
	}

}