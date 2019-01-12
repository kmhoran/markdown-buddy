"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenFile = OpenFile;
exports.OpenDefaultDocument = OpenDefaultDocument;
exports.SaveDocument = SaveDocument;

var _electron = require("electron");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("../config.app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const encoding = _config.default.defaultEncoding;

function OpenFile(callback) {
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
      if (!files) return;
      const doc = await renderExistingDocument(files[0]);
      callback(null, doc);
    });
  } catch (err) {
    callback(err);
  }
}

function OpenDefaultDocument(callback) {
  try {
    renderExistingDocument(_config.default.defaultDocument).then(doc => {
      callback(null, doc);
    }).catch(err => {
      callback(err);
    });
  } catch (error) {
    callback(error);
  }
}

async function renderExistingDocument(docPath, uid = null) {
  const contents = await readFileAsync(docPath);

  const ext = _path.default.extname(docPath);

  const parentDirectoryPath = _path.default.dirname(docPath);

  const splitPath = parentDirectoryPath.split("/");
  const parentDirectory = splitPath[splitPath.length - 1];
  const isDefault = docPath === _config.default.defaultDocument;
  const uidFlag = isDefault ? "DEFAULT" : null;
  return {
    text: contents,
    isDefault,
    uid: uid || renderUid(uidFlag),
    parentDirectoryPath,
    parentDirectory,
    name: _path.default.basename(docPath, ext),
    // return file name w/o ext
    ext: ext.substring(1),
    // remove leading '.'
    unsavedChanges: false
  };
}

function renderUid(flag = null) {
  if (flag) return flag;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

function SaveDocument(doc, callback) {
  if (!doc) return;else if (doc.isDefault) callback(null, doc);else {
    const docPath = `${doc.parentDirectoryPath}/${doc.name}.${doc.ext}`;
    writeFileAsync(docPath, doc).then(() => {
      renderExistingDocument(docPath, doc.uid).then(newDoc => {
        callback(null, newDoc);
      });
    }).catch(err => {
      callback(err);
    });
  }
} // convert fs callbacks to promises


async function readFileAsync(docPath) {
  return new Promise((resolve, reject) => {
    _fs.default.readFile(docPath, encoding, (err, contents) => {
      if (err) reject(err);
      resolve(contents);
    });
  });
}

async function writeFileAsync(docPath, doc) {
  return new Promise((resolve, reject) => {
    _fs.default.writeFile(docPath, doc.text, err => {
      if (err) reject(err);
      resolve();
    });
  });
}