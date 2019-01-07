import { ipcMain } from "electron";
import { OpenDefaultDocument, SaveDocument } from "./fileStore";
import {
  APP_LOAD_DOC,
  APP_DOCUMENT_READ_ERROR,
  APP_LOAD_DEFAULT_DOC,
  APP_RETURN_FOCUSED_DOCUMENT,
  PING,
  PONG
} from "../constants/electronEventTypes";

export default {
  set: () => {
    console.log("setting event listeners.");
    // render-to-main handshake
    ipcMain.on(PING, (event, arg) => {
      const message = { success: true };
      event.sender.send(PONG, message);
    });

    // open default file
    ipcMain.on(APP_LOAD_DEFAULT_DOC, (event, arg) => {
      OpenDefaultDocument((error, doc) => {
        if (error) event.sender.send(APP_DOCUMENT_READ_ERROR, error);
        else event.sender.send(APP_LOAD_DOC, doc);
      });
    });

    //
    ipcMain.on(APP_RETURN_FOCUSED_DOCUMENT, (event, doc) => {
      SaveDocument(doc, (err, doc) => {
        if(err) console.log("[event-listeners] error ",err);
        console.log("gor saved doc: ", doc);
      })
    });
  }
};
