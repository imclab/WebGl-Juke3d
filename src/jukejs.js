//1

var JUKEJS = JUKEJS || {};

//config
JUKEJS.Config = {};

JUKEJS.Config.basePath = "./";
JUKEJS.Config.assetsPath = JUKEJS.Config.basePath + "assets/";


// Entry point
window["jukeentry"] = function( container ) {

	JUKEJS._boot();


}

JUKEJS._boot = function() {
	Textures.load( JUKEJS._imagesLoaded );
}

JUKEJS._imagesLoaded = function() {
	
	var scene = new JUKEJS.Scene( container );
	scene.play();

}
