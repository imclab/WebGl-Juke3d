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


    tone_mapping: {

		"exposure" : { type: "f", value: 1.0 },
		"gamma" : { type: "f", value: 1.0 }

    },

    rimalpha: {

		"ra_in" : { type: "f", value: 0.2 },
		"ra_out" : { type: "f", value: 0.8 },
		"ra_pow" : { type: "f", value: 1.0 }

    },

    natural : {
        "radMap" : { type: "t", value: 0, texture: null }
    },

    normalmap: {
        "tNormal" : { type: "t", value: 0, texture: null }
    }
};


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

            "#ifdef FRESNEL_ENVMAP",

			    "varying float vfresnel;",

            "#endif",

            "#ifdef HDR_TONE_MAP",

                "uniform float       exposure;",
			    "uniform float       gamma;",

            "#endif",

            "#ifdef NORMAL_MAP",

                "uniform sampler2D tNormal;",
        	    "varying vec2 vUv;",
        	    "varying vec3 vTangent;",
				"varying vec3 vBinormal;",
             "#endif",


		"#endif"

	].join("\n"),

	reflexion_fragment: [

		"#ifdef USE_ENVMAP",


            "#ifdef NORMAL_MAP",

                "vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;",
                "normalTex = normalize( normalTex );",
                "mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( normalTex ) );",
                "vec3 reflect = tsb * vReflect;",
                "reflect = normalize( reflect );",


//                "vec3 reflect = vReflect + normalTex;",
//                "vec3 reflect = vReflect;",
            "#else",

                "vec3 reflect = vReflect;",

            "#endif",

			"#ifdef DOUBLE_SIDED",

				"float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );",
				"vec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflect.x, reflect.yz ) );",

			"#else",

				"vec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflect.x, reflect.yz ) );",

			"#endif",

            "#ifdef HDR_DECODE",

                "float exponent = ( cubeColor.a * 255.0 - 128.0 );",

                "cubeColor.rgb = cubeColor.rgb * pow(2.0, exponent);",

			"#endif",

            "#ifdef HDR_TONE_MAP",

//                "float Y = dot(vec4(0.30, 0.59, 0.11, 0.0), cubeColor);",
//                "float YD = exposure * (exposure/brightMax + 1.0) / (exposure + 1.0);",
//                "cubeColor *= YD;",
                "#ifdef USE_CAVITY",
                    "cubeColor.xyz = pow( exposure * aocav.g * cubeColor.xyz, vec3( gamma ) );",
                "#else",
                    "cubeColor.xyz = pow( exposure * cubeColor.xyz, vec3( gamma ) );",

                "#endif",


            "#endif",

			"#ifdef GAMMA_INPUT",

				"cubeColor.xyz *= cubeColor.xyz;",

			"#endif",

            "#ifdef FRESNEL_ENVMAP",

				"gl_FragColor.xyz = gl_FragColor.xyz + ( cubeColor.xyz * (vfresnel+reflectivity) );",

            "#else",

				"gl_FragColor.xyz = gl_FragColor.xyz + ( cubeColor.xyz *reflectivity );",

			"#endif",

//            "gl_FragColor.a = gl_FragColor.a + clamp( ( cubeColor.x + cubeColor.y + cubeColor.z )/3.0 - 1.0, 0.0, 10.0 );",


		"#endif"

	].join("\n"),

	reflexion_pars_vertex: [

		"#ifdef USE_ENVMAP",

			"varying vec3 vReflect;",

			"uniform float refractionRatio;",
			"uniform bool useRefract;",


             "#ifdef FRESNEL_ENVMAP",

			    "varying float vfresnel;",

                "const float  EtaValue           = 0.751879;",
                "const float  R0                 = 0.0546233;",

                "float fresnel(vec3 I, vec3 N)",
                "{",
                "    float cosAngle = 1.0-abs(dot(I, N));",
                "    float result   = cosAngle * cosAngle;",
                "    result = result * result;",
                "    result = result * cosAngle;",
                "    result = min(.7, clamp(result * (1.0 - R0) + R0, 0.0, 1.0 ) );",
                //"    result = min(.7, clamp(result * (1.0 - saturate(R0)) + R0), 0.0, 1.0 ) );",
                "    return result;",
                "}",

             "#endif",

             "#ifdef NORMAL_MAP",
        	    "attribute vec4 tangent;",
                "varying vec2 vUv;",
        	    "varying vec3 vTangent;",
				"varying vec3 vBinormal;",
             "#endif",

		"#endif"

	].join("\n"),

	reflexion_vertex : [

		"#ifdef USE_ENVMAP",

			"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
			"vec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;",


			"vReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );",

            "#ifdef FRESNEL_ENVMAP",

                "vfresnel = fresnel(normalize( cameraPosition - mPosition.xyz ), normalize( nWorld.xyz ) );",

		    "#endif",

             "#ifdef NORMAL_MAP",
                "vTangent = tangent.xyz;",
                "vBinormal = cross( normal, vTangent ) * tangent.w;",
                "vUv = uv;",
             "#endif",

        "#endif"

	].join("\n"),


    /*----------------------------------------------------------------------------------
                                                                                natural
     */
    natural_pars_fragment: [

        "uniform samplerCube radMap;",
        "varying vec3 nrm;"

	].join("\n"),

	natural_fragment: [

        "vec4 Creflect = textureCube(radMap, nrm);",
        "float exp = ( Creflect.a * 255.0 - 128.0 );",

        "Creflect.rgb = Creflect.rgb * pow(2.0, exp);",
        "Creflect.rgb = pow( 6.0 * Creflect.rgb, vec3( 1.5 ) );",
        "gl_FragColor.xyz = gl_FragColor.xyz *  Creflect.rgb;"

	].join("\n"),

	natural_pars_vertex: [

        "varying vec3 nrm;"


	].join("\n"),

	natural_vertex : [
        "nrm = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;"

	].join("\n"),

     ao_cavity_pars_fragment: [

        "#ifdef USE_LIGHTMAP",

            "varying vec2 vUv2;",
            "uniform sampler2D lightMap;",

        "#endif"

    ].join("\n"),

    ao_cavity_pars_vertex: [

        "#ifdef USE_LIGHTMAP",

            "varying vec2 vUv2;",

        "#endif"

    ].join("\n"),

    ao_cavity_fragment: [
        "#define USE_CAVITY",
        "#ifdef USE_LIGHTMAP",
            "vec3 aocav = texture2D( lightMap, vUv2 ).xyz;",
            "aocav.g = (aocav.g - .5) *5.0;",
            "gl_FragColor.rgb = gl_FragColor.rgb * aocav.r;",

        "#endif"

    ].join("\n"),

    ao_cavity_vertex: [

        "#ifdef USE_LIGHTMAP",

            "vUv2 = uv2;",

        "#endif"

    ].join("\n")


};

