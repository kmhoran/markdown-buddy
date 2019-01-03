"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenFile = OpenFile;
exports.OpenDefaultDocument = OpenDefaultDocument;

var _electron = require("electron");

var _fs = _interopRequireDefault(require("fs"));

var _config = _interopRequireDefault(require("../config.app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var encoding = _config.default.defaultEncoding;

function OpenFile(errHandler) {
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
      console.log(contents);
    });
  });
}

function OpenDefaultDocument(window, errHandler) {
  _fs.default.readFile(_config.default.defaultDocument, encoding, function (err, contents) {
    if (err) errHandler(err);
    console.log(contents); //pingTheRenderer(window, errHandler);
  });
}

function pingTheRenderer(window, errHandler) {
  try {
    var message = {
      title: "test",
      text: "this is a message"
    };
    console.log("sending message from Main: ", message);
    window.send("pong", message);
  } catch (e) {
    errHandler(e);
  }
}