import { dialog } from "electron";
import fs from "fs";
import config from "../config.app";
import { ipcMain } from "electron";

const encoding = config.defaultEncoding;

export function OpenFile(window, errHandler) {
  dialog.showOpenDialog(
    {
      filters: [
        { name: "Markdown", extensions: ["md"] },
        { name: "All Files", extensions: ["*"] }
      ],
      properties: ["openFile"]
    },
    files => {
      fs.readFile(files[0], encoding, (err, contents) => {
        if (err) errHandler(err);
        window.webContents.send("main-load-document", createDocumentObject(contents));
      });
    }
  );
}

export function OpenDefaultDocument(callback) {
  try {
    console.log("opeining default doc");
    fs.readFile(config.defaultDocument, encoding, (err, contents) => {
      if (err) throw err;

      console.log(contents);
      callback(null, createDocumentObject(contents, "markdown"));
    });
  } catch (error) {
    callback(error);
  }
}

function createDocumentObject(contents, type, isDefault = false) {
  return {
    text: contents,
    type,
    isDefault
  };
}
