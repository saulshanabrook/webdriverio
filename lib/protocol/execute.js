/**
 *
 * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
 * The executed script is assumed to be synchronous and the result of evaluating the script is returned to
 * the client.
 *
 * The script argument defines the script to execute in the form of a function body. The value returned by
 * that function will be returned to the client. The function will be invoked with the provided args array
 * and the values may be accessed via the arguments object in the order specified.
 *
 * Arguments may be any JSON-primitive, array, or JSON object. JSON objects that define a WebElement
 * reference will be converted to the corresponding DOM element. Likewise, any WebElements in the script
 * result will be returned to the client as [WebElement JSON objects](https://code.google.com/p/selenium/wiki/JsonWireProtocol#WebElement_JSON_Object).
 *
 * <example>
    :execute.js
    client.execute(function(a, b, c, d) {
        // browser context - you may not access neither client nor console
        return a + b + c + d;
    }, 1, 2, 3, 4).then(function(ret) {
        // node.js context - client and console are available
        console.log(ret.value); // outputs: 10
    });
 * </example>
 *
 * @param {String|Function} script                     The script to execute.
 * @param {*}               [argument1,...,argumentN]  script arguments
 *
 * @returns {*}             The script result.
 *
 * @see  https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/execute
 * @type protocol
 *
 */

var ErrorHandler = require('../utils/ErrorHandler.js');

module.exports = function execute () {

    var args = Array.prototype.slice.call(arguments),
        script = args.shift();

    /*!
     * parameter check
     */
    if((typeof script !== 'string' && typeof script !== 'function')) {
        throw new ErrorHandler.ProtocolError('number or type of arguments don\'t agree with execute protocol command');
    }

    /**
     * instances started as multibrowserinstance can't getting called with
     * a function paramter, therefor we need to check if it starts with "function () {"
     */
    if (typeof script === 'function' || (this.inMultibrowserMode && script.indexOf('function (') === 0)) {
        script = 'return (' + script + ').apply(null, arguments);';
    }

    var requestPath = '/session/:sessionId/execute';

    return this.requestHandler.create(
        requestPath,
        {script: script, args: args}
    );

};

