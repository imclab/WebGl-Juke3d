//3
/**
* @author: pierre lepers
*/

JUKEJS.AWDLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

	this.trunk = new THREE.Object3D();

	this.materialFactory = undefined;

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
	this._blocks[0] = new AWDBlock();
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

				that.parse( xhr.response );
				callback();

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
	this._ptr = 0;

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
	this._cur_block_id = this.readU32();

	ns = this.readU8();
	type = this.readU8();
	len = this.readU32();

	// console.log( "AWDloader.js in block type - len : " , type , len);
	var posExpected = this._ptr + len;

	switch (type) {
		case 1:
			assetData = this.parseMeshData(len);
			break;
		case 22:
			assetData = this.parseContainer(len);
			break;
		case 24:
			assetData = this.parseMeshInstance(len);
			break;
		case 81:
			assetData = this.parseMaterial(len);
			break;
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
			this._ptr += len;
			break;
	}

	// console.log( "AWDloader.js in block parsed - ptr : " , this._ptr, "expected " , posExpected);


	// Store block reference for later use
	this._blocks[this._cur_block_id] = new AWDBlock();
	this._blocks[this._cur_block_id].data = assetData;
	this._blocks[this._cur_block_id].id = this._cur_block_id;

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


JUKEJS.AWDLoader.prototype.parseContainer = function ( len ) {
	var name;
	var par_id;
	var mtx;
	var ctr;
	var parent;
	
	ctr = new THREE.Object3D();

	par_id = this.readU32();
	mtx = this.parseMatrix4();
	ctr.name = this.readUTF();

	console.log( "AWDLoader parseContainer ", ctr.name );
	
	ctr.applyMatrix( mtx );
	
	parent = this._blocks[par_id].data || this.trunk;
	console.log( "			p", parent.name );
	parent.add(ctr);
	
	this.parseProperties(null);
	ctr.extra = this.parseUserAttributes();

	//finalizeAsset(ctr, name);
	
	return ctr;
}

JUKEJS.AWDLoader.prototype.parseMeshInstance = function ( len ) {
	var name;
	var mesh, geom;
	var par_id, data_id;
	var mtx;
	var materials;
	var num_materials;
	var materials_parsed;
	var parent;

	par_id = this.readU32();
	mtx = this.parseMatrix4();
	name = this.readUTF();

	console.log( "AWDLoader parseMeshInstance ", name );

	data_id = this.readU32();
	geom = this._blocks[data_id].data;

	materials = [];
	num_materials = this.readU16();
	materials_parsed = 0;
	while (materials_parsed < num_materials) {
		var mat_id;
		mat_id = this.readU32();
		
		materials.push(this._blocks[mat_id].data);
		
		materials_parsed++;
	}

	mesh = new THREE.Mesh( geom );
	mesh.applyMatrix( mtx );
	mesh.name = name;

	// Add to parent if one exists
	parent = this._blocks[par_id].data || this.trunk;
	parent.add(mesh);
	

	// TODO check sub geom lenght?
	if (materials.length >= 1 ) {
		mesh.material = materials[0];
	}
	else if (materials.length > 1) {
		mesh.material = materials;
	}

	// Ignore for now
	this.parseProperties(null);
	mesh.extra = this.parseUserAttributes();

	//finalizeAsset(mesh, name);

	return mesh;
}


