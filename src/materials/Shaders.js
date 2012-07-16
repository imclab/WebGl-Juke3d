/**
 * User: lepersp
 * Date: 16/07/12
 * Time: 10:28
 */

JUKEJS.UniformsLib = {

	rimcolor: {

		"rimColor" : { type: "c", value: new THREE.Color( 0xffffff ) },
		"rimPower" : { type: "f", value: 3.0 },
		"rimStrength" : { type: "f", value: 1.0 }

    },

    rimalpha: {

		"ra_in" : { type: "f", value: 0.2 },
		"ra_out" : { type: "f", value: 0.8 },
		"ra_pow" : { type: "f", value: 1.0 }

    }
}


JUKEJS.ShaderChunk = {

	// FOG

	rim_pars_vertex: [


		"varying float vNormal;"



	].join("\n"),

	rim_vertex :
        "vNormal = dot( normalize( cameraPosition - mPosition.xyz  ), normalize( nWorld.xyz ));"
    ,

	rim_pars_fragment: [

        "varying float vNormal;",

        "uniform vec3 rimColor;",
        "uniform float rimPower;",
        "uniform float rimStrength;"



	].join("\n"),

    rim_fragment: [


        "float nclamped = pow( 1.0-clamp( vNormal, 0.0, 1.0 ), rimPower ) * rimStrength;",
        "gl_FragColor = mix( gl_FragColor, vec4( rimColor, gl_FragColor.w ), nclamped );"


	].join("\n"),

   /*----------------------------------------------------------------------------------
                                                                                rim alpha
     */
    rim_alpha_pars_vertex: [
		"varying float vNormal;"
	].join("\n"),

	rim_alpha_vertex : [

		"vNormal = dot( normalize( cameraPosition - mPosition.xyz ), normalize( nWorld.xyz ));"

	].join("\n"),

    rim_alpha_pars_fragment: [

        "varying float vNormal;",

        "uniform float ra_in;",
        "uniform float ra_out;",
        "uniform float ra_pow;"

	].join("\n"),

    rim_alpha_fragment : [


        "float nclamped = 1.0-clamp( vNormal, 0.0, 1.0 );",
        "gl_FragColor.a = mix( ra_in, ra_out, nclamped );"


	].join("\n"),

    /*----------------------------------------------------------------------------------
                                                                                reflexion
     */
    reflexion_pars_fragment: [

		"#ifdef USE_ENVMAP",

			"varying vec3 vReflect;",

			"uniform float reflectivity;",
			"uniform samplerCube envMap;",
			"uniform float flipEnvMap;",
			"uniform int combine;",

		"#endif"

	].join("\n"),

	reflexion_fragment: [

		"#ifdef USE_ENVMAP",

			"#ifdef DOUBLE_SIDED",

				"float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );",
				"vec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * vReflect.x, vReflect.yz ) );",

			"#else",

				"vec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * vReflect.x, vReflect.yz ) );",

			"#endif",

			"#ifdef GAMMA_INPUT",

				"cubeColor.xyz *= cubeColor.xyz;",

			"#endif",

			"if ( combine == 1 ) {",

				"gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, reflectivity );",

			"} else {",

				"gl_FragColor.xyz = gl_FragColor.xyz + ( cubeColor.xyz *reflectivity );",

			"}",


		"#endif"

	].join("\n"),

	reflexion_pars_vertex: [

		"#ifdef USE_ENVMAP",

			"varying vec3 vReflect;",

			"uniform float refractionRatio;",
			"uniform bool useRefract;",

		"#endif"

	].join("\n"),

	reflexion_vertex : [

		"#ifdef USE_ENVMAP",

			"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
			"vec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;",

			"if ( useRefract ) {",

				"vReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );",

			"} else {",

				"vReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );",

			"}",

		"#endif"

	].join("\n")
}

JUKEJS.ShaderLib = {

    // based on basic
	'carlak': {

		uniforms: THREE.UniformsUtils.merge( [

			JUKEJS.UniformsLib[ "rimcolor" ],
			THREE.UniformsLib[ "common" ]

		] ),

		vertexShader: [
			JUKEJS.ShaderChunk[ "rim_pars_vertex" ],
			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			JUKEJS.ShaderChunk[ "reflexion_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				JUKEJS.ShaderChunk[ "reflexion_vertex" ],
                JUKEJS.ShaderChunk[ "rim_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [
			"uniform vec3 diffuse;",
			"uniform float opacity;",
            JUKEJS.ShaderChunk[ "rim_pars_fragment" ],
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			JUKEJS.ShaderChunk[ "reflexion_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",

				JUKEJS.ShaderChunk[ "rim_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				JUKEJS.ShaderChunk[ "reflexion_fragment" ],



			"}"

		].join("\n")

	},
	// based on basic
	'carglass': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			JUKEJS.UniformsLib[ "rimalpha" ]

		] ),

		vertexShader: [
			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			JUKEJS.ShaderChunk[ "reflexion_pars_vertex" ],
			JUKEJS.ShaderChunk[ "rim_alpha_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				JUKEJS.ShaderChunk[ "reflexion_vertex" ],
				JUKEJS.ShaderChunk[ "rim_alpha_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [
			"uniform vec3 diffuse;",
			"uniform float opacity;",
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			JUKEJS.ShaderChunk[ "reflexion_pars_fragment" ],
			JUKEJS.ShaderChunk[ "rim_alpha_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",
                JUKEJS.ShaderChunk[ "rim_alpha_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				JUKEJS.ShaderChunk[ "reflexion_fragment" ],



			"}"

		].join("\n")

	}
}

/*----------------------------------------------------------------------------------
                                                                NO_UV_ShaderMaterial
  trick to avoid webgl renderer to request uv on geometry
 */

JUKEJS.NO_UV_ShaderMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.fragmentShader = parameters.fragmentShader !== undefined ? parameters.fragmentShader : "void main() {}";
	this.vertexShader = parameters.vertexShader !== undefined ? parameters.vertexShader : "void main() {}";
	this.uniforms = parameters.uniforms !== undefined ? parameters.uniforms : {};
	this.attributes = parameters.attributes;

	this.shading = parameters.shading !== undefined ? parameters.shading : THREE.SmoothShading;

	this.wireframe = parameters.wireframe !== undefined ? parameters.wireframe : false;
	this.wireframeLinewidth = parameters.wireframeLinewidth !== undefined ? parameters.wireframeLinewidth : 1;

	this.fog = parameters.fog !== undefined ? parameters.fog : false; // set to use scene fog

	this.lights = parameters.lights !== undefined ? parameters.lights : false; // set to use scene lights

	this.vertexColors = parameters.vertexColors !== undefined ? parameters.vertexColors : THREE.NoColors; // set to use "color" attribute stream

	this.skinning = parameters.skinning !== undefined ? parameters.skinning : false; // set to use skinning attribute streams

	this.morphTargets = parameters.morphTargets !== undefined ? parameters.morphTargets : false; // set to use morph targets
	this.morphNormals = parameters.morphNormals !== undefined ? parameters.morphNormals : false; // set to use morph normals


};

JUKEJS.NO_UV_ShaderMaterial.prototype = new THREE.Material();
JUKEJS.NO_UV_ShaderMaterial.prototype.constructor = THREE.NO_UV_ShaderMaterial;