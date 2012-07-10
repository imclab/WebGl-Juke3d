//3
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

	this._blocks = new Array();//AWDBlock
	this._blocks[0] = new JUKEJS.AWDBlock();
	this._blocks[0].data = null;

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
		this.parseNextBlock();
	}

	this.logHeadInfos();
}



JUKEJS.AWDLoader.prototype.parseNextBlock = function ( ) {

	var assetData;
	var ns, type, len;
	_cur_block_id = this.readU32();

	ns = this.readU8();
	type = this.readU8();
	len = this.readU32();

	switch (type) {
		case 1:
			assetData = this.parseMeshData(len);
			break;
		// case 22:
		// 	assetData = parseContainer(len);
		// 	break;
		// case 24:
		// 	assetData = parseMeshInstance(len);
		// 	break;
		// case 81:
		// 	assetData = parseMaterial(len);
		// 	break;
		// case 82:
		// 	assetData = parseTexture(len);
		// 	break;
		// case 101:
		// 	assetData = parseSkeleton(len);
		// 	break;
		// case 102:
		// 	assetData = parseSkeletonPose(len);
		// 	break;
		// case 103:
		// 	assetData = parseSkeletonAnimation(len);
		// 	break;
		// case 121:
		// 	assetData = parseUVAnimation(len);
		// 	break;
		default:
			//trace('Ignoring block!');
			_ptr += len;
			break;
	}

	// Store block reference for later use
	_blocks[_cur_block_id] = new AWDBlock();
	_blocks[_cur_block_id].data = assetData;
	_blocks[_cur_block_id].id = _cur_block_id;

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
					| 	(this._data.getUint8( this._ptr++ )<<8 ) 
					| 	this._data.getUint8( this._ptr++ );

	if( awdmagic != 4282180 ) // utf "AWD"
		console.error( "JUKEJS.AWDLoader bas magic" );

	this._major = this.readU8();
	this._minor = this.readU8();

	var flags = this.readU16();

	this._streaming 				= (flags & 0x1) == 0x1;
	this._optimized_for_accuracy 	= (flags & 0x2) == 0x2;
	
	this._compression = this.readU8();
	this._bodylen = this.readU32();
	
}