JUKEJS.ShaderLib = {

    // based on basic
	'carlak': {

		uniforms: THREE.UniformsUtils.merge( [

			JUKEJS.UniformsLib.rimcolor,
			JUKEJS.UniformsLib.natural,
			JUKEJS.UniformsLib.tone_mapping,
			THREE.UniformsLib[ "common" ]

		] ),

		vertexShader: [
			JUKEJS.ShaderChunk.rim_pars_vertex,
            JUKEJS.ShaderChunk.natural_pars_vertex,
			THREE.ShaderChunk[ "map_pars_vertex" ],
			JUKEJS.ShaderChunk.ao_cavity_pars_vertex,
			JUKEJS.ShaderChunk.reflexion_pars_vertex,

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
                JUKEJS.ShaderChunk.ao_cavity_vertex,
				JUKEJS.ShaderChunk.reflexion_vertex,
                JUKEJS.ShaderChunk.rim_vertex,
                JUKEJS.ShaderChunk.natural_vertex,
				THREE.ShaderChunk[ "default_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [
			"uniform vec3 diffuse;",
			"uniform float opacity;",
            JUKEJS.ShaderChunk.rim_pars_fragment,
            JUKEJS.ShaderChunk.natural_pars_fragment,
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
            JUKEJS.ShaderChunk.ao_cavity_pars_fragment,
			JUKEJS.ShaderChunk.reflexion_pars_fragment,

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",

				JUKEJS.ShaderChunk.rim_fragment,
                JUKEJS.ShaderChunk.natural_fragment,
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				JUKEJS.ShaderChunk.ao_cavity_fragment,
				THREE.ShaderChunk[ "color_fragment" ],
				JUKEJS.ShaderChunk.reflexion_fragment,



			"}"

		].join("\n")

	},    // based on basic
	'chrome': {

		uniforms: THREE.UniformsUtils.merge( [

			JUKEJS.UniformsLib.normalmap,
//			JUKEJS.UniformsLib.natural,
			JUKEJS.UniformsLib.tone_mapping,
			THREE.UniformsLib[ "common" ]

		] ),

		vertexShader: [
//            JUKEJS.ShaderChunk.natural_pars_vertex,
			THREE.ShaderChunk[ "map_pars_vertex" ],
			JUKEJS.ShaderChunk.reflexion_pars_vertex,

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				JUKEJS.ShaderChunk.reflexion_vertex,
//                JUKEJS.ShaderChunk.natural_vertex,
				THREE.ShaderChunk[ "default_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [
			"uniform vec3 diffuse;",
			"uniform float opacity;",
//            JUKEJS.ShaderChunk.natural_pars_fragment,
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			JUKEJS.ShaderChunk.reflexion_pars_fragment,

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",

//                JUKEJS.ShaderChunk.natural_fragment,
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				JUKEJS.ShaderChunk.reflexion_fragment,



			"}"

		].join("\n")

	},
	// based on basic
	'carglass': {

		uniforms: THREE.UniformsUtils.merge( [

			JUKEJS.UniformsLib.tone_mapping,
			THREE.UniformsLib[ "common" ],
			JUKEJS.UniformsLib.rimalpha

		] ),

		vertexShader: [
			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			JUKEJS.ShaderChunk.reflexion_pars_vertex,
			JUKEJS.ShaderChunk.rim_alpha_pars_vertex,

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				JUKEJS.ShaderChunk.reflexion_vertex,
				JUKEJS.ShaderChunk.rim_alpha_vertex,
				THREE.ShaderChunk[ "default_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [
			"uniform vec3 diffuse;",
			"uniform float opacity;",
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			JUKEJS.ShaderChunk.reflexion_pars_fragment,
			JUKEJS.ShaderChunk.rim_alpha_pars_fragment,

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",
                JUKEJS.ShaderChunk.rim_alpha_fragment,
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				JUKEJS.ShaderChunk.reflexion_fragment,



			"}"

		].join("\n")

	},

    'reflective_phong': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			JUKEJS.UniformsLib.tone_mapping,
			THREE.UniformsLib[ "shadowmap" ],

			{
				"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
				"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
				"shininess": { type: "f", value: 30 },
				"wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
			}

		] ),

		vertexShader: [

			"varying vec3 vViewPosition;",
			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "map_pars_vertex" ],
            JUKEJS.ShaderChunk.ao_cavity_pars_vertex,
			JUKEJS.ShaderChunk.reflexion_pars_vertex,
			THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
                JUKEJS.ShaderChunk.ao_cavity_vertex,
			    JUKEJS.ShaderChunk.reflexion_vertex,
				THREE.ShaderChunk[ "color_vertex" ],

				"#ifndef USE_ENVMAP",

					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",

				"#endif",

				"vViewPosition = -mvPosition.xyz;",

				THREE.ShaderChunk[ "morphnormal_vertex" ],

				"vNormal = transformedNormal;",

				THREE.ShaderChunk[ "lights_phong_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"uniform vec3 ambient;",
			"uniform vec3 emissive;",
			"uniform vec3 specular;",
			"uniform float shininess;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
            JUKEJS.ShaderChunk.ao_cavity_pars_fragment,
			JUKEJS.ShaderChunk.reflexion_pars_fragment,
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( vec3 ( 1.0 ), opacity );",

				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],

				THREE.ShaderChunk[ "lights_phong_fragment" ],

				JUKEJS.ShaderChunk.ao_cavity_fragment,
				THREE.ShaderChunk[ "color_fragment" ],
			    JUKEJS.ShaderChunk.reflexion_fragment,
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")
    },


    'hdrcube': {

        uniforms : THREE.UniformsUtils.merge( [

            JUKEJS.UniformsLib.tone_mapping,

            {
                "tCube": { type: "t", value: 1, texture: null },
                "tFlip": { type: "f", value: -1 }
            }
        ]),

        vertexShader: [

            "varying vec3 vViewPosition;",

            "void main() {",

                "vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
                "vViewPosition = cameraPosition - mPosition.xyz;",

                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\n"),

        fragmentShader: [

            "uniform samplerCube tCube;",
            "uniform float tFlip;",
            "uniform float exposure;",
            "uniform float gamma;",

            "varying vec3 vViewPosition;",

            "void main() {",

                "vec3 wPos = cameraPosition - vViewPosition;",
                "vec4 cubeColor = textureCube( tCube, vec3( tFlip * wPos.x, wPos.yz ) );",

                "float exponent = ( cubeColor.a * 255.0 - 128.0 );",
                "cubeColor.rgb = cubeColor.rgb * pow(2.0, exponent);",
                "gl_FragColor.xyz = pow( exposure * cubeColor.xyz, vec3( gamma ) );",
                "gl_FragColor.a = 1.0;",

            "}"

        ].join("\n")

    },

    'ground': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

                "vec2 uu = (vUv.xy - 3.0) / 3.0;",
                "float dist = sqrt( uu.x * uu.x + uu.y * uu.y );",
                "gl_FragColor.a = 2.2 - (dist*2.2);",

			"}"

		].join("\n")

	}

};

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