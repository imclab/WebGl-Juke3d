//1

var JUKEJS = JUKEJS || {};

//config
JUKEJS.Config = {};

JUKEJS.Config.basePath = "./";
JUKEJS.Config.assetsPath = JUKEJS.Config.basePath + "assets/";


// Entry point
window["jukeentry"] = function( container ) {

	var scene = new JUKEJS.Scene( container );
	scene.play(); 

}
