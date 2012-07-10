/**
* @author: pierre lepers
*/

JUKEJS.AWDLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

	this._data;

	this._ptr = 0;

	this._major = 0;
	this._minor = 0;

	this._streaming = false;
	this._optimized_for_accuracy = false;

	this._compression = 0;

	this._bodylen = 0xFFFFFFFF;

	this._cur_block_id = 0x00000000;

};


JUKEJS.AWDLoader.prototype = new THREE.Loader();
JUKEJS.AWDLoader.prototype.constructor = JUKEJS.AWDLoader;

JUKEJS.AWDLoader.prototype.load = function ( url, callback ) {

	var that = this;
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				callback( that.parse( xhr.response ) );

			} else {

				console.error( 'JUKEJS.AWDLoader: Couldn\'t load ' + url + ' (' + xhr.status + ')' );

			}

		}

	};

	xhr.responseType = 'arraybuffer';
	xhr.open( "GET", url, true );
	xhr.send( null );

};

JUKEJS.AWDLoader.prototype.parse = function ( data ) {

	this._data = new DataView( data );
	var blen = data.byteLength;

	this._parseHeader( );
	if (!this._streaming && this._bodylen != data.byteLength - this._ptr ) {
		console.error('JUKEJS.AWDLoader: body len does not match file length', this._bodylen ,  blen - this._ptr);
	}

	while ( this._ptr < blen ) {
		parseNextBlock();
	}

	this.logHeadInfos();
}



JUKEJS.AWDLoader.prototype.parseNextBlock = function ( ) {

	var ns, type, len;
	_cur_block_id = _body.readUnsignedInt();
}

JUKEJS.AWDLoader.prototype.logHeadInfos = function ( data ) {

	console.log('HEADER:');
	console.log('version:', this._major+"."+this._minor);
	console.log('streaming?', this._streaming);
	console.log('accurate?', this._optimized_for_accuracy);
	console.log('compression:', this._compression);
	console.log('bodylen:', this._bodylen);



}


JUKEJS.AWDLoader.prototype._parseHeader = function () {
	

	var awdmagic = 		(this._data.getUint8( this._ptr++ )<<16) 
					| 	( this._data.getUint8( this._ptr++ )<<8 ) 
					| 	this._data.getUint8( this._ptr++ );

	if( awdmagic != 4282180 ) // utf "AWD"
		console.error( "JUKEJS.AWDLoader bas magic" );

	this._major = this._data.getUint8( this._ptr++ );
	this._minor = this._data.getUint8( this._ptr++ );

	var flags = this._data.getUint16( this._ptr );
	this._ptr+=2;

	this._streaming 					= (flags & 0x1) == 0x1;
	this._optimized_for_accuracy 	= (flags & 0x2) == 0x2;
	
	this._compression = this._data.getUint8( this._ptr++ );
	this._bodylen = this._data.getUint32( this._ptr );
	this._ptr += 4;
	
}