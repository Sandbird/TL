(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function($, window, document, undefined) {
  "use strict"

  var download = function (options) {
    var triggerDelay = (options && options.delay) || 100
    var cleaningDelay = (options && options.cleaningDelay) || 1000

    this.each(function (index, item) {
      createIFrame(item, index * triggerDelay, cleaningDelay)
    })
    return this
  }

  var createIFrame = function (item, triggerDelay, cleaningDelay) {
    setTimeout(function () {
      var frame = $('<iframe style="display: none;" class="multi-download-frame"></iframe>')

      frame.attr('src', $(item).attr('href') || $(item).attr('src'))
      $(item).after(frame)

      setTimeout(function () { frame.remove() }, cleaningDelay)
    }, triggerDelay)
  }

  $.fn.multiDownload = function(options) {
      return download.call(this, options)
  }

})(jQuery, window, document);

},{}],2:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-18T15:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}{"jquery-multidownload":1}]},{},[3]);
