import { dialog } from "electron";
import fs from "fs";
import path from "path";
import config from "../config.app";
import { APP_LOAD_DOC } from "../constants/electronEventTypes";

const encoding = config.defaultEncoding;

export function OpenFile(window, errHandler) {
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
        const doc = await renderExistingDocument(files[0]);
        console.log("[main_filestore] opened doc: ", doc);
        window.webContents.send(APP_LOAD_DOC, doc);
      }
    );
  } catch (err) {
    errHandler(err);
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

async function renderExistingDocument(docPath) {
  console.log("[main_filestore] rendering default");
  const contents = await readFileAsync(docPath);
  console.log("[main_filestore] contents: ", contents);

  const ext = path.extname(docPath);
  return {
    text: contents,
    isDefault: docPath === config.defaultDocument,
    uid: renderUid(),
    directory: path.dirname(docPath),
    name: path.basename(docPath, ext), // return file name w/o ext
    ext: ext.substring(1), // remove leading '.'
    unsavedChanges: false
  };
}

function renderUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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



