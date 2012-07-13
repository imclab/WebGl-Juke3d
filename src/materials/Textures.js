/**
 * @author pierre lepers
 */
Textures = {};

Textures.baseurl = "./assets/3d/tex/"

Textures.batchCount = 0;

Textures.lib = [
	{ id:"body_ao", 		url : Textures.baseurl+	"BodyAmbientOcclusion_MR_.jpg" 		, type:0},
	{ id:"arrlak_ao", 		url : Textures.baseurl+	"arr_lakAmbientOcclusion_MR_.jpg" 	, type:0},
	{ id:"boot_ao", 		url : Textures.baseurl+	"BootAmbientOcclusion_MR_.jpg" 		, type:0},
	{ id:"env_studio_ref", 	url : Textures.baseurl+	"env_studio_ref/studio_cubic.jpg" 	, type:1}
]

Textures.getTex = function( id ) {
	return Textures.texs[ id ];
}

Textures.texs = {};



Textures.load = function( completeCallback ) {

	var libdata;
	var iloader;
	var id;

	Textures.completeCallback = completeCallback;

	for (var i = Textures.lib.length - 1; i >= 0; i--) {
		libdata = Textures.lib[i];
		id = libdata.id;

		if( libdata.type == 0 )
			iloader = new __ImageLoader();
		else if( libdata.type == 1 )
			iloader = new __CubeLoader();

		Textures.batchCount ++;

		var toto = libdata;
		iloader.load( libdata, Textures.onImageLoaded );

	};

}

Textures.onImageLoaded = function( tex, libdata ) {
	Textures.batchCount--;
	Textures.texs[libdata.id] = tex;
	Textures.texs[libdata.id].needsUpdate = true;

	if( Textures.batchCount == 0 ) 
		Textures.completeCallback();
}



//========================= IMAGE LOADER


/**
 * @author pierre lepers
 */

__ImageLoader = function () {};

__ImageLoader.prototype = {

	constructor : __ImageLoader,

	load : function ( data, callback ) {

		var image = new Image();

		image.onload = function () {
			callback( new THREE.Texture( image ), data );
		};
		image.crossOrigin = this.crossOrigin;
		image.src = data.url;

	}

}


/**
 * @author pierre lepers
 */

__CubeLoader = function () {};

__CubeLoader.prototype = {

	constructor : __CubeLoader,


	load : function ( data, callback ) {

		var image0 = new Image();
		var image1 = new Image();
		var image2 = new Image();
		var image3 = new Image();
		var image4 = new Image();
		var image5 = new Image();

		var toload = 5;

		image0.onload = 
		image1.onload = 
		image2.onload = 
		image3.onload = 
		image4.onload = 
		image5.onload = 
		function () {
			toload--;
			if( toload == 0 ) {
				complete();
			}
		};

		complete = function() {
			callback( new THREE.Texture( [ image0, image1,  image2,  image3,  image4,  image5] ), data );
		}
		
		var ppos = data.url.lastIndexOf( '.' );
		var bu = data.url.substring( 0, ppos );
		var ext = data.url.substring( ppos, data.url.length );

		image0.crossOrigin = this.crossOrigin;
		image0.src = bu+"0"+ext;
		image1.crossOrigin = this.crossOrigin;
		image1.src = bu+"1"+ext;
		image2.crossOrigin = this.crossOrigin;
		image2.src = bu+"3"+ext;
		image3.crossOrigin = this.crossOrigin;
		image3.src = bu+"2"+ext;
		image4.crossOrigin = this.crossOrigin;
		image4.src = bu+"4"+ext;
		image5.crossOrigin = this.crossOrigin;
		image5.src = bu+"5"+ext;

	}
}

