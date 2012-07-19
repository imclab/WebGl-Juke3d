/**
 * User: lepersp
 * Date: 18/07/12
 * Time: 12:10
 */

iolib = {};

/**
 * Loads a file from an external file. This function is
 * asynchronous.
 * @param  url {String} The url of the external file.
 * @param  callback {function} A callback passed the loaded
 *     ArrayBuffer and an exception which will be null on
 *     success.
 */
iolib.loadArrayBuffer = function(url, callback) {
    var error = 'loadArrayBuffer failed to load url "' + url + '"';
    var request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        throw 'XMLHttpRequest is disabled';
    }
    request.open('GET', url, true);
    var finish = function() {
        if (request.readyState == 4) {
            var text = '';
            // HTTP reports success with a 200 status. The file protocol reports
            // success with zero. HTTP does not use zero as a status code (they
            // start at 100).
            // https://developer.mozilla.org/En/Using_XMLHttpRequest
            var success = request.status == 200 || request.status == 0;
            if (success) {
                var arrayBuffer = request.response;
            }
            callback(arrayBuffer, success ? null : 'could not load: ' + url);
        }
    };
    request.onreadystatechange = finish;
    if (request.responseType === undefined) {
        throw 'no support for binary files';
    }
    request.responseType = "arraybuffer";
    request.send(null);
};