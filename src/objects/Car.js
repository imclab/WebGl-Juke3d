/**
 * User: lepersp
 * Date: 13/07/12
 * Time: 14:32
 */


Car = function () {

};

Car.prototype = {

    constructor:Car,

    init : function ( scene ) {

        this.tree = new ObjectTree( scene, this.enterObject  );

        this.trunk = this.tree.get( "trunk" );

        this.lib = new CarLib( this.tree.get( "elements" ) );

        var flWheel = this.tree.get( "wag" );
        var frWheel = this.tree.get( "wad" );
        var rlWheel = this.tree.get( "wrg" );
        var rrWheel = this.tree.get( "wrd" );

        this._flWheel = new Wheel( this.lib );
        this._flWheel.position = flWheel.position.clone( );
        flWheel.parent.add( this._flWheel );
        flWheel.parent.remove( flWheel );

        this._frWheel = new Wheel( this.lib );
        this._frWheel.reverseway = true;
        this._frWheel.position = frWheel.position.clone( );
        frWheel.parent.add( this._frWheel );
        frWheel.parent.remove( frWheel );

        this._rlWheel = new Wheel(this.lib);
        this._rlWheel.reverseway = true;
        this._rlWheel.position = rlWheel.position.clone( );
        rlWheel.parent.add( this._rlWheel );
        rlWheel.parent.remove( rlWheel );

        this._rrWheel = new Wheel(this.lib);
        this._rrWheel.position = rrWheel.position.clone( );
        rrWheel.parent.add( this._rrWheel );
        rrWheel.parent.remove( rrWheel );

//        this._flWheel.matrix.prependRotation( 180, Vector3D.Y_AXIS );
//        this._rlWheel.matrix.prependRotation( 180, Vector3D.Y_AXIS );
        this._flWheel.rotation.y += Math.PI;
        this._rlWheel.rotation.y += Math.PI;

        this.handleWheel( this._flWheel );
        this.handleWheel( this._frWheel );
        this.handleWheel( this._rlWheel );
        this.handleWheel( this._rrWheel );


        this._steerFL = new THREE.Object3D( );
        this._steerFL.name = "steerFL";
        this._steerFL.position = this._flWheel.position.clone( );

        this._steerFR = new THREE.Object3D( );
        this._steerFR.name = "steerFR";
        this._steerFR.position = this._frWheel.position.clone( );

        this._flWheel.position = new THREE.Vector3( );
        this._frWheel.position = new THREE.Vector3( );

        this.trunk.remove( this._flWheel );
        this.trunk.remove( this._frWheel );

        this.trunk.add( this._steerFR );
        this.trunk.add( this._steerFL );
        this._steerFL.add( this._flWheel );
        this._steerFR.add( this._frWheel );

//        flWheel.rotationY = 180;
//        rlWheel.rotationY = 180;

//        this._steerFL.rotation.y = Math.PI;
//        this._steerFR.rotation.y = Math.PI;


    },

    handleWheel : function( wheel ) {
        wheel.setType( 3 );
    },

    enterObject : function( obj ) {
        if( obj instanceof THREE.Mesh ) {

            obj.doubleSided = true;

            if( obj.name.indexOf( "iac" ) == 0 ) {
                obj.visible = false;
            }
        }
    }

};

/*----------------------------------------------------------------------------------
                                                                            Wheel
 */

Wheel = function ( lib, high ) {
	THREE.Object3D.call( this );

    this.lib = lib;

    this.essieu = new THREE.Object3D( );

    this.pneumatic = lib.getPneumatic( high );

    this.essieu.add( this.pneumatic );
    this.pneumatic.rotation.y = Math.PI;

    this.name = "carwheel";
    this.type = -1;

    this.add( this.essieu );

};

Wheel.prototype = new THREE.Object3D();
Wheel.prototype.constructor = Wheel;

Wheel.prototype.setType = function( alloyIndex ) {
	if( this.type == alloyIndex ) return;
    this.type = alloyIndex;

    if ( this.alloy )
        this.essieu.remove( this.alloy );

    this.alloy = this.lib.getAlloy(alloyIndex, JUKEJS.materials.get( "CAR_ALLOY"+(alloyIndex+1) ) );
    this.essieu.add(this.alloy);
    this.alloy.rotation.y = Math.PI;
};

/*----------------------------------------------------------------------------------
                                                                            CarLib
 */

CarLib = function ( elems ) {
    this.elems = elems;
    this.tree = new ObjectTree( elems );

    this.pneumaticMesh = this.tree.get( "pneumatic" );
    this.pneumaticMeshHi = this.tree.get( "pneumatic2" );
    this.accessories = this.tree.get( "alloyac" );
    this.alloys = [
        this.tree.get( "allow1" ),
        this.tree.get( "allow2" ),
        this.tree.get( "allow3" ),
        this.tree.get( "allow4" )
    ];

};

CarLib.prototype = {

    constructor:CarLib,

    getAlloy:function (index, mat) {
        var alloy = THREE.SceneUtils.cloneObject( this.alloys[ index ]);

        var accg = this.alloys[ index ].children[0];
        var acc = THREE.SceneUtils.cloneObject(this.accessories);

        acc.position.copy(accg.position);
        acc.rotation.copy(accg.rotation);
        acc.eulerOrder = accg.eulerOrder;
        acc.scale.copy(accg.scale);

        alloy.add(acc);
        alloy.position = new THREE.Vector3();
        alloy.rotation = new THREE.Vector3();
        alloy.scale = new THREE.Vector3(1, 1, 1);

        if (mat) alloy.materials = [mat];

        return alloy;
    },

    getPneumatic:function (high) {
        return THREE.SceneUtils.cloneObject(high ? this.pneumaticMeshHi : this.pneumaticMesh);
    }


};



