/**
 * User: lepersp
 * Date: 20/07/12
 * Time: 17:16
 */


/*----------------------------------------------------------------------------------
                                                                            GlobalParam
 */

GlobalParam = function ( value, mname ) {
    this.exposure = value;
    this.mname = mname;
};

GlobalParam.prototype = {
	constructor: GlobalParam,
	set : function ( exposure ) {
        this.exposure = exposure;
	},
    valueOf : function() {
        return this.exposure * JUKEJS[this.mname];
    }
};
