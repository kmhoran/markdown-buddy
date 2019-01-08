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
        console.log("[main_filestore] opened doc: ", doc);
        callback(null, doc);
      }
    );
  } catch (err) {
    callback(err);
  }
}

export function OpenDefaultDocument(callback) {
  try {
    console.log("[main_filestore] opening default");
    renderExistingDocument(config.defaultDocument)
      .then(doc => {
        console.log("[main_filestore] got default doc: ", doc);
        callback(null, doc);
      })
      .catch(err => {
        console.log("[main_filestore] gs errror: ", err);
        callback(err);
      });
  } catch (error) {
    console.log("[main_filestore] h5ws errror: ", error);
    callback(error);
  }
}

async function renderExistingDocument(docPath, uid = null) {
  const contents = await readFileAsync(docPath);
  const ext = path.extname(docPath);
  const parentDirectoryPath = path.dirname(docPath);
  const splitPath = parentDirectoryPath.split("/");
  const parentDirectory = splitPath[splitPath.length - 1];
  return {
    text: contents,
    isDefault: docPath === config.defaultDocument,
    uid: uid || renderUid(),
    parentDirectoryPath,
    parentDirectory,
    name: path.basename(docPath, ext), // return file name w/o ext
    ext: ext.substring(1), // remove leading '.'
    unsavedChanges: false
  };
}

function renderUid() {
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
    console.log("[main_filestore] saving file ", path);
    writeFileAsync(docPath, doc)
      .then(() => {
        renderExistingDocument(docPath, doc.uid).then(newDoc => {
          console.log("[main_filestore] returning saved file");
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
  console.log("[main_filestore] creating read promise");
  return new Promise((resolve, reject) => {
    fs.readFile(docPath, encoding, (err, contents) => {
      console.log("[main_filestore] file read! has err: ", err != null);
      if (err) reject(err);
      resolve(contents);
    });
  });
}

async function writeFileAsync(docPath, doc) {
  console.log("[main_filestore] creating write promise");
  return new Promise((resolve, reject) => {
    fs.writeFile(docPath, doc.text, err => {
      if (err) reject(err);
      resolve();
    });
  });
}
