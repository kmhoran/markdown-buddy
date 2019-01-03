import { dialog } from "electron";
import fs from "fs";
import config from "../config.app";

const encoding = config.defaultEncoding;

export function OpenFile(errHandler) {
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
        console.log(contents);
      });
    }
  );
}

export function OpenDefaultDocument(window, errHandler) {
  fs.readFile(config.defaultDocument, encoding, (err, contents) => {
    if (err) errHandler(err);
    console.log(contents);
    //pingTheRenderer(window, errHandler);
  });
}

function pingTheRenderer(window, errHandler) {
  try{
    const message = { title: "test", text: "this is a message" };
    console.log("sending message from Main: ", message);
    window.send("pong", message);
  } catch(e){
    errHandler(e);
  }
  
}

