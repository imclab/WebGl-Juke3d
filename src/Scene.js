//2

JUKEJS.globalExposure = 0.18;
JUKEJS.globalGamma = 0.6;

JUKEJS.Scene = function( container ) {

	this.container = container;

	this.scene = new THREE.Scene();

	this.loader;

	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );

	this.camera.position.x = 135;
	this.camera.position.y = 92;
	this.camera.position.z = 175;

	this.scene.add( this.camera );



	this.sceneCube = new THREE.Scene();

	this.cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
	this.sceneCube.add( this.cameraCube );

	// renderer
    var p = {
        antialias : false
    }
	this.renderer = new THREE.WebGLRenderer( p );
	this.renderer.setClearColorHex( 0x000000, 1 );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
    // don't let renderer rescale hrd map
	this.renderer.autoScaleCubemaps = false;
    this.renderer.autoClear = false;

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
//		if( this.car.trunk )
//		    this.car.trunk.rotation.y += 0.02;


		this.controls.update( );

        this.cameraCube.rotation.copy( this.camera.rotation );

		this.renderer.render( this.sceneCube, this.cameraCube );
		this.renderer.render( this.scene, this.camera );
	},

	_build : function() {

		/*var geometry = new THREE.SphereGeometry( 120, 16, 8 );
		var material = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  );
		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add( this.mesh );*/
		var scope = this;

        var materialFactory = function( id ) {
			return JUKEJS.materials.get( id );
		}


        /*----------------------------------------------------------------------------------
                                                                                    Load car
         */
		var carLoader = new JUKEJS.AWDLoader();
		carLoader.materialFactory = materialFactory;

        var carLoaded = function() {
            console.log( "Scene.js onJukeLoaded" );
            scope.car = new Car( );
            scope.car.init( carLoader.trunk );
            scope.scene.add( scope.car.trunk );
        }

		carLoader.load( JUKEJS.Config.assetsPath + "3d/car/juke.AWD", carLoaded );

         /*----------------------------------------------------------------------------------
                                                                                    Load env
         */

        var envLoader = new JUKEJS.AWDLoader();
		envLoader.materialFactory = materialFactory;

        var envLoaded = function() {
            console.log( "Scene.js onJukeLoaded" );
            scope.env = new EnvBox( );
            scope.env.init( envLoader.trunk );
            //scope.scene.add( scope.env.getEnv() );
        }

		envLoader.load( JUKEJS.Config.assetsPath + "3d/env/envbox.AWD", envLoaded );

        /*----------------------------------------------------------------------------------
                                                                                    skybox
         */

        var shader = THREE.ShaderUtils.lib[ "cube" ];
        shader.uniforms[ "tCube" ].texture = Textures.getTex( "hdr_png" );

        var material = new HdrSkyboxMaterial();

        var mesh = new THREE.Mesh( new THREE.CubeGeometry( 5000, 5000, 5000 ), material );
        mesh.flipSided = true;
        this.sceneCube.add( mesh );

        /*----------------------------------------------------------------------------------
                                                                                    ground leaves
         */



        Textures.getTex( "ground_leaves" ).wrapT = THREE.RepeatWrapping;
        Textures.getTex( "ground_leaves" ).wrapS = THREE.RepeatWrapping;


        var gmat = new GroundMat()

        var ground = new THREE.Mesh( new THREE.PlaneGeometry(1000, 1000, 1, 1 ), gmat );
        ground.position.y = -5;
        for (var i = 0; i < ground.geometry.faceVertexUvs[0].length; i++) {
            ground.geometry.faceVertexUvs[0][i][0].u *= 6;
            ground.geometry.faceVertexUvs[0][i][0].v *= 6;
            ground.geometry.faceVertexUvs[0][i][1].u *= 6;
            ground.geometry.faceVertexUvs[0][i][1].v *= 6;
            ground.geometry.faceVertexUvs[0][i][2].u *= 6;
            ground.geometry.faceVertexUvs[0][i][2].v *= 6;
            ground.geometry.faceVertexUvs[0][i][3].u *= 6;
            ground.geometry.faceVertexUvs[0][i][3].v *= 6;
        }
        this.scene.add( ground );

		this._buildLights();

	},

	_buildLights : function() {

		this.scene.add( new THREE.AmbientLight( 0xffffff ) );

		light1 = new THREE.PointLight( 0xffffff, 2, 1000 );
		light1.position.x = 200;
		light1.position.y = 200;
		light1.position.z = 200;
		this.scene.add( light1 );

//		light2 = new THREE.PointLight( 0xffffff, 2, 1000 );
//		light2.position.x = -200;
//		light2.position.y = 200;
//		light2.position.z = 200;
//		this.scene.add( light2 );
//
//		light3 = new THREE.PointLight( 0xffffff, 2, 1000 );
//		light3.position.x = -200;
//		light3.position.y = -200;
//		light3.position.z = 200;
//		this.scene.add( light3 );
//
//		light4 = new THREE.PointLight( 0xffffff, 2, 1000 );
//		light4.position.x = 200;
//		light4.position.y = 200;
//		light4.position.z = -200;
//		this.scene.add( light4 );

	}
 

}


/*----------------------------------------------------------------------------------
                                                                            UTILS
 */


JUKEJS.utils = {};

JUKEJS.utils.findChild = function( obj, name ) {
    for (var i = 0; i < obj.children.length; i++) {
        if( obj.children[i].name == name ) return obj.children[i];
    }
}