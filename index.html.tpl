<!doctype html>
<html lang="en">
	<head>
		<title>JukeJS</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<style>
			body {
				background:#fff;
				padding:0;
				margin:0;
				font-weight: bold;
				overflow:hidden;
			}
		</style>
	</head>

	<body>
		<script src="./js/ThreeDebug.js"></script>

		@JSIMPORTS@

		<script>

			var container;

			run();

			function run() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );
				
				window.jukeentry( container );
				
			}


		</script>
	</body>
</html>