JUKEJS.AWDLoader.prototype.parseMeshData = function ( len ) {

	var name;
	var geom;
	var num_subs;
	var subs_parsed;
	var props;
	var bsm;

	// Read name and sub count
	name = this.readUTF();
	num_subs = this.readU16();

	// Read optional properties
	props = parseProperties({ 1:AWD_FIELD_MTX4x4 }); 

	var mtx : Matrix3D;
	var bsm_data : Array = props.get(1, null);
	if (bsm_data) {
		bsm = new THREE.Matrix4(bsm_data);
	}

	geom = new THREE.Geometry();

	// Loop through sub meshes
	subs_parsed = 0;
	while (subs_parsed < num_subs) {
		var mat_id, sm_len, sm_end;
		var sub_geom : SubGeometry;
		var skinned_sub_geom : SkinnedSubGeometry;
		var w_indices : Vector.<Number>;
		var weights : Vector.<Number>;

		sub_geom = new SubGeometry();

		sm_len = _body.readUnsignedInt();
		sm_end = _body.position + sm_len;

		// Ignore for now
		parseProperties(null);

		// Loop through data streams
		while (_body.position < sm_end) {
			var idx : uint = 0;
			var str_type : uint, str_len : uint, str_end : uint;

			str_type = _body.readUnsignedByte();
			str_len = _body.readUnsignedInt();
			str_end = _body.position + str_len;

			var x:Number, y:Number, z:Number;

			if (str_type == 1) {
				var verts : Vector.<Number> = new Vector.<Number>;
				while (_body.position < str_end) {
					x = read_float();
					y = read_float();
					z = read_float();

					verts[idx++] = x;
					verts[idx++] = y;
					verts[idx++] = z;
				}
				sub_geom.updateVertexData(verts);
			}
			else if (str_type == 2) {
				var indices : Vector.<uint> = new Vector.<uint>;
				while (_body.position < str_end) {
					indices[idx++] = read_uint();
				}
				sub_geom.updateIndexData(indices);
			}
			else if (str_type == 3) {
				var uvs : Vector.<Number> = new Vector.<Number>;
				while (_body.position < str_end) {
					uvs[idx++] = read_float();
				}
				sub_geom.updateUVData(uvs);
			}
			else if (str_type == 4) {
				var normals : Vector.<Number> = new Vector.<Number>;
				while (_body.position < str_end) {
					normals[idx++] = read_float();
				}
				sub_geom.updateVertexNormalData(normals);
			}
			else if (str_type == 6) {
				w_indices = new Vector.<Number>;
				while (_body.position < str_end) {
					w_indices[idx++] = read_uint()*3;
				}
			}
			else if (str_type == 7) {
				weights = new Vector.<Number>;
				while (_body.position < str_end) {
					weights[idx++] = read_float();
				}
			}
			else {
				_body.position = str_end;
			}
		}

		// Ignore sub-mesh attributes for now
		parseUserAttributes();

		// If there were weights and joint indices defined, this
		// is a skinned mesh and needs to be built from skinned
		// sub-geometries, so copy data across.
		if (w_indices && weights) {
			skinned_sub_geom = new SkinnedSubGeometry(weights.length / sub_geom.numVertices);
			skinned_sub_geom.updateVertexData(sub_geom.vertexData);
			skinned_sub_geom.updateIndexData(sub_geom.indexData);
			skinned_sub_geom.updateUVData(sub_geom.UVData);
			skinned_sub_geom.updateVertexNormalData(sub_geom.vertexNormalData);
			skinned_sub_geom.updateJointIndexData(w_indices);
			skinned_sub_geom.updateJointWeightsData(weights);
			sub_geom = skinned_sub_geom;
		}

		subs_parsed++;
		geom.addSubGeometry(sub_geom);
	}

	parseUserAttributes();

	finalizeAsset(geom, name);

	return geom;
}

JUKEJS.AWDLoader.prototype.parseProperties = function ( expected ) {
	var list_len = this.readU32();
	var list_end = _ptr + list_len;

	var props = new AWDProperties();

	if( expected ) {

		while( _atf < list_end ) {

			var key = this.readU16();
			var len = this.readU16();
			var type;

			if( expected.hasOwnProperty( key ) ) {
				type = expected[ key ];
				props.set( key, this.parseAttrValue( type, len ) );
			} else {
				_ptr += len;
			}
		}

	}
};

JUKEJS.AWDLoader.prototype.parseAttrValue = function ( type, len ) {

	var elem_len;
	var read_func;

	switch (type) {
		case AWD_FIELD_INT8:
			elem_len = 1;
			read_func = this.readI8;
			break;
		case AWD_FIELD_INT16:
			elem_len = 2;
			read_func = this.readI16;
			break;
		case AWD_FIELD_INT32:
			elem_len = 4;
			read_func = this.readI32;
			break;
		case AWD_FIELD_BOOL:
		case AWD_FIELD_UINT8:
			elem_len = 1;
			read_func = this.readU8;
			break;
		case AWD_FIELD_UINT16:
			elem_len = 2;
			read_func = this.readU16;
			break;
		case AWD_FIELD_UINT32:
		case AWD_FIELD_BADDR:
			elem_len = 4;
			read_func = this.readU32;
			break;
		case AWD_FIELD_FLOAT32:
			elem_len = 4;
			read_func = this.readF32;
			break;
		case AWD_FIELD_FLOAT64:
			elem_len = 8;
			read_func = this.readF64;
			break;
		case AWD_FIELD_VECTOR2x1:
		case AWD_FIELD_VECTOR3x1:
		case AWD_FIELD_VECTOR4x1:
		case AWD_FIELD_MTX3x2:
		case AWD_FIELD_MTX3x3:
		case AWD_FIELD_MTX4x3:
		case AWD_FIELD_MTX4x4:
			elem_len = 8;
			read_func = this.readF64;
			break;
	}

	if (elem_len < len) {
		var list;
		var num_read;
		var num_elems;

		list = [];
		num_read = 0;
		num_elems = len / elem_len;

		while (num_read < num_elems) {
			list.push(read_func());
			num_read++;
		}

		return list;
	}
	else {
		var val : *;

		val = read_func();
		return val;
	}

}


