/**
 * User: lepersp
 * Date: 13/07/12
 * Time: 14:35
 */


ObjectTree = function ( obj, enterCallback ) {
    this.flat = {};
    this._enterCallback = enterCallback;
    this._parse( obj );
};

ObjectTree.prototype = {

    constructor:ObjectTree,

    _parse : function ( obj ) {

        this._scanObj( obj );

    },

    _scanObj : function (obj) {
        var child;
        var children = obj.children;

        for (var i = 0; i < children.length; i++) {
            child = children[i];
            this.flat[ child.name ] = child;
            if( this._enterCallback )
                this._enterCallback( child );
            this._scanObj( child );
        }

    } ,

    get : function( name ) {
        return this.flat[ name ];
    }


};



