(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("glitchlib", [], factory);
	else if(typeof exports === 'object')
		exports["glitchlib"] = factory();
	else
		root["glitchlib"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Section = Section;
var STARTBYTE = exports.STARTBYTE = 0xff;
var PADBYTE = exports.PADBYTE = 0x00;
var SOF0 = exports.SOF0 = { name: 'SOF0', tag: new Uint8Array([STARTBYTE, 0xc0]) };
var SOF2 = exports.SOF2 = { name: 'SOF2', tag: new Uint8Array([STARTBYTE, 0xc2]) };
var DHT = exports.DHT = { name: 'DHT', tag: new Uint8Array([STARTBYTE, 0xc4]) };
var DQT = exports.DQT = { name: 'DQT', tag: new Uint8Array([STARTBYTE, 0xdb]) };
var SOS = exports.SOS = { name: 'SOS', tag: new Uint8Array([STARTBYTE, 0xda]) };
var SOI = exports.SOI = { name: 'SOI', tag: new Uint8Array([STARTBYTE, 0xd8]) };
var EOI = exports.EOI = { name: 'EOI', tag: new Uint8Array([STARTBYTE, 0xd9]) };
var COM = exports.COM = { name: 'COM', tag: new Uint8Array([STARTBYTE, 0xfe]) };
var APP = exports.APP = {
  name: 'SOS',
  upper: new Uint8Array([STARTBYTE, 0xef]),
  lower: new Uint8Array([STARTBYTE, 0xe0]),
  tag: new Uint8Array([STARTBYTE, 0xe0])
};

function Section(section, size, position) {
  return {
    section: section,
    size: size,
    position: position
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = decodeJpeg;

var _parsers = __webpack_require__(4);

var _sections = __webpack_require__(0);

var parsers = [new _parsers.JpegSOIParser(), new _parsers.JpegSectionParser(_sections.SOF0), new _parsers.JpegSectionParser(_sections.SOF2), new _parsers.JpegSectionParser(_sections.DHT), new _parsers.JpegSectionParser(_sections.DQT), new _parsers.JpegSOSParser(), new _parsers.JpegAPPParser(), new _parsers.JpegSectionParser(_sections.COM), new _parsers.JpegEOIParser()];

function getParser(firstTagByte, secondTagByte) {
  return parsers.find(function (p) {
    return p.parses(firstTagByte, secondTagByte);
  });
}

function decodeJpegRecur(imageData, sections, position) {
  if (position >= imageData.length) {
    return sections;
  }
  var firstTagByte = imageData[position];
  var secondTagByte = imageData[position + 1];
  if (firstTagByte !== _sections.STARTBYTE) {
    throw new Error('Invalid initial tag value: ' + firstTagByte.toString(16));
  }
  var parser = getParser(firstTagByte, secondTagByte);
  if (parser === undefined) {
    throw new Error('Could not find parser for ' + secondTagByte.toString(16));
  }
  var section = parser.parseData(imageData, position);
  var newPosition = position + section.size;
  return decodeJpegRecur(imageData, sections.concat([section]), newPosition);
}

// imageData should be a Uint8Array
function decodeJpeg(imageData) {
  return decodeJpegRecur(imageData, [], 0);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomQuantGlitch = randomQuantGlitch;

var _sections = __webpack_require__(0);

function randomQuantGlitch(imageData, sections) {
  sections.forEach(function (s) {
    if (s.section === _sections.DQT.name) {
      var p = void 0;
      var g = void 0;
      for (p = s.position + 2; p < s.position + s.size; p += 1) {
        if (Math.random() < 0.1) {
          g = Math.floor(Math.random() * 253 + 1);
          console.log(imageData[p], g);
          imageData[p] = g;
        }
      }
    }
  });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomQuantGlitch = exports.decodeJpeg = undefined;

var _decoder = __webpack_require__(1);

var _decoder2 = _interopRequireDefault(_decoder);

var _quantGlitcher = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.decodeJpeg = _decoder2.default;
exports.randomQuantGlitch = _quantGlitcher.randomQuantGlitch;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JpegAPPParser = exports.JpegSOSParser = exports.JpegEOIParser = exports.JpegSOIParser = exports.JpegSectionParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sections = __webpack_require__(0);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JpegSectionParser = exports.JpegSectionParser = function () {
  function JpegSectionParser(section) {
    _classCallCheck(this, JpegSectionParser);

    this.pTag = section.tag;
    this.name = section.name;
    this.pTagSize = section.tag.length;
  }

  _createClass(JpegSectionParser, [{
    key: 'parses',
    value: function parses(firstTagByte, secondTagByte) {
      return this.pTag[0] === firstTagByte && this.pTag[1] === secondTagByte;
    }
  }, {
    key: 'parseData',
    value: function parseData(data, position) {
      // Section size does not include initial tag
      var segmentStart = position + this.pTagSize;
      var segmentSize = data[segmentStart] * 8 + data[segmentStart + 1];
      var size = this.pTagSize + segmentSize;
      return (0, _sections.Section)(this.name, size, position);
    }
  }]);

  return JpegSectionParser;
}();

var JpegSOIParser = exports.JpegSOIParser = function (_JpegSectionParser) {
  _inherits(JpegSOIParser, _JpegSectionParser);

  function JpegSOIParser() {
    _classCallCheck(this, JpegSOIParser);

    return _possibleConstructorReturn(this, (JpegSOIParser.__proto__ || Object.getPrototypeOf(JpegSOIParser)).call(this, _sections.SOI));
  }

  _createClass(JpegSOIParser, [{
    key: 'parseData',
    value: function parseData(data, position) {
      // This is the opening tag so it's only ever 2 bytes
      var size = 2;
      return (0, _sections.Section)(this.name, size, position);
    }
  }]);

  return JpegSOIParser;
}(JpegSectionParser);

var JpegEOIParser = exports.JpegEOIParser = function (_JpegSectionParser2) {
  _inherits(JpegEOIParser, _JpegSectionParser2);

  function JpegEOIParser() {
    _classCallCheck(this, JpegEOIParser);

    return _possibleConstructorReturn(this, (JpegEOIParser.__proto__ || Object.getPrototypeOf(JpegEOIParser)).call(this, _sections.EOI));
  }

  _createClass(JpegEOIParser, [{
    key: 'parseData',
    value: function parseData(data, position) {
      // This is the closing tag so it's only ever 2 bytes
      var size = 2;
      return (0, _sections.Section)(this.name, size, position);
    }
  }]);

  return JpegEOIParser;
}(JpegSectionParser);

var JpegSOSParser = exports.JpegSOSParser = function (_JpegSectionParser3) {
  _inherits(JpegSOSParser, _JpegSectionParser3);

  function JpegSOSParser() {
    _classCallCheck(this, JpegSOSParser);

    return _possibleConstructorReturn(this, (JpegSOSParser.__proto__ || Object.getPrototypeOf(JpegSOSParser)).call(this, _sections.SOS));
  }

  _createClass(JpegSOSParser, [{
    key: 'parseData',
    value: function parseData(data, position) {
      // Section size does not include initial tag
      var segmentStart = position + this.pTagSize;
      var segmentSize = data[segmentStart] * 8 + data[segmentStart + 1];
      var segmentHeaderSize = this.pTagSize + segmentSize;
      var i = void 0;
      for (i = position + segmentHeaderSize; i < data.length; i += 1) {
        if (data[i] === _sections.STARTBYTE && data[i + 1] !== _sections.PADBYTE) {
          break;
        }
      }
      var finalSize = i - position;
      return (0, _sections.Section)(this.name, finalSize, position);
    }
  }]);

  return JpegSOSParser;
}(JpegSectionParser);

var JpegAPPParser = exports.JpegAPPParser = function (_JpegSectionParser4) {
  _inherits(JpegAPPParser, _JpegSectionParser4);

  function JpegAPPParser() {
    _classCallCheck(this, JpegAPPParser);

    var _this4 = _possibleConstructorReturn(this, (JpegAPPParser.__proto__ || Object.getPrototypeOf(JpegAPPParser)).call(this, _sections.APP));

    _this4.pTagUpper = _sections.APP.upper;
    _this4.pTagLower = _sections.APP.lower;
    return _this4;
  }

  _createClass(JpegAPPParser, [{
    key: 'parses',
    value: function parses(firstTagByte, secondTagByte) {
      return this.pTagLower[0] === firstTagByte && this.pTagLower[1] <= secondTagByte && this.pTagUpper[1] >= secondTagByte;
    }
  }]);

  return JpegAPPParser;
}(JpegSectionParser);

/***/ })
/******/ ]);
});
//# sourceMappingURL=glitchlib.js.map