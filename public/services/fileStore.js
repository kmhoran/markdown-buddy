"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenFile = OpenFile;
exports.OpenDefaultDocument = OpenDefaultDocument;

var _electron = require("electron");

var _fs = _interopRequireDefault(require("fs"));

var _config = _interopRequireDefault(require("../config.app"));

var _electronEventTypes = require("../constants/electronEventTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var encoding = _config.default.defaultEncoding;

function OpenFile(window, errHandler) {
  _electron.dialog.showOpenDialog({
    filters: [{
      name: "Markdown",
      extensions: ["md"]
    }, {
      name: "All Files",
      extensions: ["*"]
    }],
    properties: ["openFile"]
  }, function (files) {
    _fs.default.readFile(files[0], encoding, function (err, contents) {
      if (err) errHandler(err);
      window.webContents.send(_electronEventTypes.APP_LOAD_DOC, createDocumentObject(contents));
    });
  });
}

function OpenDefaultDocument(callback) {
  try {
    _fs.default.readFile(_config.default.defaultDocument, encoding, function (err, contents) {
      if (err) throw err;
      console.log(contents);
      callback(null, createDocumentObject(contents, "markdown"));
    });
  } catch (error) {
    callback(error);
  }
}

function createDocumentObject(contents, type) {
  var isDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return {
    text: contents,
    type: type,
    isDefault: isDefault
  };
}