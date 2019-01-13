import { dialog } from "electron";
import fs from "fs";
import path from "path";
import config from "../config.app";

const encoding = config.defaultEncoding;

export function OpenFile(callback) {
  try {
    dialog.showOpenDialog(
      {
        filters: [
          { name: "Markdown", extensions: ["md"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      },
      async files => {
        if (!files) return;
        const doc = await renderExistingDocument(files[0]);
        callback(null, doc);
      }
    );
  } catch (err) {
    callback(err);
  }
}

export function OpenDefaultDocument(callback) {
  try {
    renderExistingDocument(config.defaultDocument)
      .then(doc => {
        callback(null, doc);
      })
      .catch(err => {
        callback(err);
      });
  } catch (error) {
    callback(error);
  }
}

async function renderExistingDocument(docPath, docId = null) {
  const contents = await readFileAsync(docPath);
  const ext = path.extname(docPath);
  const parentDirectoryPath = path.dirname(docPath);
  const splitPath = parentDirectoryPath.split("/");
  const parentDirectory = splitPath[splitPath.length - 1];
  const isDefault = docPath === config.defaultDocument;
  const docIdFlag = isDefault ? "DEFAULT" : null;
  return {
    text: contents,
    isDefault,
    docId: docId || renderDocId(docIdFlag),
    parentDirectoryPath,
    parentDirectory,
    name: path.basename(docPath, ext), // return file name w/o ext
    ext: ext.substring(1), // remove leading '.'
    unsavedChanges: false
  };
}

function renderDocId(flag=null) {
  if(flag) return flag;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function SaveDocument(doc, callback) {
  if (!doc) return;
  else if (doc.isDefault) callback(null, doc);
  else{
    const docPath = `${doc.parentDirectoryPath}/${doc.name}.${doc.ext}`;
    writeFileAsync(docPath, doc)
      .then(() => {
        renderExistingDocument(docPath, doc.docId).then(newDoc => {
          callback(null, newDoc);
        });
      })
      .catch(err => {
        callback(err);
      });
  }
}

// convert fs callbacks to promises
async function readFileAsync(docPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(docPath, encoding, (err, contents) => {
      if (err) reject(err);
      resolve(contents);
    });
  });
}

async function writeFileAsync(docPath, doc) {
  return new Promise((resolve, reject) => {
    fs.writeFile(docPath, doc.text, err => {
      if (err) reject(err);
      resolve();
    });
  });
}
