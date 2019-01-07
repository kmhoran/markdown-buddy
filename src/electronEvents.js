// window.ipcRenderer is provided in ~/electron/preload.js
// this file will not run outside of electron
import {
  MAIN_HANDSHAKE_ACK,
  MAIN_OPEN_NEW_DOCUMENT,
  INTERNAL_ERROR
} from "./constants/actionTypes";
import {
  APP_LOAD_DOC,
  APP_DOCUMENT_READ_ERROR,
  APP_LOAD_DEFAULT_DOC,
  APP_REQUEST_FOCUSED_DOCUMENT,
  APP_RETURN_FOCUSED_DOCUMENT,
  PING,
  PONG
} from "./constants/electronEventTypes";

export function SetElectronListeners(callbacks) {
  // test event listeners
  window.ipcRenderer.on(PONG, (event, message) => {
    if (callbacks[MAIN_HANDSHAKE_ACK]) callbacks[MAIN_HANDSHAKE_ACK]();

    // display opened document
    window.ipcRenderer.on(APP_LOAD_DOC, (event, doc) => {
      if (callbacks[MAIN_OPEN_NEW_DOCUMENT])
        callbacks[MAIN_OPEN_NEW_DOCUMENT](doc);
    });

    // return focused document
    window.ipcRenderer.on(APP_REQUEST_FOCUSED_DOCUMENT, (event) => {
      console.log("[e-events] returning focused")
      if(!callbacks[APP_RETURN_FOCUSED_DOCUMENT]) return;
      const doc = callbacks[APP_RETURN_FOCUSED_DOCUMENT]();
      console.log("[e-events]: doc: ", doc);
      window.ipcRenderer.send(APP_RETURN_FOCUSED_DOCUMENT, doc);
    })
  });
}

export function PingMainProcess() {
  window.ipcRenderer.send(PING);
}

export function LoadDefaultDocument() {
  window.ipcRenderer.send(APP_LOAD_DEFAULT_DOC);
}
