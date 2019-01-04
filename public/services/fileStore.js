"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenFile = OpenFile;
exports.OpenDefaultDocument = OpenDefaultDocument;

var _electron = require("electron");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("../config.app"));

var _electronEventTypes = require("../constants/electronEventTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { resolve } from "uri-js";
// import { reject } from "bluebird-lst";
const encoding = _config.default.defaultEncoding;

function OpenFile(window, errHandler) {
  try {
    _electron.dialog.showOpenDialog({
      filters: [{
        name: "Markdown",
        extensions: ["md"]
      }, {
        name: "All Files",
        extensions: ["*"]
      }],
      properties: ["openFile"]
    }, async files => {
      const doc = await renderExistingDocument(files[0]);
      console.log("[main_filestore] opened doc: ", doc);
      window.webContents.send(_electronEventTypes.APP_LOAD_DOC, doc);
    });
  } catch (err) {
    errHandler(err);
  }
}

function OpenDefaultDocument(callback) {
  try {
    console.log("[main_filestore] opening default");
    renderExistingDocument(_config.default.defaultDocument).then(doc => {
      console.log("[main_filestore] got default doc: ", doc);
      callback(null, doc);
    }).catch(err => {
      console.log("[main_filestore] gs errror: ", err);
      callback(err);
    });
  } catch (error) {
    console.log("[main_filestore] h5ws errror: ", error);
    callback(error);
  }
}

function old_createDocumentObject(contents, type, isDefault = false) {
  return {
    text: contents,
    type,
    isDefault
  };
}

async function renderExistingDocument(docPath) {
  console.log("[main_filestore] rendering default");
  const contents = await readFileAsync(docPath);
  console.log("[main_filestore] contents: ", contents);

  const ext = _path.default.extname(docPath);

  return {
    text: contents,
    isDefault: docPath === _config.default.defaultDocument,
    uid: renderUid(),
    directory: _path.default.dirname(docPath),
    name: _path.default.basename(docPath, ext),
    ext: ext.substring(1),
    // remove leading '.'
    unsavedCanges: false
  };
}

function renderUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
} // convert fs callbacks to promises


async function readFileAsync(docPath) {
  console.log("[main_filestore] creating read promise");
  return new Promise((resolve, reject) => {
    _fs.default.readFile(docPath, encoding, (err, contents) => {
      console.log("[main_filestore] file read! has err: ", err != null);
      if (err) reject(err);
      resolve(contents);
    });
  });
}

async function fileStatAsync(docPath) {
  return new Promise((resolve, reject) => {
    _fs.default.stat(docPath, (err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });
}