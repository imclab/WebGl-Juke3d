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

    // gui controls

    function onExposureChange() {
        JUKEJS.globalExposure = this.value;
    }
    function onGammaChange() {
        JUKEJS.globalGamma = this.value;
    }

    document.getElementById( "exposure").addEventListener( "change", onExposureChange );
    document.getElementById( "gamma").addEventListener( "change", onGammaChange );
    document.getElementById( "exposure").value = JUKEJS.globalExposure;
    document.getElementById( "gamma").value = JUKEJS.globalGamma;

}
