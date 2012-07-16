
MaterialProvider = function( ) {
	this._build();
}

MaterialProvider.prototype = {
	
	constructor : MaterialProvider,

	_build : function() {

		this._classeMap = {};
		this._matDict = {};

		this._classeMap["DEFAULT_GREY"] = 
		this._classeMap["juke_tex"] = 
		this._classeMap["CAR_CBS"] =
		this._classeMap["Juke_LOGO"] =
		this._classeMap["CAR_CHR"] =
		this._classeMap["CAR_GLASS_LT"] =
		this._classeMap["CAR_GLASS_RED"] =


		this._classeMap["Kar_CAR_PAINT_int"] =
		this._classeMap["DLP_CAR_PAINT_int"] =
		this._classeMap["DPP_CAR_PAINT_int"] =

		this._classeMap["GREEN_ARROW"] =
		this._classeMap["Material #11"] =
		this._classeMap["Material #23"] =
		this._classeMap["CAR_ALLOY1"] =
		this._classeMap["CAR_ALU"] =
//		this._classeMap["CAR_GLASS_BK"] =
//		this._classeMap["CAR_GLASS"] =
		this._classeMap["GPS_ARW "] = DefaultMaterial;

		this._classeMap["CAR_GLASS_BK"] =
		this._classeMap["CAR_GLASS"] = GlassMaterial;

		this._classeMap["ENV_BOX"] = EnvBoxMaterial;

		this._classeMap["CAR_WHEEL"] = WheelGum;

		this._classeMap["CAR_ALLOY1"] = Alloy1Material;
		this._classeMap["CAR_ALLOY2"] = Alloy2Material;
		this._classeMap["CAR_ALLOY3"] = Alloy3Material;
		this._classeMap["CAR_ALLOY4"] = Alloy4Material;

		this._classeMap["CAR_GUM"] = GumMaterial;
		this._classeMap["BLACK"] = DefaultBlackMaterial;
		this._classeMap["CAR_LOW_GUM"] = LowGumMaterial;

		this._classeMap["Grill_CAR_PAINT"] = GrillMaterial;
		this._classeMap["DLP_CAR_PAINT"] = FdoorMaterial;
		this._classeMap["DLZ_CAR_PAINT"] = RdoorMaterial;
		this._classeMap["Hai_CAR_PAINT"] = BootMaterial;
		this._classeMap["Bum_CAR_PAINT"] = ArrMaterial;
		this._classeMap["Kar_CAR_PAINT"] = BodyMaterial;

	}

};

MaterialProvider.prototype.get = function( id ) {
	return this._matDict[id] || (this._matDict[id] = this.createMaterial( id ));
};

MaterialProvider.prototype.createMaterial = function( id ) {
	if( this._classeMap[id] === undefined ) return undefined;
	var mat = new this._classeMap[id]( );
	mat.name = id;
	return mat;
};

JUKEJS.materials = new MaterialProvider();