JUKEJS.AWDLoader.prototype.readU8 = function () {
	return this._data.getUint8( this._ptr++ );
}
JUKEJS.AWDLoader.prototype.readI8 = function () {
	return this._data.getInt8( this._ptr++ );
}

JUKEJS.AWDLoader.prototype.readU16 = function () {
	var a = this._data.getUint16( this._ptr );
	this._ptr += 2;
	return a;
}
JUKEJS.AWDLoader.prototype.readI16 = function () {
	var a = this._data.getInt16( this._ptr );
	this._ptr += 2;
	return a;
}

JUKEJS.AWDLoader.prototype.readU32 = function () {
	var a = this._data.getUint32( this._ptr );
	this._ptr += 4;
	return a;
}
JUKEJS.AWDLoader.prototype.readI32 = function () {
	var a = this._data.getInt32( this._ptr );
	this._ptr += 4;
	return a;
}
JUKEJS.AWDLoader.prototype.readF32 = function () {
	var a = this._data.getFloat32( this._ptr );
	this._ptr += 4;
	return a;
}
JUKEJS.AWDLoader.prototype.readF64 = function () {
	var a = this._data.getFloat64( this._ptr );
	this._ptr += 8;
	return a;
}


/**
 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
 * @param {Array.<number>} bytes UTF-8 byte array.
 * @return {string} 16-bit Unicode string.
 */
JUKEJS.AWDLoader.prototype.readUTF = function () {
	var end = this.readU16() + _ptr;
	
	// TODO(user): Use native implementations if/when available
	
	var out = [], c = 0;
	
	while ( out.length < end ) {
		var c1 = this._data.getUint8( _ptr++ );
		if (c1 < 128) {
			out[c++] = String.fromCharCode(c1);
		} else if (c1 > 191 && c1 < 224) {
			var c2 = this._data.getUint8( _ptr++ );
			out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
		} else {
			var c2 = this._data.getUint8( _ptr++ );
			var c3 = this._data.getUint8( _ptr++ );
			out[c++] = String.fromCharCode(
				(c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63
			);
		}
	}
	return out.join('');
};


UNCOMPRESSED = 0;
DEFLATE = 1;
LZMA = 2;



AWD_FIELD_INT8 = 1;
AWD_FIELD_INT16 = 2;
AWD_FIELD_INT32 = 3;
AWD_FIELD_UINT8 = 4;
AWD_FIELD_UINT16 = 5;
AWD_FIELD_UINT32 = 6;
AWD_FIELD_FLOAT32 = 7;
AWD_FIELD_FLOAT64 = 8;

AWD_FIELD_BOOL = 21;
AWD_FIELD_COLOR = 22;
AWD_FIELD_BADDR = 23;

AWD_FIELD_STRING = 31;
AWD_FIELD_BYTEARRAY = 32;

AWD_FIELD_VECTOR2x1 = 41;
AWD_FIELD_VECTOR3x1 = 42;
AWD_FIELD_VECTOR4x1 = 43;
AWD_FIELD_MTX3x2 = 44;
AWD_FIELD_MTX3x3 = 45;
AWD_FIELD_MTX4x3 = 46;
AWD_FIELD_MTX4x4 = 47;


AWDBlock = function()
{
	public var id;
	public var data;
}
AWDBlock.prototype.constructor = AWDBlock;


AWDProperties = function(){}

AWDProperties.prototype = {

	constructor : JUKEJS.Scene,

	set : function(key, value)
	{
		this[key] = value;
	},

	get : function(key, fallback)
	{
		if ( this.hasOwnProperty(key) )
			return this[key];
		else return fallback;
	}
}