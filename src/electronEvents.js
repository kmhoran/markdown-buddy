// window.ipcRenderer is provided in ~/electron/preload.js
// this file will not run outside of electron
import { MAIN_HANDSHAKE_ACK, MAIN_OPEN_NEW_DOCUMENT, INTERNAL_ERROR } from "./constants/actionTypes";

export function SetElectronListeners(callbacks) {
  // test event listeners
  window.ipcRenderer.on("pong", (event, message) => {
    console.log("Heard event: ", message);
    if (callbacks[MAIN_HANDSHAKE_ACK]) callbacks[MAIN_HANDSHAKE_ACK]();

    // load default document
    window.ipcRenderer.on("main-load-document", (event, doc) => {
      console.log('[electronEvent] got doc: ', doc)
      if(callbacks[MAIN_OPEN_NEW_DOCUMENT])callbacks[MAIN_OPEN_NEW_DOCUMENT](doc);
    });
  });
}

export function PingMainProcess() {
  window.ipcRenderer.send("ping");
}

export function LoadDefaultDocument() {
  window.ipcRenderer.send("load-default-document");
}