JUKEJS.AWDLoader.prototype.parseMaterial = function ( len ) {
	var name;
	var type;
	var props;
	var mat;
	var attributes;
	var finalize;
	var num_methods;
	var methods_parsed;

	name = this.readUTF();
	type = this.readU8();
	num_methods = this.readU8();

	console.log( "AWDLoader parseMaterial ",name )

	// Read material numerical properties
	// (1=color, 2=bitmap url, 11=alpha_blending, 12=alpha_threshold, 13=repeat)
	props = this.parseProperties({ 1:AWD_FIELD_INT32, 2:AWD_FIELD_BADDR, 
		11:AWD_FIELD_BOOL, 12:AWD_FIELD_FLOAT32, 13:AWD_FIELD_BOOL });

	methods_parsed = 0;

	while (methods_parsed < num_methods) {
		var method_type;
		
		method_type = this.readU16();
		this.parseProperties(null);
		this.parseUserAttributes();
	}

	attributes = this.parseUserAttributes();
	
	if( this.materialFactory !== undefined ) {
		mat = this.materialFactory( name );
		if( mat ) return mat;
	}

	if (type == 1) { // Color material
		mat = new THREE.MeshBasicMaterial();
		mat.color = new THREE.Color( props.get(1, 0xcccccc) );
	}
	else if (type == 2) { // Bitmap material

		mat = new THREE.MeshBasicMaterial();

		//TODO: not used
		//var bmp : BitmapData;
		// var texture : Texture2DBase;
		// var tex_addr : uint;
		
		// tex_addr = props.get(2, 0);
		// texture = _blocks[tex_addr].data;
		
		// // If bitmap asset has already been loaded
		// if (texture) {
		// 	mat = new TextureMaterial(texture);
		// 	TextureMaterial(mat).alphaBlending = props.get(11, false);
		// 	finalize = true;
		// }
		// else {
		// 	// No bitmap available yet. Material will be finalized
		// 	// when texture finishes loading.
		// 	mat = new TextureMaterial(null);
		// 	if (tex_addr > 0)
		// 		_texture_users[tex_addr.toString()].push(mat);
			
		// 	finalize = false;
		// }
	}

	mat.extra = attributes;
	mat.alphaThreshold = props.get(12, 0.0);
	mat.repeat = props.get(13, false);

	// if (finalize) {
	// 	finalizeAsset(mat, name);
	// }

	return mat;
}


JUKEJS.AWDLoader.prototype.parseMeshData = function ( len ) {

	var name;
	var geom;
	var num_subs;
	var subs_parsed;
	var props;
	var bsm;

	var face;
	var vector;
	var uv;

	// Read name and sub count
	name = this.readUTF();
	num_subs = this.readU16();

	console.log( "AWDloader.js parseMeshData geom name ["+name+"]", num_subs );

	// Read optional properties
	props = this.parseProperties({ 1:AWD_FIELD_MTX4x4 }); 

	var mtx;
	var bsm_data = props.get(1, null);
	if (bsm_data) {
		bsm = new THREE.Matrix4(bsm_data);
	}

	geom = new THREE.Geometry();
	geom.geometryGroups = {};
	geom.geometryGroupsList = [];

	
	// Loop through sub meshes
	subs_parsed = 0;

	while (subs_parsed < num_subs) {

		var mat_id, sm_len, sm_end;
		var sub_geom;
		var skinned_sub_geom;
		var w_indices;
		var weights;


		var geometryGroup = 
		geom.geometryGroups[ subs_parsed ] = 
		geom.geometryGroupsList[ subs_parsed ] = 
		{};

		geometryGroup.faces3 = [];
		geometryGroup.faces4 = [];
		geometryGroup.materialIndex = subs_parsed;
		geometryGroup.vertices = 0; // TODO useless

		


		geometryGroup.numMorphTargets = 0;
		geometryGroup.numMorphNormals = 0;


		sm_len = this.readU32();
		sm_end = this._ptr + sm_len;

		
		
		// Ignore for now
		this.parseProperties(null);

		// Loop through data streams
		while ( this._ptr < sm_end ) {
			

			var idx = 0;
			
			var str_type, str_len, str_end;

			str_type = this.readU8();
			str_end = this.readU32() + this._ptr;

			var x, y, z, u, v, a, b, c;

			// VERTICES
			if (str_type == 1) {

				geometryGroup.__vertexArray = new Float32Array( sm_len>>2 );

				while (this._ptr < str_end) {
					geometryGroup.__vertexArray[idx++] = this.readF32();
					geometryGroup.__vertexArray[idx++] = this.readF32();
					geometryGroup.__vertexArray[idx++] = this.readF32();
				}

			}
			// INDICES / FACES
			else if (str_type == 2) {
				
				while (this._ptr < str_end) {
					a = this.readU16();
					b = this.readU16();
					c = this.readU16();
					geometryGroup.faces3.push( new THREE.Face3( a, b, c ) );
				}
			}
			// UVS / TEX COORDS
			else if (str_type == 3) {
				
				geometryGroup.__uvArray = new Float32Array( sm_len>>2 );

				while (this._ptr < str_end) {
					geometryGroup.__uvArray[idx++] = this.readF32();
				}

			}
			// NORMALS
			else if (str_type == 4) {
				
				geometryGroup.__normalArray = new Float32Array( sm_len>>2 );
				
				while (this._ptr < str_end) {
					geometryGroup.__normalArray[idx++] = this.readF32();
				}

			}

			else if (str_type == 6) {
				// TODO error not supported ?
				this._ptr = str_end;
			}
			else if (str_type == 7) {
				// TODO error not supported ?
				this._ptr = str_end;
			}
			else {
				this._ptr = str_end;
			}


			//console.log( "AWDloader.js end stream, pos : " , this._ptr, " expected : ", str_end );
			
		}

		// Ignore sub-mesh attributes for now
		

		// If there were weights and joint indices defined, this
		// is a skinned mesh and needs to be built from skinned
		// sub-geometries, so copy data across.
		/*
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
		*/

		this.parseUserAttributes();
		subs_parsed++;
	}

	// rebuild Geometry


	this.parseUserAttributes();
	//finalizeAsset(geom, name);

	return geom;
}

