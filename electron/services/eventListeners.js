import { ipcMain } from "electron";
import { OpenDefaultDocument, SaveDocument } from "./fileStore";
import {
  APP_MAIN_LOAD_DOC,
  APP_MAIN_DOCUMENT_READ_ERROR,
  APP_RENDER_LOAD_DEFAULT_DOC,
  APP_RENDER_RETURN_FOCUSED_DOCUMENT,
  APP_MAIN_FINISH_SAVING_DOCUMENT,
  APP_MAIN_DOCUMENT_SAVE_ERROR,
  PING,
  PONG
} from "../constants/electronEventTypes";

export default {
  set: () => {
    // render-to-main handshake
    ipcMain.on(PING, (event, arg) => {
      const message = { success: true };
      event.sender.send(PONG, message);
    });

    // open default file
    ipcMain.on(APP_RENDER_LOAD_DEFAULT_DOC, (event, arg) => {
      OpenDefaultDocument((error, doc) => {
        if (error) event.sender.send(APP_MAIN_DOCUMENT_READ_ERROR, error);
        else event.sender.send(APP_MAIN_LOAD_DOC, doc);
      });
    });

    // save the focused document
    ipcMain.on(APP_RENDER_RETURN_FOCUSED_DOCUMENT, (event, doc) => {
      SaveDocument(doc, (err, doc) => {
        if(err) event.sender.send(APP_MAIN_DOCUMENT_SAVE_ERROR, err);
        else event.sender.send(APP_MAIN_FINISH_SAVING_DOCUMENT, doc);
      })
    });
  }
};
