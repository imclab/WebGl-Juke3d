/**
 * User: lepersp
 * Date: 16/07/12
 * Time: 15:09
 */


EnvBox = function () {

};

EnvBox.prototype = {

    constructor:EnvBox,

    init:function ( scene ) {

        this.tree = new ObjectTree( scene );

        this.box = this.tree.get( "env_box" );
        this.uvholder = this.tree.get( "uvholder" );

        this.box.geometry.faceVertexUvs[1] = this.uvholder.geometry.faceVertexUvs[0];

        this.box.material = JUKEJS.materials.get( "ENV_BOX" );
    },

    getEnv : function() {
        return this.box;
    }

};