JUKEJS.AWDLoader.prototype.parseMatrix4 = function ( ) {
	var mtx = new THREE.Matrix4();
	var e = mtx.elements;

	e[0] = this.readF32();
	e[1] = this.readF32();
	e[2] = this.readF32();
	e[3] = this.readF32();
	//e[3] = 0.0;

	e[4] = this.readF32();
	e[5] = this.readF32();
	e[6] = this.readF32();
	e[7] = this.readF32();
	//e[7] = 0.0;

	e[8] = this.readF32();
	e[9] = this.readF32();
	e[10] = this.readF32();
	e[11] = this.readF32();
	// e[11] = 0.0;

	e[12] = this.readF32();
	e[13] = this.readF32();
	e[14] = this.readF32();
	e[15] = this.readF32();
	// e[15] = 1.0;
	return mtx;
}


JUKEJS.AWDLoader.prototype.parseProperties = function ( expected ) {
	var list_len = this.readU32();
	var list_end = this._ptr + list_len;

	var props = new AWDProperties();

	if( expected ) {

		while( this._ptr < list_end ) {

			var key = this.readU16();
			var len = this.readU16();
			var type;

			if( expected.hasOwnProperty( key ) ) {
				type = expected[ key ];
				props.set( key, this.parseAttrValue( type, len ) );
			} else {
				this._ptr += len;
			}
		}

	}

	return props;

};


JUKEJS.AWDLoader.prototype.parseUserAttributes = function ( ) {
	// skip for now
	this._ptr = this.readU32() + this._ptr;
	return null;
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
			list.push(read_func.call( this ) );
			num_read++;
		}

		return list;
	}
	else {
		return read_func.call( this );
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
	var end = this.readU16();
	
	// TODO(user): Use native implementations if/when available
	
	var out = [], c = 0;
	
	while ( out.length < end ) {
		var c1 = this._data.getUint8( this._ptr++ );
		if (c1 < 128) {
			out[c++] = String.fromCharCode(c1);
		} else if (c1 > 191 && c1 < 224) {
			var c2 = this._data.getUint8( this._ptr++ );
			out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
		} else {
			var c2 = this._data.getUint8( this._ptr++ );
			var c3 = this._data.getUint8( this._ptr++ );
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
	var id;
	var data;
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