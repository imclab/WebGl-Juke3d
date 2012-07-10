var JUKEJS = JUKEJS || {};

//config
JUKEJS.Config = {};

JUKEJS.Config.basePath = "./";
JUKEJS.Config.assetsPath = JUKEJS.Config.basePath + "assets/";


JUKEJS.run = function( container ) {

	var scene = new JUKEJS.Scene( container );
	scene.play(); 

}
